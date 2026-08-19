const sampleListings = [
  {
    title: "Azure Horizon Beachfront Villa",
    description: "Perched right over the golden sands of Baga Beach with panoramic ocean views, private infinity pool, dedicated butler, and outdoor sundown terrace.",
    images: [
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80", filename: "goa_villa_1" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", filename: "goa_villa_2" },
      { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", filename: "goa_villa_3" }
    ],
    price: 8500,
    cleaningFee: 800,
    serviceFee: 450,
    location: "Goa",
    country: "India",
    address: "Baga Ocean Promenade, North Goa",
    category: "beachfront",
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    geometry: { lat: 15.5527, lng: 73.7517 },
    amenities: ["Beach Access", "Private Swimming Pool", "Fast Wi-Fi", "Air Conditioning", "Dedicated Workspace", "Barbeque Grill", "Free Parking"]
  },
  {
    title: "The Himalayan Cedar Glass Cabin",
    description: "Nestled amidst ancient deodar forests in Old Manali, this architectural glass cabin offers 360-degree snow-capped peak views, indoor fireplace, and heated jacuzzi.",
    images: [
      { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", filename: "manali_cabin_1" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", filename: "manali_cabin_2" },
      { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80", filename: "manali_cabin_3" }
    ],
    price: 4800,
    cleaningFee: 499,
    serviceFee: 299,
    location: "Manali",
    country: "India",
    address: "Log Huts Road, Old Manali, Himachal Pradesh",
    category: "cabins",
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    geometry: { lat: 32.2432, lng: 77.1892 },
    amenities: ["Mountain View", "Hot Tub / Jacuzzi", "Fast Wi-Fi", "Dedicated Workspace", "Kitchen & Utensils", "Free Parking", "Pet Friendly"]
  },
  {
    title: "Royal Rajputana Heritage Haveli",
    description: "Live like royal royalty in this restored 18th-century palace suite overlooking the majestic Mehrangarh Fort. Features ornate jharokhas, marble courtyards, and rooftop dining.",
    images: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80", filename: "jaipur_palace_1" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80", filename: "jaipur_palace_2" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", filename: "jaipur_palace_3" }
    ],
    price: 12000,
    cleaningFee: 1200,
    serviceFee: 650,
    location: "Jaipur",
    country: "India",
    address: "Amer Palace Road, Jaipur, Rajasthan",
    category: "castles",
    maxGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    geometry: { lat: 26.9124, lng: 75.7873 },
    amenities: ["Private Swimming Pool", "24/7 Security", "Air Conditioning", "HD TV with Netflix", "Balcony / Terrace", "Fast Wi-Fi", "Free Parking"]
  },
  {
    title: "Minimalist Marine Drive Skyline Penthouse",
    description: "An ultra-modern sea-facing penthouse along South Mumbai's famous Queen's Necklace. Spectacular sunset vistas, floor-to-ceiling glass windows, and designer Italian interiors.",
    images: [
      { url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", filename: "mumbai_penthouse_1" },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", filename: "mumbai_penthouse_2" }
    ],
    price: 9500,
    cleaningFee: 750,
    serviceFee: 500,
    location: "Mumbai",
    country: "India",
    address: "Marine Drive, Churchgate, Mumbai",
    category: "iconic",
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    geometry: { lat: 18.9438, lng: 72.8234 },
    amenities: ["Air Conditioning", "Dedicated Workspace", "Fast Wi-Fi", "HD TV with Netflix", "Kitchen & Utensils", "24/7 Security"]
  },
  {
    title: "Palm Jumeirah Infinity Pool Mansion",
    description: "Exquisite luxury waterfront mansion situated on the iconic Palm Jumeirah in Dubai. Features private beach access, temperature-controlled infinity pool, cinema room, and private yacht dock.",
    images: [
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", filename: "dubai_mansion_1" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", filename: "dubai_mansion_2" }
    ],
    price: 24000,
    cleaningFee: 1800,
    serviceFee: 1200,
    location: "Dubai",
    country: "UAE",
    address: "Frond N, Palm Jumeirah, Dubai",
    category: "luxury",
    maxGuests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 6,
    geometry: { lat: 25.1124, lng: 55.1390 },
    amenities: ["Beach Access", "Private Swimming Pool", "Hot Tub / Jacuzzi", "EV Charger", "Dedicated Workspace", "Barbeque Grill", "Fast Wi-Fi"]
  },
  {
    title: "Lakeside Backwater Retreat Villa",
    description: "Tranquil traditional Kerala villa floating alongside serene Vembanad Lake in Kumarakom. Includes private boat dock, Ayurvedic open-air shower, and lush organic spice gardens.",
    images: [
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", filename: "kerala_retreat_1" },
      { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", filename: "kerala_retreat_2" }
    ],
    price: 5200,
    cleaningFee: 500,
    serviceFee: 300,
    location: "Kerala",
    country: "India",
    address: "Vembanad Lake Shore, Kumarakom",
    category: "villas",
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    geometry: { lat: 9.6175, lng: 76.4301 },
    amenities: ["Private Swimming Pool", "Kitchen & Utensils", "Free Parking", "Balcony / Terrace", "Fast Wi-Fi", "Pet Friendly"]
  },
  {
    title: "Bali Tropical Bamboo Jungle Treehouse",
    description: "Eco-luxury open-air bamboo paradise surrounded by sacred rice terraces and cascading waterfalls in Ubud. Enjoy sun-drenched plunge pool and morning yoga pavilion.",
    images: [
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80", filename: "bali_treehouse_1" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80", filename: "bali_treehouse_2" }
    ],
    price: 7200,
    cleaningFee: 600,
    serviceFee: 400,
    location: "Bali",
    country: "Indonesia",
    address: "Tegallalang, Ubud, Bali",
    category: "trending",
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    geometry: { lat: -8.4333, lng: 115.2833 },
    amenities: ["Private Swimming Pool", "Mountain View", "Fast Wi-Fi", "Free Parking", "Kitchen & Utensils"]
  },
  {
    title: "Swiss Alpine St. Moritz Chalet",
    description: "Ski-in / ski-out handcrafted wooden chalet located right on the slopes of St. Moritz. Equipped with Finnish sauna, heated boot warmers, wine cellar, and stone fireplace.",
    images: [
      { url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80", filename: "swiss_chalet_1" },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", filename: "swiss_chalet_2" }
    ],
    price: 18500,
    cleaningFee: 1500,
    serviceFee: 950,
    location: "St. Moritz",
    country: "Switzerland",
    address: "Via Serlas, St. Moritz",
    category: "mountains",
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    geometry: { lat: 46.4908, lng: 9.8355 },
    amenities: ["Mountain View", "Hot Tub / Jacuzzi", "Dedicated Workspace", "Kitchen & Utensils", "Free Parking", "Fast Wi-Fi"]
  }
];

module.exports = { data: sampleListings };