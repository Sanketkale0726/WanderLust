if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

// Routers
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const bookingsRouter = require("./routes/bookings");
const usersRouter = require("./routes/users");
const wishlistRouter = require("./routes/wishlist");
const aiRouter = require("./routes/ai");

// ==========================================
// 1. CONFIGURATION & ENGINE
// ==========================================
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ==========================================
// 2. SESSION CONFIGURATION
// ==========================================
const sessionConfig = {
  name: "wanderlust_session",
  secret: process.env.SESSION_SECRET || "wanderlust_super_secure_secret_key_2026",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 Days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

// ==========================================
// 3. FLASH & GLOBAL LOCALS MIDDLEWARE
// ==========================================
app.use(async (req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  res.locals.session = req.session;
  res.locals.currentUser = req.session.userId ? {
    _id: req.session.userId,
    username: req.session.username,
    email: req.session.userEmail,
    role: req.session.role,
  } : null;

  // Load live wishlist items for logged in user
  res.locals.userWishlist = [];
  if (req.session.userId) {
    try {
      const u = await User.findById(req.session.userId, "wishlist");
      if (u && u.wishlist) {
        res.locals.userWishlist = u.wishlist.map((id) => id.toString());
      }
    } catch (e) {
      console.error("Wishlist locals error:", e.message);
    }
  }

  delete req.session.success;
  delete req.session.error;
  next();
});

// ==========================================
// 4. DATABASE CONNECTION
// ==========================================
const DB_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

mongoose
  .connect(DB_URL)
  .then(() => console.log("✅ MongoDB Connected: Wanderlust Database Active"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// ==========================================
// 5. ROUTES
// ==========================================
app.get("/", (req, res) => res.redirect("/listings"));

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/wishlist", wishlistRouter);
app.use("/api/ai", aiRouter);
app.use("/", bookingsRouter);
app.use("/", usersRouter);

// ==========================================
// 6. ERROR HANDLING
// ==========================================
app.use((req, res, next) => {
  next(new ExpressError(404, "Oops! The page you are looking for doesn't exist."));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong on our end!" } = err;
  res.status(statusCode).render("listings/error", {
    statusCode,
    message,
    err: process.env.NODE_ENV === "development" ? err : {},
  });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Wanderlust Server is soaring on http://localhost:${PORT}`);
});