import {
  foodTypeMenuItems,
  occasionMenuItems,
} from "../../browse/data/browseData";

const popularVendors = [
  {
    id: 1,
    slug: "the-queens-kebab",
    name: "The Queen's Kebab",
    image: "/home/v.webp",
    rating: 4.9,
    deliveryTime: "10-35 minutes",
    deliveryFee: "35 NOK Delivery fee",
    discount: "20% Discount",
    categoryTags: ["Hot Meal", "BBQ"],
  },
  {
    id: 2,
    slug: "flints-grill",
    name: "Flint's Grill",
    image: "/home/hero1.webp",
    rating: 3.9,
    deliveryTime: "10-30 minutes",
    deliveryFee: "30 NOK Delivery fee",
    discount: "20% Discount",
    categoryTags: ["Hot Meal", "BBQ"],
  },
  {
    id: 3,
    slug: "brobekk-grill-pizza",
    name: "Brobekk Grill & Pizza",
    image: "/home/hero2.webp",
    rating: 4.0,
    deliveryTime: "10-40 minutes",
    deliveryFee: "0 NOK Delivery fee",
    discount: "15% Discount",
    categoryTags: ["Hot Meal", "Italian", "Packages", "BBQ"],
  },
  {
    id: 4,
    slug: "mcdonalds-main-street",
    name: "McDonald's Main Street",
    image: "/home/hero3.webp",
    rating: 3.9,
    deliveryTime: "10-45 minutes",
    deliveryFee: "40 NOK Delivery fee",
    discount: "Up to 20% Discount",
    categoryTags: ["Hot Meal", "Packages"],
  },
  {
    id: 5,
    slug: "talormade-bispevika",
    name: "Talormade Bispevika",
    image: "/home/v.webp",
    rating: 4.0,
    deliveryTime: "10-25 minutes",
    deliveryFee: "20 NOK Delivery fee",
    discount: "40% Discount",
    categoryTags: ["Packages", "Healthy"],
  },
  {
    id: 6,
    slug: "eckers-frogner",
    name: "Eckers Frogner",
    image: "/home/hero1.webp",
    rating: 3.5,
    deliveryTime: "10-30 minutes",
    deliveryFee: "45 NOK Delivery fee",
    discount: "10% Discount",
    categoryTags: ["Breakfast", "Healthy"],
  },
];

const featuredVendors = [
  {
    id: 7,
    slug: "nordic-lunch-house",
    name: "Nordic Lunch House",
    image: "/home/hero2.webp",
    rating: 4.8,
    deliveryTime: "15-30 minutes",
    deliveryFee: "29 NOK Delivery fee",
    discount: "15% Discount",
    categoryTags: ["Packages", "Healthy", "Breakfast"],
  },
  {
    id: 8,
    slug: "urban-salad-kitchen",
    name: "Urban Salad Kitchen",
    image: "/home/v.webp",
    rating: 4.7,
    deliveryTime: "15-25 minutes",
    deliveryFee: "32 NOK Delivery fee",
    discount: "25% Discount",
    categoryTags: ["Salad", "Healthy", "Asian"],
  },
  {
    id: 9,
    slug: "pizza-corner",
    name: "Pizza Corner",
    image: "/home/hero3.webp",
    rating: 4.6,
    deliveryTime: "20-35 minutes",
    deliveryFee: "38 NOK Delivery fee",
    discount: "10% Discount",
    categoryTags: ["Italian", "Hot Meal", "Packages"],
  },
  {
    id: 10,
    slug: "morning-bite-cafe",
    name: "Morning Bite Cafe",
    image: "/home/hero1.webp",
    rating: 4.5,
    deliveryTime: "15-20 minutes",
    deliveryFee: "25 NOK Delivery fee",
    discount: "Free Dessert",
    categoryTags: ["Breakfast", "Healthy"],
  },
  {
    id: 11,
    slug: "oslo-wrap-house",
    name: "Oslo Wrap House",
    image: "/home/hero2.webp",
    rating: 4.4,
    deliveryTime: "20-30 minutes",
    deliveryFee: "35 NOK Delivery fee",
    discount: "30% Discount",
    categoryTags: ["Asian", "Healthy", "Hot Meal"],
  },
  {
    id: 12,
    slug: "golden-fork-kitchen",
    name: "Golden Fork Kitchen",
    image: "/home/v.webp",
    rating: 4.3,
    deliveryTime: "20-40 minutes",
    deliveryFee: "39 NOK Delivery fee",
    discount: "Buy 1 Get 1",
    categoryTags: ["Hot Meal", "Packages", "Healthy"],
  },
];

