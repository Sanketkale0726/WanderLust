const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const upload = require("../utils/multer");
const { isLoggedIn, isHost, isListingOwner } = require("../utils/middleware");

// ==========================================
// 1. INDEX ROUTE: Search, Filters & Categories
// ==========================================
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let { search, maxPrice, minPrice, guests, category, sort } = req.query;
    let query = {};

    // Search by Location, Title, or Country
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { location: searchRegex },
        { country: searchRegex },
        { title: searchRegex },
        { address: searchRegex },
      ];
    }

    // Category Filter
    if (category && category.trim() !== "" && category !== "all") {
      query.category = category.toLowerCase().trim();
    }

    // Price Filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
    }

    // Minimum Guests capacity
    if (guests && !isNaN(guests) && Number(guests) > 0) {
      query.maxGuests = { $gte: Number(guests) };
    }

    // Sort options
    let sortQuery = { createdAt: -1 };
    if (sort === "price_asc") sortQuery = { price: 1 };
    if (sort === "price_desc") sortQuery = { price: -1 };
    if (sort === "popular") sortQuery = { "reviews.length": -1 };

    const listings = await Listing.find(query)
      .populate("owner", "username avatar")
      .populate("reviews")
      .sort(sortQuery);

    res.render("listings/index", {
      listing: listings,
      currentCategory: category || "all",
      searchQuery: search || "",
      maxPrice: maxPrice || "",
      minPrice: minPrice || "",
      guestsCount: guests || "",
      activeSort: sort || "newest",
    });
  })
);

// ==========================================
// 2. MAP DATA API: Returns GeoJSON / List of all listing markers
// ==========================================
router.get(
  "/api/geojson",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({}, "title price location country images geometry category");
    res.json(listings);
  })
);

// ==========================================
// 3. NEW LISTING FORM (Host Only)
// ==========================================
router.get("/new", isLoggedIn, isHost, (req, res) => {
  res.render("listings/new");
});

// ==========================================
// 4. CREATE LISTING
// ==========================================
router.post(
  "/",
  isLoggedIn,
  isHost,
  upload.array("images", 5),
  wrapAsync(async (req, res) => {
    let data = req.body.listings;

    // Amenities parsing (array or string)
    if (!data.amenities) {
      data.amenities = [];
    } else if (typeof data.amenities === "string") {
      data.amenities = [data.amenities];
    }

    // Coordinates fallback
    data.geometry = {
      lat: Number(req.body.lat) || 18.5204,
      lng: Number(req.body.lng) || 73.8567,
    };

    // Images handling
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: "/uploads/" + file.filename,
        filename: file.filename,
      }));
    } else {
      // Default fallback luxury image
      images = [
        {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
          filename: "default_luxury",
        },
      ];
    }
    data.images = images;
    data.owner = req.session.userId;

    const newListing = new Listing(data);
    await newListing.save();

    req.session.success = "✨ Your luxury listing is now live!";
    res.redirect(`/listings/${newListing._id}`);
  })
);

// ==========================================
// 5. SHOW ROUTE: Property details & Reviews
// ==========================================
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const detailList = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username avatar createdAt",
        },
      })
      .populate("owner", "username email phone bio avatar");

    if (!detailList) {
      req.session.error = "Listing not found or may have been removed.";
      return res.redirect("/listings");
    }

    // Calculate average rating
    let avgRating = 0;
    if (detailList.reviews && detailList.reviews.length > 0) {
      const sum = detailList.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      avgRating = (sum / detailList.reviews.length).toFixed(1);
    }

    res.render("listings/show", { detailList, avgRating });
  })
);

// ==========================================
// 6. EDIT FORM (Owner Only)
// ==========================================
router.get(
  "/:id/edit",
  isLoggedIn,
  isHost,
  isListingOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.session.error = "Listing not found!";
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

// ==========================================
// 7. UPDATE LISTING (Owner Only)
// ==========================================
router.patch(
  "/:id",
  isLoggedIn,
  isHost,
  isListingOwner,
  upload.array("images", 5),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let data = req.body.listings;

    // Amenities parsing
    if (!data.amenities) {
      data.amenities = [];
    } else if (typeof data.amenities === "string") {
      data.amenities = [data.amenities];
    }

    // Geometry update
    if (req.body.lat && req.body.lng) {
      data.geometry = {
        lat: Number(req.body.lat),
        lng: Number(req.body.lng),
      };
    }

    const listing = await Listing.findById(id);

    // If new images were uploaded, append or replace
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: "/uploads/" + file.filename,
        filename: file.filename,
      }));
      data.images = [...(listing.images || []), ...newImages];
    }

    await Listing.findByIdAndUpdate(id, data, { runValidators: true });

    req.session.success = "Listing details updated successfully!";
    res.redirect(`/listings/${id}`);
  })
);

// ==========================================
// 8. DELETE LISTING (Owner Only)
// ==========================================
router.delete(
  "/:id",
  isLoggedIn,
  isHost,
  isListingOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.session.success = "Listing was removed successfully.";
    res.redirect("/listings");
  })
);

module.exports = router;
