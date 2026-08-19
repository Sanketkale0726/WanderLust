const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("./ExpressError");
const { listingSchema, reviewSchema, bookingSchema } = require("../schema");

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    req.session.redirectUrl = req.originalUrl;
    req.session.error = "Please sign in to continue!";
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Check if current user is the owner of a listing
module.exports.isListingOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.session.error = "Listing does not exist!";
    return res.redirect("/listings");
  }

  // Admins or the creator owner can edit/delete
  if (req.session.role !== "admin" && (!listing.owner || !listing.owner.equals(req.session.userId))) {
    req.session.error = "You don't have permission to modify this listing!";
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Check if user has host/owner role
module.exports.isHost = (req, res, next) => {
  if (req.session.role !== "owner" && req.session.role !== "admin") {
    req.session.error = "Only registered hosts can perform this action!";
    return res.redirect("/listings");
  }
  next();
};

// Check if current user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.session.error = "Review not found!";
    return res.redirect(`/listings/${id}`);
  }
  if (req.session.role !== "admin" && (!review.author || !review.author.equals(req.session.userId))) {
    req.session.error = "You are not authorized to delete this review!";
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Validate listing input with Joi
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Validate review input with Joi
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Validate booking input with Joi
module.exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