const popularProducts = [
  {
    id: 1,
    slug: "morning-bite-croissant-box",
    vendorSlug: "morning-bite-cafe",
    name: "Morning Croissant Box",
    vendorName: "Morning Bite Cafe",
    image: "/home/hero1.webp",
    rating: 4.8,
    deliveryTime: "15-20 minutes",
    deliveryFee: "25 NOK Delivery fee",
    discount: "Freshly baked",
    categoryTags: ["Breakfast", "Healthy"],
  },
  {
    id: 2,
    slug: "executive-breakfast-tray",
    vendorSlug: "nordic-lunch-house",
    name: "Executive Breakfast Tray",
    vendorName: "Nordic Lunch House",
    image: "/home/hero3.webp",
    rating: 4.7,
    deliveryTime: "15-30 minutes",
    deliveryFee: "29 NOK Delivery fee",
    discount: "Office favorite",
    categoryTags: ["Breakfast", "Packages"],
  },
  {
    id: 3,
    slug: "smokehouse-rib-platter",
    vendorSlug: "flints-grill",
    name: "Smokehouse Rib Platter",
    vendorName: "Flint's Grill",
    image: "/home/hero2.webp",
    rating: 4.9,
    deliveryTime: "10-30 minutes",
    deliveryFee: "30 NOK Delivery fee",
    discount: "Top rated",
    categoryTags: ["BBQ", "Hot Meal"],
  },
  {
    id: 4,
    slug: "pizza-lunch-duo",
    vendorSlug: "pizza-corner",
    name: "Pizza Lunch Duo",
    vendorName: "Pizza Corner",
    image: "/home/hero1.webp",
    rating: 4.6,
    deliveryTime: "20-35 minutes",
    deliveryFee: "38 NOK Delivery fee",
    discount: "Shareable",
    categoryTags: ["Italian", "Hot Meal"],
  },
  {
    id: 5,
    slug: "garden-salad-crate",
    vendorSlug: "urban-salad-kitchen",
    name: "Garden Salad Crate",
    vendorName: "Urban Salad Kitchen",
    image: "/home/hero2.webp",
    rating: 4.7,
    deliveryTime: "15-25 minutes",
    deliveryFee: "32 NOK Delivery fee",
    discount: "Light and fresh",
    categoryTags: ["Salad", "Healthy"],
  },
  {
    id: 6,
    slug: "asian-noodle-office-box",
    vendorSlug: "oslo-wrap-house",
    name: "Asian Noodle Office Box",
    vendorName: "Oslo Wrap House",
    image: "/home/hero3.webp",
    rating: 4.5,
    deliveryTime: "20-30 minutes",
    deliveryFee: "35 NOK Delivery fee",
    discount: "Staff pick",
    categoryTags: ["Asian", "Healthy"],
  },
  {
    id: 7,
    slug: "meeting-lunch-bundle",
    vendorSlug: "talormade-bispevika",
    name: "Meeting Lunch Bundle",
    vendorName: "Talormade Bispevika",
    image: "/home/v.webp",
    rating: 4.6,
    deliveryTime: "10-25 minutes",
    deliveryFee: "20 NOK Delivery fee",
    discount: "Best for teams",
    categoryTags: ["Packages", "Healthy"],
  },
  {
    id: 8,
    slug: "healthy-protein-breakfast-box",
    vendorSlug: "eckers-frogner",
    name: "Healthy Protein Breakfast Box",
    vendorName: "Eckers Frogner",
    image: "/home/hero1.webp",
    rating: 4.4,
    deliveryTime: "10-30 minutes",
    deliveryFee: "45 NOK Delivery fee",
    discount: "High protein",
    categoryTags: ["Breakfast", "Healthy"],
  },
];

const DEFAULT_SECTIONS = [
  "All - in - One Order",
  "Appetizers",
  "Catering Packages",
  "Boxed Lunches",
];

const DETAIL_LINE_LIBRARY = {
  "All - in - One Order": [
    "Slow-roasted mains, seasonal sides, artisan bread, and house-made sauces.",
    "Balanced buffet setup with hot protein, fresh salad, and dessert-ready extras.",
    "Chef-curated office spread with premium proteins and sharing platters.",
  ],
  Appetizers: [
    "Handheld bites with dipping sauces, garnish trays, and easy sharing portions.",
    "Warm starters prepared for meetings, receptions, and casual team events.",
    "Freshly plated snacks with crisp vegetables, herbs, and signature dressings.",
  ],
  "Catering Packages": [
    "Complete package with mains, sides, serving setup, and disposable cutlery.",
    "Meeting-ready tray selection with flexible portions and easy table service.",
    "Premium bundle designed for longer events and larger guest groups.",
  ],
  "Boxed Lunches": [
    "Individually packed lunches with labeled boxes, sides, dessert, and napkins.",
    "Easy grab-and-go meal set for workshops, trainings, and office deliveries.",
    "Compact lunch option with a fresh entree, small side, and sweet finish.",
  ],
};

const DIETARY_LABEL_LIBRARY = [
  ["Halal", "High Protein"],
  ["Vegetarian Friendly", "Nut Free"],
  ["Gluten-Free Option", "Dairy Aware"],
  ["Individually Packed", "Office Favorite"],
];

const ALLERGEN_LIBRARY = [
  ["Milk", "Egg"],
  ["Wheat", "Soy"],
  ["Sesame", "Mustard"],
  ["Shellfish", "Celery"],
];

const REVIEW_AUTHOR_NAMES = [
  "Emma Johnson",
  "Noah Larsen",
  "Sofia Ahmed",
  "Lucas Berg",
  "Mia Andersen",
  "Ethan Ali",
];

const REVIEW_HEADLINES = [
  "Reliable catering for team lunches",
  "Fresh food and smooth delivery",
  "Great setup for office events",
  "Well packed and easy to serve",
  "Strong flavors and generous portions",
  "Perfect for last-minute planning",
];

const REVIEW_COMMENTS = [
  "Everything arrived on time, clearly labeled, and the portions were generous enough for the whole team.",
  "The menu felt fresh and balanced, and the packaging made setup very easy for our meeting room.",
  "Guests loved the variety. The hot dishes stayed warm and the salads were still crisp on arrival.",
  "Communication was smooth from start to finish and the food presentation looked polished for our event.",
  "This vendor has become one of our safest choices for office catering because the quality stays consistent.",
  "We ordered for a mixed group with dietary needs and everyone found something they could enjoy.",
];

