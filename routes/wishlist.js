const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../utils/middleware");

// ==========================================
// 1. VIEW WISHLIST PAGE
// ==========================================
router.get(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.session.userId).populate({
      path: "wishlist",
      populate: { path: "reviews" },
    });

    res.render("wishlist/index", {
      wishlist: user ? user.wishlist : [],
    });
  })
);

// ==========================================
// 2. TOGGLE WISHLIST ITEM (AJAX API)
// ==========================================
router.post(
  "/toggle/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const index = user.wishlist.indexOf(id);
    let isFavorited = false;

    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      isFavorited = false;
    } else {
      // Add to wishlist
      user.wishlist.push(id);
      isFavorited = true;
    }

    await user.save();

    res.json({
      success: true,
      isFavorited,
      wishlistCount: user.wishlist.length,
      message: isFavorited ? "Added to Wishlist ❤️" : "Removed from Wishlist",
    });
  })
);

module.exports = router;
