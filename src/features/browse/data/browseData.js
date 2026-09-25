import {
  Apple,
  Baby,
  Building2,
  BriefcaseBusiness,
  CakeSlice,
  Croissant,
  CookingPot,
  Flame,
  GlassWater,
  Handshake,
  PackageOpen,
  Network,
  PartyPopper,
  Pizza,
  Presentation,
  Salad,
  Sandwich,
  Soup,
  SquareMenu,
  UtensilsCrossed,
} from "lucide-react";

export const browseTabs = [
  {
    id: "food-type",
    labelKey: "browse.tabs.foodType",
    href: "/browse/food-type",
  },
  {
    id: "occasion",
    labelKey: "browse.tabs.occasion",
    href: "/browse/occasion",
  },
];

export const foodTypeCategories = [
  { name: "Breakfast", icon: Croissant },
  { name: "Hot Meal", icon: Soup },
  { name: "Salad", icon: Salad },
  { name: "Packages", icon: BriefcaseBusiness },
  { name: "Asian", icon: UtensilsCrossed },
  { name: "BBQ", icon: Flame },
  { name: "Healthy", icon: Apple },
  { name: "Italian", icon: Pizza },
  { name: "More", icon: null },
];

export const occasionCategories = [
  { name: "Breakfast", icon: Croissant },
  { name: "Birthday", icon: CakeSlice },
  { name: "Baby", icon: Baby },
  { name: "Meeting", icon: Handshake },
  { name: "Conference", icon: Presentation },
  { name: "Networking", icon: Network },
  { name: "Party", icon: PartyPopper },
  { name: "Reception", icon: GlassWater },
  { name: "More", icon: null },
];

export const browseFilterChips = [
  { key: "sort", label: "Sort by" },
  { key: "rating", label: "Ratings", icon: "star" },
  { key: "dietary", label: "Dietary options" },
  { key: "offer", label: "Delivery" },
  { key: "pricing", label: "Price" },
];

export const moreFoodTypeOptions = [
  "African",
  "American",
  "Bagels",
  "Bakery",
  "Bowls",
  "Burgers",
  "Cajun",
  "Caribbean",
  "Chicken",
  "Chinese",
  "Coffee & Tea",
  "Cuban",
  "Deli",
  "Dinner",
  "Eastern European/Russian",
  "French",
  "German",
  "Greek",
  "Indian",
  "Korean",
  "Middle Eastern",
  "Plant-Based",
  "Poke",
  "Salads",
  "Seafood",
  "Smoothies & Juices",
  "Snacks",
  "Soups",
  "Southern",
  "South Italian American",
  "Spanish/Tapas",
  "Steakhouse",
  "Sushi",
  "Thai",
  "Vietnamese",
];

export const moreOccasionOptions = [
  "Baby Shower",
  "Board Meeting",
  "Brunch Event",
  "Client Meeting",
  "Conference",
  "Engagement",
  "Family Gathering",
  "Holiday Party",
  "Launch Event",
  "Lunch Buffet",
  "Networking",
  "Office Celebration",
  "Picnic",
  "Reception",
  "Retirement",
  "Team Dinner",
  "Workshop",
];

export const sortByOptions = [
  "Recommended",
  "Highest Rated",
  "Most Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];

export const ratingOptions = [
  "4.5+",
  "4.0+",
  "3.0+",
  "2.0+",
  "1.0+",
];

export const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Gluten-Free"];

export const offerOptions = [
  "Alle leveringer",
  "Gratis levering",
  "Leveringsgebyr: 0–150 kr",
  "Leveringsgebyr: 150–300 kr",
  "Leveringsgebyr: 300+ kr",
];

export const pricingOptions = [
  "Any price",
  "Under 500",
  "500 - 1000",
  "1000 - 2000",
  "2000 - 5000",
  "5000+",
];

export const orderMinimumOptions = [
  "Any price",
  "Under 500",
  "500 - 1000",
  "1000 - 2000",
  "2000 - 5000",
  "5000+",
];

export const distanceOptions = [
  "Any distance",
  "Within 2 km",
  "Within 5 km",
  "Within 10 km",
];

const FALLBACK_ICON_MAP = {
  breakfast: Croissant,
  "hot-meal": Soup,
  soup: Soup,
  salad: Salad,
  salads: Salad,
  buffet: SquareMenu,
  lunch: Sandwich,
  dinner: CookingPot,
  "boxed-meals": PackageOpen,
  "boxed-meal": PackageOpen,
  "desi-food": UtensilsCrossed,
  desi: UtensilsCrossed,
  "fast-food": Pizza,
  "fastfood": Pizza,
  packages: BriefcaseBusiness,
  asian: UtensilsCrossed,
  bbq: Flame,
  healthy: Apple,
  italian: Pizza,
  birthday: CakeSlice,
  baby: Baby,
  meeting: Handshake,
  conference: Presentation,
  networking: Network,
  party: PartyPopper,
  reception: GlassWater,
  "corporate-meetings": BriefcaseBusiness,
  "corporate-meeting": BriefcaseBusiness,
  "business-conferences": Presentation,
  "business-conference": Presentation,
  "office-lunch": Sandwich,
  "company-party": PartyPopper,
  "school-party": Building2,
};

function normalizeBrowseIconKey(value) {
  return `${value ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getBrowseFallbackIcon(value) {
  return FALLBACK_ICON_MAP[normalizeBrowseIconKey(value)] ?? null;
}