const SECTION_SUBCATEGORIES = {
  "All - in - One Order": [
    "Full Meal",
    "Office Combo",
    "Team Lunch",
    "Chef Selection",
  ],
  Appetizers: [
    "Finger Food",
    "Warm Starters",
    "Fresh Sides",
    "Sharing Plates",
  ],
  "Catering Packages": [
    "Individual Packing",
    "Meeting Trays",
    "Party Sets",
    "Premium Package",
  ],
  "Boxed Lunches": [
    "Classic Box",
    "Healthy Box",
    "Wrap Box",
    "Premium Box",
  ],
};

const WEEKDAY_SHORT_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function normalizePostalCode(postalCode = "") {
  return `${postalCode}`.replace(/\D/g, "").slice(0, 4);
}

function normalizeLocationQuery(locationQuery = "") {
  return `${locationQuery}`.trim().toLowerCase();
}

function formatTimeLabel(time) {
  const [rawHours = "0", rawMinutes = "00"] = `${time}`.split(":");
  const hours = Number(rawHours);
  const suffix = hours >= 12 ? "pm" : "am";
  const normalizedHours = hours % 12 || 12;
  const minutes = rawMinutes === "00" ? "" : `:${rawMinutes}`;

  return `${normalizedHours}${minutes}${suffix}`;
}

function formatDayRangeLabel(days = []) {
  if (days.length === 0) {
    return "Unavailable";
  }

  if (days.length === 7) {
    return "Daily";
  }

  const sortedDays = [...days].sort((left, right) => left - right);
  const firstDay = sortedDays[0];
  const lastDay = sortedDays[sortedDays.length - 1];
  const isContinuousRange =
    sortedDays.length > 1 &&
    sortedDays.every((day, index) => day === firstDay + index);

  if (isContinuousRange) {
    return `${WEEKDAY_SHORT_LABELS[firstDay]}-${WEEKDAY_SHORT_LABELS[lastDay]}`;
  }

  return sortedDays.map((day) => WEEKDAY_SHORT_LABELS[day]).join(", ");
}

function createAvailability({
  deliveryDays = [1, 2, 3, 4, 5],
  deliveryStart = "09:00",
  deliveryEnd = "18:00",
  takeoutDays = [1, 2, 3, 4, 5],
  takeoutStart = "09:00",
  takeoutEnd = "20:00",
} = {}) {
  return {
    delivery: {
      days: deliveryDays,
      start: deliveryStart,
      end: deliveryEnd,
      label: `${formatDayRangeLabel(deliveryDays)}: ${formatTimeLabel(
        deliveryStart,
      )}-${formatTimeLabel(deliveryEnd)}`,
    },
    takeout: {
      days: takeoutDays,
      start: takeoutStart,
      end: takeoutEnd,
      label: `${formatDayRangeLabel(takeoutDays)}: ${formatTimeLabel(
        takeoutStart,
      )}-${formatTimeLabel(takeoutEnd)}`,
    },
  };
}

