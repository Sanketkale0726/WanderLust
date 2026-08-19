const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        },
        filename: {
          type: String,
          default: "listing_image",
        },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cleaningFee: {
      type: Number,
      default: 499,
      min: 0,
    },
    serviceFee: {
      type: Number,
      default: 299,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    geometry: {
      lat: {
        type: Number,
        default: 18.5204, // Default to Pune / India
      },
      lng: {
        type: Number,
        default: 73.8567,
      },
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: "trending",
    },
    maxGuests: {
      type: Number,
      default: 2,
      min: 1,
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: 1,
    },
    beds: {
      type: Number,
      default: 1,
      min: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// Cascade delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews && listing.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);