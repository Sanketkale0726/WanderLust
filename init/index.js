const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

const DB_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(DB_URL);
  console.log("Connected to MongoDB successfully for Seeding");
}

const initDB = async () => {
  try {
    await main();

    // 1. Reset existing collections
    await Listing.deleteMany({});
    await Review.deleteMany({});

    // 2. Find or create demo host & demo traveler
    let demoHost = await User.findOne({ email: "host@wanderlust.com" });
    if (!demoHost) {
      const hostHash = await bcrypt.hash("host123", 10);
      demoHost = await new User({
        username: "Sophia Sterling",
        email: "host@wanderlust.com",
        password: hostHash,
        role: "owner",
        phone: "+91 98765 00001",
        bio: "Superhost with 5+ years creating bespoke luxury stays across the globe.",
        avatar: {
          url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
          filename: "host_avatar",
        },
      }).save();
      console.log("Created Demo Superhost (host@wanderlust.com / host123)");
    }

    let demoUser = await User.findOne({ email: "traveler@wanderlust.com" });
    if (!demoUser) {
      const userHash = await bcrypt.hash("traveler123", 10);
      demoUser = await new User({
        username: "Liam Vance",
        email: "traveler@wanderlust.com",
        password: userHash,
        role: "user",
        phone: "+91 98765 00002",
        bio: "Digital nomad and architectural travel photographer.",
        avatar: {
          url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
          filename: "traveler_avatar",
        },
      }).save();
      console.log("Created Demo Traveler (traveler@wanderlust.com / traveler123)");
    }

    // 3. Create sample reviews
    const review1 = await new Review({
      comment: "Absolutely breathtaking views and world-class hospitality! The infinity pool at sunset was magical.",
      rating: 5,
      author: demoUser._id,
    }).save();

    const review2 = await new Review({
      comment: "Super clean, aesthetic interiors and very responsive host. Will definitely book again next season!",
      rating: 5,
      author: demoUser._id,
    }).save();

    // 4. Map sample listings to host
    const enrichedListings = initData.data.map((obj, idx) => ({
      ...obj,
      owner: demoHost._id,
      reviews: idx % 2 === 0 ? [review1._id, review2._id] : [review1._id],
    }));

    await Listing.insertMany(enrichedListings);
    console.log(`✅ Seeded ${enrichedListings.length} luxury listings into Wanderlust database!`);

    await mongoose.connection.close();
    console.log("Database connection closed. Seed complete!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

initDB();