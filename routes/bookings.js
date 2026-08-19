const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isHost } = require("../utils/middleware");
const { sendBookingConfirmation } = require("../utils/mailer");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demoKey123",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_demoSecret123",
});

// ==========================================
// 1. INITIATE BOOKING (from Listing Show Page)
// ==========================================
router.post(
  "/listings/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests, specialRequests } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.session.error = "Listing not found!";
      return res.redirect("/listings");
    }

    // Date validations
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inDate < today) {
      req.session.error = "Check-in date cannot be in the past!";
      return res.redirect(`/listings/${id}`);
    }

    if (outDate <= inDate) {
      req.session.error = "Check-out date must be after check-in date!";
      return res.redirect(`/listings/${id}`);
    }

    const guestsNum = Number(guests) || 1;
    if (guestsNum > listing.maxGuests) {
      req.session.error = `Maximum allowed guests for this stay is ${listing.maxGuests}.`;
      return res.redirect(`/listings/${id}`);
    }

    // Price Calculation
    const diffTime = Math.abs(outDate - inDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const nightlyRate = listing.price;
    const basePrice = nightlyRate * diffDays;
    const cleaningFee = listing.cleaningFee || 499;
    const serviceFee = listing.serviceFee || 299;
    const subtotal = basePrice + cleaningFee + serviceFee;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const totalPrice = subtotal + tax;

    // Create Razorpay Mock/Live order
    let razorpayOrderId = "order_" + Math.random().toString(36).substring(2, 12);
    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const order = await razorpay.orders.create({
          amount: totalPrice * 100, // paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        });
        razorpayOrderId = order.id;
      }
    } catch (e) {
      console.log("Razorpay order creation fallback:", e.message);
    }

    // Store in session for payment processing
    req.session.bookingData = {
      listingId: listing._id.toString(),
      checkIn,
      checkOut,
      guests: guestsNum,
      nights: diffDays,
      nightlyRate,
      basePrice,
      cleaningFee,
      serviceFee,
      tax,
      totalPrice,
      specialRequests: specialRequests || "",
      razorpayOrderId,
    };

    res.redirect("/payment");
  })
);

// ==========================================
// 2. PAYMENT CHECKOUT PAGE
// ==========================================
router.get("/payment", isLoggedIn, async (req, res) => {
  const bookingData = req.session.bookingData;
  if (!bookingData) {
    req.session.error = "No active booking session found. Please select a property first.";
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(bookingData.listingId);
  if (!listing) {
    req.session.error = "Listing not found.";
    return res.redirect("/listings");
  }

  res.render("payment/payment", {
    bookingData,
    listing,
    razorpayKey: process.env.RAZORPAY_KEY_ID || "rzp_test_demoKey123",
  });
});

// ==========================================
// 3. CONFIRM PAYMENT & CREATE BOOKING
// ==========================================
router.post(
  "/payment",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const bookingData = req.session.bookingData;
    if (!bookingData) {
      req.session.error = "Session expired. Please re-initiate booking.";
      return res.redirect("/listings");
    }

    const {
      paymentMethod = "Credit/Debit Card",
      razorpayPaymentId = "pay_" + Math.random().toString(36).substring(2, 10),
    } = req.body;

    const listing = await Listing.findById(bookingData.listingId);
    if (!listing) {
      req.session.error = "Listing not found.";
      return res.redirect("/listings");
    }

    // Create persistent booking
    const newBooking = new Booking({
      listing: listing._id,
      user: req.session.userId,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      guests: bookingData.guests,
      nights: bookingData.nights,
      nightlyRate: bookingData.nightlyRate,
      basePrice: bookingData.basePrice,
      cleaningFee: bookingData.cleaningFee,
      serviceFee: bookingData.serviceFee,
      tax: bookingData.tax,
      totalPrice: bookingData.totalPrice,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod,
      razorpayOrderId: bookingData.razorpayOrderId,
      razorpayPaymentId,
      specialRequests: bookingData.specialRequests,
    });

    await newBooking.save();

    // Clear session booking
    req.session.bookingData = null;

    // Send email confirmation
    if (req.session.userEmail) {
      sendBookingConfirmation(req.session.userEmail, newBooking, listing);
    }

    req.session.success = `🎉 Reservation confirmed! Booking ID: #${newBooking._id.toString().slice(-6).toUpperCase()}`;
    res.redirect("/bookings/my-trips");
  })
);

// ==========================================
// 4. MY TRIPS / USER RESERVATION HISTORY
// ==========================================
router.get(
  "/bookings/my-trips",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ user: req.session.userId })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("bookings/my_trips", { bookings });
  })
);

// ==========================================
// 5. CANCEL BOOKING
// ==========================================
router.post(
  "/bookings/:id/cancel",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      req.session.error = "Booking not found.";
      return res.redirect("/bookings/my-trips");
    }

    if (!booking.user.equals(req.session.userId) && req.session.role !== "admin") {
      req.session.error = "You are not authorized to cancel this booking.";
      return res.redirect("/bookings/my-trips");
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    req.session.success = "Your reservation has been cancelled. Refund initiated.";
    res.redirect("/bookings/my-trips");
  })
);

// ==========================================
// 6. HOST DASHBOARD / RESERVATION MANAGEMENT
// ==========================================
router.get(
  "/bookings/manage",
  isLoggedIn,
  isHost,
  wrapAsync(async (req, res) => {
    // Find all listings owned by this user
    const myListings = await Listing.find({ owner: req.session.userId });
    const listingIds = myListings.map((l) => l._id);

    // Find all bookings for these listings
    const hostBookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("listing")
      .populate("user", "username email phone avatar")
      .sort({ createdAt: -1 });

    // Calculate revenue analytics
    const totalEarnings = hostBookings
      .filter((b) => b.paymentStatus === "paid" && b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const activeReservations = hostBookings.filter(
      (b) => b.status === "confirmed" && new Date(b.checkOut) >= new Date()
    ).length;

    res.render("bookings/dashboard", {
      myListings,
      hostBookings,
      totalEarnings,
      totalReservations: hostBookings.length,
      activeReservations,
    });
  })
);

// ==========================================
// 7. HOST UPDATE BOOKING STATUS
// ==========================================
router.patch(
  "/bookings/:id/status",
  isLoggedIn,
  isHost,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findById(id).populate("listing");

    if (!booking || !booking.listing.owner.equals(req.session.userId)) {
      req.session.error = "Unauthorized operation.";
      return res.redirect("/bookings/manage");
    }

    booking.status = status;
    await booking.save();

    req.session.success = `Booking status updated to ${status}.`;
    res.redirect("/bookings/manage");
  })
);

module.exports = router;
