// ==========================================================================
// LEAFLET MAP ENGINE: Global Map, Pinpoint Map & Coordinate Picker
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  // Custom Coral Marker Icon for Wanderlust
  const wanderlustIcon = L.divIcon({
    className: "custom-map-pin",
    html: `<div style="background-color: #ff385c; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(255, 56, 92, 0.4); border: 2px solid white; cursor: pointer;"><i class="fa-solid fa-hotel" style="font-size: 14px;"></i></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
  });

  // 1. ALL LISTINGS GLOBAL MAP (Index Page)
  const indexMapElement = document.getElementById("indexMap");
  if (indexMapElement && window.listingMarkers && window.listingMarkers.length > 0) {
    const firstMarker = window.listingMarkers[0];
    const map = L.map("indexMap").setView([firstMarker.lat || 18.5204, firstMarker.lng || 73.8567], 5);
    window.indexLeafletMap = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const bounds = [];

    window.listingMarkers.forEach((item) => {
      if (item.lat && item.lng) {
        bounds.push([item.lat, item.lng]);

        const popupContent = `
          <div style="width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <img src="${item.image}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
            <h6 style="margin: 0 0 4px 0; font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h6>
            <p style="margin: 0 0 6px 0; color: #717171; font-size: 11px;">📍 ${item.location}, ${item.country}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 6px;">
              <strong style="color: #222; font-size: 13px;">₹ ${Number(item.price).toLocaleString("en-IN")} <span style="font-weight: normal; font-size: 10px; color: #717171;">/ night</span></strong>
              <a href="/listings/${item.id}" style="background: #ff385c; color: white; padding: 3px 10px; border-radius: 20px; text-decoration: none; font-size: 11px; font-weight: 600;">View</a>
            </div>
          </div>
        `;

        L.marker([item.lat, item.lng], { icon: wanderlustIcon })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  // 2. SHOW PAGE PINPOINT MAP
  const showMapElement = document.getElementById("showMap");
  if (showMapElement && window.currentListing) {
    const lat = window.currentListing.lat || 18.5204;
    const lng = window.currentListing.lng || 73.8567;

    const showMap = L.map("showMap").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(showMap);

    // Add pulsing circle for exact stay zone
    L.circle([lat, lng], {
      color: '#ff385c',
      fillColor: '#ff385c',
      fillOpacity: 0.15,
      radius: 400
    }).addTo(showMap);

    L.marker([lat, lng], { icon: wanderlustIcon })
      .addTo(showMap)
      .bindPopup(`<strong style="font-family: sans-serif;">${window.currentListing.title}</strong><br><span style="font-size:12px; color:#717171;">Exact location provided upon booking</span>`)
      .openPopup();
  }

  // 3. ADD / EDIT LISTING MAP PICKER (Click to set lat/lng)
  const pickerMapElement = document.getElementById("pickerMap");
  if (pickerMapElement) {
    const latInput = document.getElementById("pickerLat");
    const lngInput = document.getElementById("pickerLng");

    let initialLat = parseFloat(latInput ? latInput.value : 18.5204) || 18.5204;
    let initialLng = parseFloat(lngInput ? lngInput.value : 73.8567) || 73.8567;

    const pickerMap = L.map("pickerMap").setView([initialLat, initialLng], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(pickerMap);

    let pickerMarker = L.marker([initialLat, initialLng], {
      draggable: true,
      icon: wanderlustIcon
    }).addTo(pickerMap);

    // Marker Drag event
    pickerMarker.on("dragend", (e) => {
      const pos = e.target.getLatLng();
      if (latInput) latInput.value = pos.lat.toFixed(6);
      if (lngInput) lngInput.value = pos.lng.toFixed(6);
    });

    // Map Click event
    pickerMap.on("click", (e) => {
      pickerMarker.setLatLng(e.latlng);
      if (latInput) latInput.value = e.latlng.lat.toFixed(6);
      if (lngInput) lngInput.value = e.latlng.lng.toFixed(6);
    });
  }

});
