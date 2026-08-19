const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const upload = require("../utils/multer");
const { isLoggedIn } = require("../utils/middleware");
const { sendResetEmail } = require("../utils/mailer");

// ==========================================
// 1. SIGNUP
// ==========================================
router.get("/signup", (req, res) => {
  if (req.session.userId) return res.redirect("/listings");
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    const { username, email, password, role = "user", phone = "" } = req.body;

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      req.session.error = "An account with this email already exists!";
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: phone.trim(),
    });

    await newUser.save();

    // Auto-login after signup
    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    req.session.userEmail = newUser.email;
    req.session.role = newUser.role;

    req.session.success = `🎉 Welcome to Wanderlust, ${newUser.username}!`;
    res.redirect("/listings");
  })
);

// ==========================================
// 2. LOGIN
// ==========================================
router.get("/login", (req, res) => {
  if (req.session.userId) return res.redirect("/listings");
  res.render("users/login");
});

router.post(
  "/login",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      req.session.error = "No user found with this email address.";
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = "Incorrect password. Please try again.";
      return res.redirect("/login");
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.userEmail = user.email;
    req.session.role = user.role;

    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    req.session.success = `👋 Welcome back, ${user.username}!`;
    res.redirect(redirectUrl);
  })
);

// ==========================================
// 3. LOGOUT
// ==========================================
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Session destroy error:", err);
    res.redirect("/login");
  });
});

// ==========================================
// 4. FORGOT PASSWORD
// ==========================================
router.get("/forgot", (req, res) => {
  res.render("users/forgot");
});

router.post(
  "/forgot",
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      req.session.error = "No account found with that email address.";
      return res.redirect("/forgot");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:8080/reset/${token}`;
    await sendResetEmail(user.email, resetUrl);

    req.session.success = `Password reset link has been dispatched to ${user.email}. Check your inbox!`;
    res.redirect("/login");
  })
);

// ==========================================
// 5. RESET PASSWORD
// ==========================================
router.get(
  "/reset/:token",
  wrapAsync(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      req.session.error = "Password reset token is invalid or has expired.";
      return res.redirect("/forgot");
    }

    res.render("users/reset", { token });
  })
);

router.post(
  "/reset/:token",
  wrapAsync(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      req.session.error = "Password reset token is invalid or has expired.";
      return res.redirect("/forgot");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    req.session.success = "Your password has been successfully reset. Please log in.";
    res.redirect("/login");
  })
);

// ==========================================
// 6. USER PROFILE & SETTINGS
// ==========================================
router.get(
  "/profile",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.session.userId).populate("wishlist");
    const myTripsCount = await Booking.countDocuments({ user: req.session.userId });
    const myListingsCount = await Listing.countDocuments({ owner: req.session.userId });

    res.render("users/profile", {
      user,
      myTripsCount,
      myListingsCount,
    });
  })
);

router.post(
  "/profile",
  isLoggedIn,
  upload.single("avatar"),
  wrapAsync(async (req, res) => {
    const { username, phone, bio } = req.body;
    const user = await User.findById(req.session.userId);

    if (username) user.username = username.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();

    if (req.file) {
      user.avatar = {
        url: "/uploads/" + req.file.filename,
        filename: req.file.filename,
      };
    }

    await user.save();
    req.session.username = user.username;

    req.session.success = "Your profile has been updated!";
    res.redirect("/profile");
  })
);

module.exports = router;