const vendorDirectory = [
  {
    slug: "flints-grill",
    name: "Flint's Grill",
    logo: "/home/vendorLogo.png",
    banner: "/home/hero1.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 4.8,
    reviewCount: 450,
    cuisine: "Grill",
    addressLine: "45 Storgata, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5003", "5004", "5005", "5010", "5011"],
    deliveryFee: "NOK 30 Delivery fee",
    leadTime: "30-45 min",
    availability: createAvailability(),
  },
  {
    slug: "the-queens-kebab",
    name: "The Queen's Kebab",
    logo: "/home/vendorLogo.png",
    banner: "/home/v.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.9,
    reviewCount: 410,
    cuisine: "Kebab & Grill",
    addressLine: "8 Strandgaten, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5004", "5006", "5007", "5014"],
    deliveryFee: "NOK 35 Delivery fee",
    leadTime: "25-40 min",
    availability: createAvailability({
      deliveryStart: "10:00",
      deliveryEnd: "19:00",
      takeoutEnd: "21:00",
    }),
  },
  {
    slug: "brobekk-grill-pizza",
    name: "Brobekk Grill & Pizza",
    logo: "/home/logo.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 4.0,
    reviewCount: 198,
    cuisine: "Pizza & Grill",
    addressLine: "11 Sentrum, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5008", "5009", "5010", "5052"],
    deliveryFee: "NOK 0 Delivery fee",
    leadTime: "20-40 min",
    availability: createAvailability({
      deliveryDays: [1, 2, 3, 4, 5, 6],
      takeoutDays: [1, 2, 3, 4, 5, 6],
      deliveryEnd: "20:00",
      takeoutEnd: "22:00",
    }),
  },
  {
    slug: "mcdonalds-main-street",
    name: "McDonald's Main Street",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 3.9,
    reviewCount: 260,
    cuisine: "Fast Food",
    addressLine: "22 Main Street, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5003", "5004", "5008", "5015", "5053"],
    deliveryFee: "NOK 40 Delivery fee",
    leadTime: "20-35 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "08:00",
      deliveryEnd: "23:00",
      takeoutStart: "08:00",
      takeoutEnd: "23:30",
    }),
  },
  {
    slug: "talormade-bispevika",
    name: "Talormade Bispevika",
    logo: "/home/logo2.png",
    banner: "/home/v.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.0,
    reviewCount: 305,
    cuisine: "Bakery & Lunch",
    addressLine: "12 Bryggen, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5006", "5007", "5013", "5015"],
    deliveryFee: "NOK 20 Delivery fee",
    leadTime: "20-30 min",
    availability: createAvailability({
      deliveryStart: "08:30",
      deliveryEnd: "17:30",
      takeoutStart: "08:00",
      takeoutEnd: "18:30",
    }),
  },
  {
    slug: "eckers-frogner",
    name: "Eckers Frogner",
    logo: "/home/logo.png",
    banner: "/home/hero1.webp",
    heroSideImage: "/home/v.webp",
    rating: 3.5,
    reviewCount: 156,
    cuisine: "Cafe",
    addressLine: "7 Frognerveien, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5009", "5011", "5012", "5052"],
    deliveryFee: "NOK 45 Delivery fee",
    leadTime: "25-40 min",
    availability: createAvailability({
      deliveryStart: "09:30",
      deliveryEnd: "17:00",
      takeoutEnd: "19:00",
    }),
  },
  {
    slug: "nordic-lunch-house",
    name: "Nordic Lunch House",
    logo: "/home/logo2.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.8,
    reviewCount: 335,
    cuisine: "Nordic Lunch",
    addressLine: "31 Harbour Street, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5003", "5005", "5010", "5017", "5054"],
    deliveryFee: "NOK 29 Delivery fee",
    leadTime: "20-30 min",
    availability: createAvailability({
      deliveryStart: "07:30",
      deliveryEnd: "16:30",
      takeoutStart: "07:00",
      takeoutEnd: "18:00",
    }),
  },
  {
    slug: "urban-salad-kitchen",
    name: "Urban Salad Kitchen",
    logo: "/home/logo.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/v.webp",
    rating: 4.7,
    reviewCount: 287,
    cuisine: "Healthy Bowls",
    addressLine: "17 Marken, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5007", "5008", "5012", "5014", "5055"],
    deliveryFee: "NOK 32 Delivery fee",
    leadTime: "15-25 min",
    availability: createAvailability({
      deliveryDays: [1, 2, 3, 4, 5, 6],
      takeoutDays: [1, 2, 3, 4, 5, 6],
      deliveryStart: "08:00",
      deliveryEnd: "18:30",
      takeoutEnd: "20:00",
    }),
  },
  {
    slug: "pizza-corner",
    name: "Pizza Corner",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.6,
    reviewCount: 344,
    cuisine: "Pizza",
    addressLine: "4 Torget, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5004", "5009", "5011", "5018", "5056"],
    deliveryFee: "NOK 38 Delivery fee",
    leadTime: "20-35 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "11:00",
      deliveryEnd: "22:00",
      takeoutStart: "11:00",
      takeoutEnd: "23:00",
    }),
  },
  {
    slug: "morning-bite-cafe",
    name: "Morning Bite Cafe",
    logo: "/home/logo2.png",
    banner: "/home/v.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.5,
    reviewCount: 208,
    cuisine: "Breakfast & Cafe",
    addressLine: "29 Nygardsgaten, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5007", "5008", "5015", "5057"],
    deliveryFee: "NOK 25 Delivery fee",
    leadTime: "15-20 min",
    availability: createAvailability({
      deliveryStart: "07:00",
      deliveryEnd: "15:00",
      takeoutStart: "06:30",
      takeoutEnd: "16:00",
    }),
  },
  {
    slug: "oslo-wrap-house",
    name: "Oslo Wrap House",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.4,
    reviewCount: 243,
    cuisine: "Wraps",
    addressLine: "13 Strandkaien, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5006", "5009", "5013", "5016", "5058"],
    deliveryFee: "NOK 35 Delivery fee",
    leadTime: "20-30 min",
    availability: createAvailability({
      deliveryStart: "10:30",
      deliveryEnd: "19:30",
      takeoutEnd: "20:30",
    }),
  },
  {
    slug: "golden-fork-kitchen",
    name: "Golden Fork Kitchen",
    logo: "/home/logo2.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 4.3,
    reviewCount: 276,
    cuisine: "Catering",
    addressLine: "21 City Center, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5005", "5010", "5014", "5053", "5059"],
    deliveryFee: "NOK 39 Delivery fee",
    leadTime: "20-40 min",
    availability: createAvailability({
      deliveryDays: [1, 2, 3, 4, 5, 6],
      takeoutDays: [1, 2, 3, 4, 5, 6],
      deliveryStart: "09:00",
      deliveryEnd: "19:00",
      takeoutEnd: "21:00",
    }),
  },
  {
    slug: "max-egertorget",
    name: "Max - Egertorget",
    logo: "/home/logo.png",
    banner: "/home/hero1.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 3.9,
    reviewCount: 302,
    cuisine: "Burgers",
    addressLine: "Egertorget 5, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5003", "5004", "5005", "5063"],
    deliveryFee: "NOK 20 Delivery fee",
    leadTime: "15-30 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "10:00",
      deliveryEnd: "22:00",
      takeoutStart: "10:00",
      takeoutEnd: "23:00",
    }),
  },
  {
    slug: "fly-chicken-steen",
    name: "Fly Chicken - Steen",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.9,
    reviewCount: 187,
    cuisine: "Chicken",
    addressLine: "Steen Avenue 3, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5008", "5009", "5012", "5067"],
    deliveryFee: "NOK 20 Delivery fee",
    leadTime: "10-20 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "11:00",
      deliveryEnd: "22:30",
      takeoutStart: "11:00",
      takeoutEnd: "23:30",
    }),
  },
  {
    slug: "dominos-pizza-storo",
    name: "Domino's Pizza Storo",
    logo: "/home/logo2.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.5,
    reviewCount: 268,
    cuisine: "Pizza",
    addressLine: "Storo 18, Bergen",
    city: "Bergen",
    servicePostalCodes: ["5007", "5011", "5018", "5070"],
    deliveryFee: "NOK 45 Delivery fee",
    leadTime: "20-35 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "11:00",
      deliveryEnd: "22:00",
      takeoutStart: "11:00",
      takeoutEnd: "23:00",
    }),
  },
];

