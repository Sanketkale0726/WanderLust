// ==========================================================================
// AJAX WISHLIST HEART TOGGLER
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const wishlistButtons = document.querySelectorAll(".wishlist-heart-btn, .wishlist-heart-btn-show");
  const navBadge = document.getElementById("navWishlistBadge");

  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const listingId = btn.getAttribute("data-listing-id");
      if (!listingId) return;

      try {
        const response = await fetch(`/wishlist/toggle/${listingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 401) {
          // If not logged in, redirect to login
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (data.success) {
          // Toggle UI state
          if (data.isFavorited) {
            btn.classList.add("favorited");
            const icon = btn.querySelector("i");
            if (icon) icon.className = "fa-solid fa-heart text-danger";
            btn.classList.add("heart-pulsing");
            setTimeout(() => btn.classList.remove("heart-pulsing"), 400);
          } else {
            btn.classList.remove("favorited");
            const icon = btn.querySelector("i");
            if (icon) {
              if (btn.classList.contains("wishlist-heart-btn-show")) {
                icon.className = "fa-regular fa-heart me-1";
              } else {
                icon.className = "fa-regular fa-heart";
              }
            }
            // If on wishlist page, remove the card row
            const cardCol = document.getElementById(`wishlist_item_${listingId}`);
            if (cardCol) {
              cardCol.style.transition = "opacity 0.3s ease, transform 0.3s ease";
              cardCol.style.opacity = "0";
              cardCol.style.transform = "scale(0.8)";
              setTimeout(() => cardCol.remove(), 300);
            }
          }

          // Update text if on show page
          const textSpan = btn.querySelector(".wishlist-btn-text");
          if (textSpan) {
            textSpan.innerText = data.isFavorited ? "Saved" : "Save";
          }

          // Update navbar wishlist badge counter
          if (navBadge) {
            navBadge.innerText = data.wishlistCount;
            if (data.wishlistCount > 0) {
              navBadge.classList.remove("d-none");
            } else {
              navBadge.classList.add("d-none");
            }
          }
        }
      } catch (err) {
        console.error("Wishlist toggle error:", err);
      }
    });
  });
});
