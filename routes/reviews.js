const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../utils/middleware");

// ==========================================
// 1. CREATE REVIEW
// ==========================================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.session.error = "Listing not found!";
      return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.session.userId;
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.session.success = "Thank you! Your review has been posted.";
    res.redirect(`/listings/${id}`);
  })
);

// ==========================================
// 2. DELETE REVIEW
// ==========================================
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.session.success = "Review deleted successfully.";
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