const sectionDescriptions = {
  "All - in - One Order":
    "A full spread with hot mains, fresh sides, and ready-to-serve setup.",
  Appetizers: "Quick bites and warm starters that work well for sharing.",
  "Catering Packages":
    "Ready-made bundles for meetings, events, and office lunches.",
  "Boxed Lunches": "Easy individual meals packaged for smooth team delivery.",
};

function formatVendorName(vendorName = "") {
  return vendorName.replace(/^By\s+/, "").trim();
}

function parsePrice(price) {
  const matched = `${price}`.match(/(\d+)/);
  return matched ? Number(matched[1]) : 120;
}

function createRequiredOptions(title, index) {
  return [
    "Grilled Chicken",
    "Carnitas",
    "Grilled Veggies",
    "Al Pastor",
    "Chili Verde",
    "Rice & Beans",
    `${title} Special`,
    `Chef Pick ${index + 1}`,
  ];
}

function createOptionalGroup(title, offset) {
  return {
    title,
    subtitle: "Optional",
    options: [
      { label: "Guacamole", price: 1.8 + offset },
      { label: "Sour Cream", price: 0.5 + offset },
      { label: "Extra Protein", price: 3.25 + offset },
      { label: "Extra Cheese", price: 1.65 + offset },
    ],
  };
}

function createReviewDate(index) {
  const reviewDate = new Date(2026, 3, 24 - index * 3);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(reviewDate);
}

function createVendorReviews(vendor) {
  return Array.from({ length: 6 }, (_, index) => ({
    id: `${vendor.slug}-review-${index + 1}`,
    author: REVIEW_AUTHOR_NAMES[index % REVIEW_AUTHOR_NAMES.length],
    rating: Number(Math.max(4, vendor.rating - index * 0.1).toFixed(1)),
    title: REVIEW_HEADLINES[index % REVIEW_HEADLINES.length],
    comment: REVIEW_COMMENTS[index % REVIEW_COMMENTS.length],
    occasion: DEFAULT_SECTIONS[index % DEFAULT_SECTIONS.length],
    date: createReviewDate(index),
  }));
}

function createItemFromSeed(seed, sectionTitle, index) {
  const sectionOffset = DEFAULT_SECTIONS.indexOf(sectionTitle) * 12;
  const price = parsePrice(seed.price) + sectionOffset;
  const serves = 5 + ((index + sectionOffset) % 4) * 5;
  const subcategory =
    SECTION_SUBCATEGORIES[sectionTitle]?.[index] ?? sectionTitle;
  const detailLines = [
    DETAIL_LINE_LIBRARY[sectionTitle]?.[
      index % DETAIL_LINE_LIBRARY[sectionTitle].length
    ] ?? "Freshly prepared for office meals and catering events.",
    `Allergens: ${ALLERGEN_LIBRARY[index % ALLERGEN_LIBRARY.length].join(", ")}`,
  ];
  const dietaryLabels = DIETARY_LABEL_LIBRARY[index % DIETARY_LABEL_LIBRARY.length];
  const allergens = ALLERGEN_LIBRARY[index % ALLERGEN_LIBRARY.length];

  return {
    id: `${seed.slug}-${sectionTitle}-${index}`,
    title: index === 0 ? seed.title : `${subcategory}`,
    image: seed.image,
    serves,
    subcategory,
    tag:
      index === 0 && sectionTitle === "Catering Packages" ? "Most ordered" : "",
    description:
      sectionDescriptions[sectionTitle] ??
      "Freshly prepared menu designed for office lunches and catered events.",
    detailLines,
    dietaryLabels,
    allergens,
    price,
    modal: {
      heading: seed.title,
      pricePerPerson: (price / Math.max(serves, 1)).toFixed(2),
      badge: subcategory,
      quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
      requiredSelection: {
        title: "Select protein or vegetables:",
        subtitle: "Required · 1 option",
        options: createRequiredOptions(seed.title, index),
      },
      optionalSelections: [
        createOptionalGroup("Add:", index * 0.15),
        {
          title: "Add extra side:",
          subtitle: "Optional",
          options: [
            { label: "Side Salad", price: 1.2 + index * 0.1 },
            { label: "Chips", price: 0.9 + index * 0.1 },
            { label: "Fresh Fruit", price: 1.4 + index * 0.1 },
          ],
        },
      ],
      instructionPlaceholder:
        "Let the restaurant know of any allergies or preparation instructions.",
    },
  };
}

function createFallbackSeed(vendor) {
  return [
    {
      slug: `${vendor.slug}-signature-platter`,
      title: `${vendor.name} Signature Platter`,
      image: vendor.banner,
      price: "NOK 189",
    },
    {
      slug: `${vendor.slug}-chef-special`,
      title: `${vendor.cuisine} Chef Special`,
      image: vendor.heroSideImage,
      price: "NOK 149",
    },
  ];
}

