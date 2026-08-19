// ==========================================================================
// CORE APPLICATION JAVASCRIPT
// ==========================================================================

(() => {
  'use strict';

  // 1. BOOTSTRAP FORM VALIDATION
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      },
      false
    );
  });

  // 2. DARK / LIGHT MODE SWITCHER WITH LOCALSTORAGE
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  const currentTheme = localStorage.getItem('wanderlust_theme') || 'light';
  htmlRoot.setAttribute('data-bs-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-bs-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('wanderlust_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun text-warning';
    } else {
      themeIcon.className = 'fa-regular fa-moon';
    }
  }

  // 3. TAX TOGGLE SWITCH (INDEX LISTINGS)
  const taxSwitch = document.getElementById('taxSwitch');
  if (taxSwitch) {
    taxSwitch.addEventListener('change', (e) => {
      const basePrices = document.querySelectorAll('.base-price');
      const taxPrices = document.querySelectorAll('.tax-price');

      if (e.target.checked) {
        basePrices.forEach((el) => el.classList.add('d-none'));
        taxPrices.forEach((el) => el.classList.remove('d-none'));
      } else {
        basePrices.forEach((el) => el.classList.remove('d-none'));
        taxPrices.forEach((el) => el.classList.add('d-none'));
      }
    });
  }

  // 4. MAP / LIST TOGGLE ON INDEX PAGE
  const toggleMapBtn = document.getElementById('toggleMapBtn');
  const toggleMapText = document.getElementById('toggleMapText');
  const mapContainer = document.getElementById('allListingsMapContainer');
  const listingsGrid = document.getElementById('listingsGrid');

  if (toggleMapBtn && mapContainer) {
    toggleMapBtn.addEventListener('click', () => {
      const isHidden = mapContainer.classList.contains('d-none');
      if (isHidden) {
        mapContainer.classList.remove('d-none');
        toggleMapText.innerText = 'Hide Map';
        toggleMapBtn.innerHTML = '<i class="fa-solid fa-list me-2"></i> Hide Map';
        // Invalidate map size so Leaflet renders full canvas
        if (window.indexLeafletMap) {
          setTimeout(() => {
            window.indexLeafletMap.invalidateSize();
          }, 200);
        }
      } else {
        mapContainer.classList.add('d-none');
        toggleMapText.innerText = 'Show Map';
        toggleMapBtn.innerHTML = '<i class="fa-solid fa-map me-2"></i> Show Map';
      }
    });
  }

  // 5. AI TRAVEL INSIGHTS GENERATOR (SHOW PAGE)
  const aiBtn = document.getElementById('generateAiInsightsBtn');
  const aiContent = document.getElementById('aiInsightsContent');

  if (aiBtn && aiContent) {
    aiBtn.addEventListener('click', async () => {
      const listingId = aiBtn.getAttribute('data-listing-id');
      aiBtn.disabled = true;
      aiBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Generating insights...';

      try {
        const response = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId }),
        });
        const data = await response.json();

        if (data.success) {
          let html = `
            <div class="mt-3 p-3 bg-white rounded-3 border shadow-sm">
              <h6 class="fw-bold text-danger mb-2">${data.title}</h6>
              <ul class="list-unstyled mb-3">
                ${data.highlights.map((h) => `<li class="small text-secondary mb-2">${h}</li>`).join('')}
              </ul>
              <div class="d-flex flex-wrap gap-2 pt-2 border-top">
                <span class="badge bg-light text-dark border">🌤️ Best Season: ${data.bestSeason}</span>
                <span class="badge bg-light text-dark border">⏱️ Suggested: ${data.suggestedDuration}</span>
              </div>
            </div>
          `;
          aiContent.innerHTML = html;
        } else {
          aiContent.innerHTML = `<p class="text-danger small">Failed to generate AI insights.</p>`;
        }
      } catch (err) {
        aiContent.innerHTML = `<p class="text-danger small">AI Service is currently preparing fresh insights. Please try again in a moment.</p>`;
      } finally {
        aiBtn.disabled = false;
        aiBtn.innerHTML = '<i class="fa-solid fa-sparkles me-1"></i> Refresh Insights';
      }
    });
  }
})();