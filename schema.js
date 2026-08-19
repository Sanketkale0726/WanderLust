const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listings: Joi.object({
    title: Joi.string().required().trim().min(3).max(120),
    description: Joi.string().required().trim().min(5),
    price: Joi.number().min(0).required(),
    cleaningFee: Joi.number().min(0).default(499).allow("", null),
    serviceFee: Joi.number().min(0).default(299).allow("", null),
    location: Joi.string().required().trim(),
    country: Joi.string().required().trim(),
    address: Joi.string().allow("", null).trim(),
    category: Joi.string()
      .valid(
        "beachfront",
        "cabins",
        "trending",
        "luxury",
        "villas",
        "iconic",
        "mountains",
        "pools",
        "farms",
        "camping",
        "rooms",
        "castles",
        "normal",
        "deluxe",
        "suite",
        "resort"
      )
      .default("trending"),
    maxGuests: Joi.number().integer().min(1).default(2).allow("", null),
    bedrooms: Joi.number().integer().min(1).default(1).allow("", null),
    beds: Joi.number().integer().min(1).default(1).allow("", null),
    bathrooms: Joi.number().integer().min(1).default(1).allow("", null),
    lat: Joi.number().allow(null, ""),
    lng: Joi.number().allow(null, ""),
    amenities: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().allow("")
    ),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required().trim().min(2).max(1000),
  }).required(),
});

module.exports.bookingSchema = Joi.object({
  checkIn: Joi.date().required(),
  checkOut: Joi.date().greater(Joi.ref("checkIn")).required(),
  guests: Joi.number().integer().min(1).required(),
  specialRequests: Joi.string().allow("", null).max(500),
});

module.exports.userSignupSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid("user", "owner").default("user"),
  phone: Joi.string().allow("", null),
});

module.exports.userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});