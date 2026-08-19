// ==========================================================================
// REAL-TIME DYNAMIC PRICE CALCULATOR (SHOW PAGE)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const checkInInput = document.getElementById("checkInDate");
  const checkOutInput = document.getElementById("checkOutDate");
  const guestsSelect = document.getElementById("guestsCountSelect");

  const nightlyCalcText = document.getElementById("nightlyCalcText");
  const basePriceTotal = document.getElementById("basePriceTotal");
  const taxTotal = document.getElementById("taxTotal");
  const finalTotalText = document.getElementById("finalTotalText");

  if (!checkInInput || !checkOutInput || !window.currentListing) return;

  const pricePerNight = window.currentListing.price || 1000;
  const cleaningFee = window.currentListing.cleaningFee || 499;
  const serviceFee = window.currentListing.serviceFee || 299;

  // Set default dates: Today as min check-in, Tomorrow as default check-out
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
  checkInInput.min = todayFormatted;

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

  checkInInput.value = todayFormatted;
  checkOutInput.min = tomorrowFormatted;
  checkOutInput.value = tomorrowFormatted;

  function recalculatePrice() {
    const inDate = new Date(checkInInput.value);
    const outDate = new Date(checkOutInput.value);

    // Ensure checkOut is at least 1 day after checkIn
    if (outDate <= inDate) {
      const nextDay = new Date(inDate);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.value = nextDay.toISOString().split("T")[0];
    }

    const updatedOutDate = new Date(checkOutInput.value);
    const diffTime = Math.abs(updatedOutDate - inDate);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const basePrice = pricePerNight * nights;
    const subtotal = basePrice + cleaningFee + serviceFee;
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;

    // Update DOM
    if (nightlyCalcText) {
      nightlyCalcText.innerText = `₹ ${pricePerNight.toLocaleString("en-IN")} × ${nights} night${nights > 1 ? "s" : ""}`;
    }
    if (basePriceTotal) {
      basePriceTotal.innerText = `₹ ${basePrice.toLocaleString("en-IN")}`;
    }
    if (taxTotal) {
      taxTotal.innerText = `₹ ${tax.toLocaleString("en-IN")}`;
    }
    if (finalTotalText) {
      finalTotalText.innerText = `₹ ${grandTotal.toLocaleString("en-IN")}`;
    }
  }

  // Bind event listeners
  checkInInput.addEventListener("change", () => {
    // Update minimum checkout date based on new check-in
    const selectedIn = new Date(checkInInput.value);
    const minOut = new Date(selectedIn);
    minOut.setDate(minOut.getDate() + 1);
    checkOutInput.min = minOut.toISOString().split("T")[0];

    recalculatePrice();
  });

  checkOutInput.addEventListener("change", recalculatePrice);
  if (guestsSelect) guestsSelect.addEventListener("change", recalculatePrice);

  // Initial calculation on page load
  recalculatePrice();
});