const menuSeedByVendor = [
  ...foodTypeMenuItems,
  ...occasionMenuItems,
  ...popularProducts,
].reduce((accumulator, item) => {
  const key = item.vendorSlug;
  if (!key) {
    return accumulator;
  }

  accumulator[key] = [...(accumulator[key] ?? []), item];
  return accumulator;
}, {});

export const vendorPreviewCards = [
  ...popularVendors,
  ...featuredVendors,
  {
    id: 8,
    slug: "fresh-bites-kitchen",
    name: "Fresh Bites Kitchen",
    image: "/home/hero1.webp",
    rating: 0.0,
    deliveryTime: "15-45 min",
    deliveryFee: "NOK 0 Delivery fee",
    discount: null,
    categoryTags: ["Catering Packages"],
  }
];


function buildMenuSections(vendor) {
  const seeds = menuSeedByVendor[vendor.slug] ?? createFallbackSeed(vendor);

  return DEFAULT_SECTIONS.map((sectionTitle, sectionIndex) => ({
    id: `${vendor.slug}-${sectionIndex}`,
    title: sectionTitle,
    items: Array.from({ length: 4 }, (_, itemIndex) =>
      createItemFromSeed(
        {
          ...seeds[itemIndex % seeds.length],
          title:
            sectionIndex === 0 || itemIndex === 0
              ? seeds[itemIndex % seeds.length].title
              : `${vendor.name} ${sectionIndex + 1}`,
        },
        sectionTitle,
        itemIndex,
      ),
    ),
  }));
}

function createOrderSummary(menuSections) {
  const selectedItems = menuSections
    .flatMap((section) => section.items)
    .slice(0, 2)
    .map((item, index) => ({
      id: item.id,
      quantity: index === 0 ? 15 : 1,
      name: item.title,
      price: index === 0 ? item.price + 15 : item.price,
      details: [`Serves ${item.serves}`, "Tax Included"],
    }));

  const itemsTotal = selectedItems.reduce(
    (total, item) => total + item.price,
    0,
  );
  const deliveryFee = 32.83;
  const tip = 0;

  return {
    items: selectedItems,
    breakdown: [
      { label: "Food & beverage", value: itemsTotal.toFixed(2) },
      { label: "Restaurant delivery fee", value: itemsTotal.toFixed(2) },
      { label: "30% Sales tax", value: deliveryFee.toFixed(2) },
      { label: "Tip", value: tip.toFixed(2) },
    ],
    deliveryDate: "25. Mar, 2026 | 02:30 PM",
    personCount: 20,
    deliveryAddress: "House # 22 Bergen",
    invoiceAddress: "House # 22 Bergen",
    total: (itemsTotal + itemsTotal + deliveryFee + tip).toFixed(2),
  };
}

