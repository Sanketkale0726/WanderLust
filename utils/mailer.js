const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "sanketkale0726@gmail.com",
    pass: process.env.EMAIL_PASS || "vliz duus qnxb ejhg",
  },
});

const sendResetEmail = async (email, resetUrl) => {
  try {
    if (!process.env.EMAIL_USER && !process.env.EMAIL_PASS) {
      console.log(`[DEMO EMAIL] Password reset requested for ${email}: ${resetUrl}`);
    }
    await transporter.sendMail({
      from: `"Wanderlust Support" <${process.env.EMAIL_USER || "sanketkale0726@gmail.com"}>`,
      to: email,
      subject: "🔒 Password Reset Request - Wanderlust",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
            <h1 style="color: #ff385c; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">WANDERLUST</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Luxury Stays & Unforgettable Experiences</p>
          </div>
          <p style="font-size: 16px; font-weight: 600;">Hello Traveler,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">
            We received a request to reset your Wanderlust account password. Click the button below to safely create a new password. This link will expire in <strong>1 hour</strong>.
          </p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #ff385c 0%, #e00b41 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 56, 92, 0.3);">Reset My Password</a>
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">If you did not request a password reset, you can safely ignore this email. Your Wanderlust account remains secure.</p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 25px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">© ${new Date().getFullYear()} Wanderlust Inc. All rights reserved.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send reset email (Email service notification):", err.message);
    return false;
  }
};

const sendBookingConfirmation = async (userEmail, booking, listing) => {
  try {
    const checkInStr = new Date(booking.checkIn).toLocaleDateString("en-IN", {
      dateStyle: "medium",
    });
    const checkOutStr = new Date(booking.checkOut).toLocaleDateString("en-IN", {
      dateStyle: "medium",
    });

    await transporter.sendMail({
      from: `"Wanderlust Reservations" <${process.env.EMAIL_USER || "sanketkale0726@gmail.com"}>`,
      to: userEmail,
      subject: `🎉 Booking Confirmed: ${listing.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
            <h1 style="color: #ff385c; margin: 0; font-size: 28px; font-weight: 800;">WANDERLUST</h1>
            <p style="color: #10b981; font-size: 16px; font-weight: 700; margin-top: 8px;">✨ Reservation Confirmed!</p>
          </div>
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #edf2f7;">
            <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px;">${listing.title}</h2>
            <p style="margin: 6px 0; color: #64748b; font-size: 14px;">📍 <strong>Location:</strong> ${listing.location}, ${listing.country}</p>
            <p style="margin: 6px 0; color: #64748b; font-size: 14px;">📅 <strong>Check-in:</strong> ${checkInStr}</p>
            <p style="margin: 6px 0; color: #64748b; font-size: 14px;">📅 <strong>Check-out:</strong> ${checkOutStr} (${booking.nights} night${booking.nights > 1 ? "s" : ""})</p>
            <p style="margin: 6px 0; color: #64748b; font-size: 14px;">👨‍👩‍👧 <strong>Guests:</strong> ${booking.guests} guest${booking.guests > 1 ? "s" : ""}</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between;">
              <span style="font-size: 16px; font-weight: 700; color: #0f172a;">Total Amount Paid:</span>
              <span style="font-size: 18px; font-weight: 800; color: #ff385c;">₹ ${booking.totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            We have notified your host! You can view full trip details, check-in instructions, or download your receipt anytime from your <strong>My Trips</strong> dashboard.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:8080/bookings/my-trips" style="background: linear-gradient(135deg, #ff385c 0%, #e00b41 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block;">View My Trips Dashboard</a>
          </div>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">© ${new Date().getFullYear()} Wanderlust Inc. All rights reserved.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send booking confirmation email (Email service notification):", err.message);
    return false;
  }
};

module.exports = {
  sendResetEmail,
  sendBookingConfirmation,
};