export const freshBitesKitchenPayload = {
  id: "8",
  name: "Fresh Bites Kitchen",
  logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdrEAgRBptuEGkDenW-UkBRrWFgwCnTgn89q0rHIELshGNDS9Gpn7mibBn&s=10",
  coverPhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4uwcPXm4Q1OvgdJizrYTSw2_XWBI4AUvQp4CZmpdpEmtNsOTu_kD-VBqQ&s=10",
  rating: "0.0",
  reviewsCount: 0,
  categoryTags: [
    "All-in-one",
    "Catering Packages"
  ],
  deliverySettings: {
    id: "7",
    baseDeliveryFee: "0",
    minDeliveryTime: 15,
    maxDeliveryTime: 45
  },
  businessSettings: {
    id: "7",
    businessAddress: "Grünerløkka Plaza, Oslo, Norway"
  },
  menuCategories: [
    {
      id: "9",
      name: "Catering Packages",
      description: "Main catering packages for weddings, corporate, and private parties",
      vendorProducts: [
        {
          id: "49",
          name: "Royal Wedding Grand Buffet",
          description: "General details about this catering package, including the culinary experience, key highlights, and service style.",
          priceWithTax: "120.00",
          averageRating: "0.0",
          ordersCount: 0,
          badge: null,
          isPopular: false,
          isFeatured: false,
          slug: "royal-wedding-grand-buffet",
          categoryTags: [
            "Catering Packages",
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          contains: null,
          dietaryTags: [
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          allergens: [
            "Gluten",
            "Eggs",
            "Vegess"
          ],
          minLeadTimeDays: 24,
          minLeadTimeHours: 24,
          minimumGuests: 20,
          pricingType: "per-person",
          isAvailabilityWindowEnabled: true,
          availableFrom: "2026-06-25",
          availableUntil: "2026-07-25",
          coverImage: {
            id: "109",
            fileUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80"
          },
          menuItems: [
            {
              id: "1",
              title: "Grilled Chicken",
              description: null,
              imageUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80",
              allergens: [
                "Eggs"
              ]
            },
            {
              id: "2",
              title: "Penne Pasta",
              description: null,
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR4OcTwtNZJtp6y8QY5TwulzzahHuYTH9iwQ&s",
              allergens: [
                "Gluten"
              ]
            },
            {
              id: "3",
              title: "Garden Fresh Salad",
              description: null,
              imageUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80",
              allergens: [
                "Vegess"
              ]
            }
          ],
          optionalAddOns: []
        }
      ]
    },
    {
      id: "10",
      name: "All-in-one",
      description: "All pakages for weddings, corporate, and private parties",
      vendorProducts: [
        {
          id: "50",
          name: "Grand Corporate Gala Buffet",
          description: "Ek shandaar corporate event ke liye premium buffet, jismein shamil hain gourmet main courses, artisanal sides, aur professional presentation.",
          priceWithTax: "150.00",
          averageRating: "0.0",
          ordersCount: 0,
          badge: null,
          isPopular: false,
          isFeatured: false,
          slug: "grand-corporate-gala-buffet",
          categoryTags: [
            "All-in-one",
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          contains: null,
          dietaryTags: [
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          allergens: [
            "None"
          ],
          minLeadTimeDays: 48,
          minLeadTimeHours: 24,
          minimumGuests: 35,
          pricingType: "per-person",
          isAvailabilityWindowEnabled: true,
          availableFrom: "2026-07-01",
          availableUntil: "2026-09-01",
          coverImage: {
            id: "112",
            fileUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80"
          },
          menuItems: [],
          optionalAddOns: []
        }
      ]
    }
  ]
};

export function adaptApiProductToMenuItem(prod, subcategory = "Menu Item") {
  if (!prod) return null;
  const price = parseFloat(prod.priceWithTax || 0);
  const serves = prod.minimumGuests || 1;

  const detailLines = [
    prod.description || "",
    prod.allergens?.length ? `Allergens: ${prod.allergens.join(", ")}` : "",
  ].filter(Boolean);

  const optionalSelections = (prod.optionalAddOns || []).map((group) => ({
    title: group.name || group.title || "Add-ons",
    options: (group.options || group.items || []).map((opt) => ({
      label: opt.name || opt.label,
      price: parseFloat(opt.price || 0),
    })),
  }));

  return {
    id: prod.id,
    title: prod.name,
    image: prod.coverImage?.fileUrl || "",
    serves,
    subcategory,
    tag: prod.isPopular ? "Popular" : prod.isFeatured ? "Featured" : "",
    description: prod.description || "",
    detailLines,
    dietaryLabels: prod.dietaryTags || [],
    allergens: prod.allergens || [],
    price,
    menuItems: prod.menuItems || [],
    modal: {
      heading: prod.name,
      pricePerPerson: prod.pricingType === "per-person" ? (price / Math.max(serves, 1)).toFixed(2) : price.toFixed(2),
      badge: subcategory,
      quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
      requiredSelection: null,
      optionalSelections,
      instructionPlaceholder: "",
    },
  };
}

export function adaptApiVendorToProfile(apiVendor) {
  if (!apiVendor) return null;

  const slug = String(apiVendor.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const minTime = apiVendor.deliverySettings?.minDeliveryTime ?? 0;
  const maxTime = apiVendor.deliverySettings?.maxDeliveryTime ?? 0;
  const fee = apiVendor.deliverySettings?.baseDeliveryFee ?? "0";

  const banner = apiVendor.coverPhotoUrl || "";
  const logo = apiVendor.logoUrl || "";
  const rating = parseFloat(apiVendor.rating || 0);

  const address = apiVendor.businessSettings?.businessAddress || "";
  const servicePostalCodes = [];
  const cuisine = apiVendor.categoryTags?.[0] || "";

  const categories = (apiVendor.menuCategories || []).map((cat) => cat.name);

  const menuSections = (apiVendor.menuCategories || []).map((cat, catIdx) => {
    const items = (cat.vendorProducts || []).map((prod, prodIdx) => {
      const price = parseFloat(prod.priceWithTax || 0);
      const serves = prod.minimumGuests || 1;
      const subcategory = cat.name;

      const detailLines = [
        prod.description || "",
        prod.allergens?.length ? `Allergens: ${prod.allergens.join(", ")}` : "",
      ].filter(Boolean);

      const optionalSelections = (prod.optionalAddOns || []).map((group) => ({
        title: group.name || group.title || "Add-ons",
        options: (group.options || group.items || []).map((opt) => ({
          label: opt.name || opt.label,
          price: parseFloat(opt.price || 0),
        })),
      }));

      return {
        id: prod.id || `${slug}-${cat.id}-${prodIdx}`,
        title: prod.name,
        image: prod.coverImage?.fileUrl || "",
        serves,
        subcategory,
        tag: prod.isPopular ? "Popular" : prod.isFeatured ? "Featured" : "",
        description: prod.description || "",
        detailLines,
        dietaryLabels: prod.dietaryTags || [],
        allergens: prod.allergens || [],
        price,
        menuItems: prod.menuItems || [],
        modal: {
          heading: prod.name,
          pricePerPerson: prod.pricingType === "per-person" ? (price / Math.max(serves, 1)).toFixed(2) : price.toFixed(2),
          badge: subcategory,
          quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
          requiredSelection: null,
          optionalSelections,
          instructionPlaceholder: "",
        },
      };
    });

    return {
      id: cat.id || `${slug}-${catIdx}`,
      title: cat.name,
      items,
    };
  });

  const reviews = [];

  const orderSummary = {
    items: [],
    breakdown: [],
    deliveryDate: "",
    personCount: 1,
    deliveryAddress: "",
    invoiceAddress: "",
    total: "0.00",
  };

  return {
    slug,
    name: apiVendor.name,
    logo,
    banner,
    heroSideImage: banner,
    rating: rating.toFixed(1),
    reviewCount: apiVendor.reviewsCount || 0,
    cuisine,
    addressLine: address,
    city: "",
    servicePostalCodes,
    deliveryFee: `NOK ${parseFloat(fee).toFixed(0)} Delivery fee`,
    leadTime: minTime || maxTime ? `${minTime}-${maxTime} min` : "",
    availability: null,
    categories,
    menuSections,
    reviews,
    orderSummary,
  };
}


export const vendorProfiles = [
  ...vendorDirectory.map((vendor) => {
    const previewCard = vendorPreviewCards.find(
      (item) => item.slug === vendor.slug,
    );
    const menuSections = buildMenuSections(vendor);
    const reviews = createVendorReviews(vendor);

    return {
      ...vendor,
      logo: vendor.logo ?? previewCard?.image,
      categories: DEFAULT_SECTIONS,
      menuSections,
      reviews,
      orderSummary: createOrderSummary(menuSections),
    };
  }),
  adaptApiVendorToProfile(freshBitesKitchenPayload)
];

export function getVendorProfileBySlug(slug) {
  return vendorProfiles.find((vendor) => vendor.slug === slug) ?? null;
}


export function getVendorMenuItemById(vendorSlug, itemId) {
  const vendor = getVendorProfileBySlug(vendorSlug);

  if (!vendor) {
    return null;
  }

  return (
    vendor.menuSections
      .flatMap((section) => section.items)
      .find((item) => item.id === itemId) ?? null
  );
}

export function getVendorProfileByName(name) {
  const cleanedName = formatVendorName(name).toLowerCase();

  return (
    vendorProfiles.find(
      (vendor) => vendor.name.toLowerCase() === cleanedName,
    ) ?? null
  );
}

export function getVendorReviewsBySlug(slug) {
  return getVendorProfileBySlug(slug)?.reviews ?? [];
}

function resolveVendorReference(vendor) {
  if (!vendor) {
    return null;
  }

  if (vendor.slug) {
    return vendorProfiles.find((candidate) => candidate.slug === vendor.slug) ?? null;
  }

  return getVendorProfileByName(vendor.name);
}

function resolveVendorPostalCoverage(vendor) {
  if ((vendor?.servicePostalCodes ?? []).length > 0) {
    return vendor.servicePostalCodes;
  }

  const matchedVendor = resolveVendorReference(vendor);

  return matchedVendor?.servicePostalCodes ?? [];
}

export function isVendorAvailableForPostalCode(vendor, postalCode) {
  const normalizedInput = normalizePostalCode(postalCode);

  if (!normalizedInput) {
    return true;
  }

  return resolveVendorPostalCoverage(vendor).some((candidate) =>
    candidate.startsWith(normalizedInput),
  );
}

export function filterVendorsByPostalCode(vendors, postalCode) {
  return vendors.filter((vendor) =>
    isVendorAvailableForPostalCode(vendor, postalCode),
  );
}

export function isVendorAvailableForLocation(vendor, locationQuery) {
  const normalizedPostalCode = normalizePostalCode(locationQuery);
  const matchedVendor = resolveVendorReference(vendor);

  if (normalizedPostalCode) {
    return isVendorAvailableForPostalCode(vendor, normalizedPostalCode);
  }

  const normalizedQuery = normalizeLocationQuery(locationQuery);

  if (!normalizedQuery) {
    return true;
  }

  return [
    vendor?.city ?? matchedVendor?.city,
    vendor?.addressLine ?? matchedVendor?.addressLine,
    vendor?.name ?? matchedVendor?.name,
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function filterVendorsByLocation(vendors, locationQuery) {
  return vendors.filter((vendor) =>
    isVendorAvailableForLocation(vendor, locationQuery),
  );
}

export function filterItemsByVendorLocation(
  items,
  locationQuery,
  getVendorSlug = (item) => item?.vendorSlug,
) {
  return items.filter((item) => {
    const vendorSlug = getVendorSlug(item);
    const vendor = vendorSlug ? getVendorProfileBySlug(vendorSlug) : null;

    return vendor ? isVendorAvailableForLocation(vendor, locationQuery) : true;
  });
}

export function filterVendorsByDeliverySlot(vendors, date, time) {
  if (!date && !time) {
    return vendors;
  }

  return vendors.filter((vendor) =>
    isVendorDeliverySlotAvailable(vendor, date, time),
  );
}

function isDateValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

function normalizeSelectedDate(date) {
  if (!date || !isDateValid(date)) {
    return null;
  }

  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const normalizedDate = `${date}`.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    const [year, month, day] = normalizedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(normalizedDate);
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
}

export function isVendorDeliverySlotAvailable(vendor, date, time) {
  const matchedVendor = resolveVendorReference(vendor);
  const deliverySchedule =
    vendor?.availability?.delivery ?? matchedVendor?.availability?.delivery;

  if (!deliverySchedule) {
    return true;
  }

  const selectedDate = normalizeSelectedDate(date);
  const matchesDay = selectedDate
    ? deliverySchedule.days.includes(selectedDate.getDay())
    : true;
  const matchesTime = time
    ? time >= deliverySchedule.start && time <= deliverySchedule.end
    : true;

  return matchesDay && matchesTime;
}

export function getAvailableVendorsForSlot(date, time, excludedVendorSlug) {
  return vendorProfiles.filter(
    (vendor) =>
      vendor.slug !== excludedVendorSlug &&
      isVendorDeliverySlotAvailable(vendor, date, time),
  );
}
