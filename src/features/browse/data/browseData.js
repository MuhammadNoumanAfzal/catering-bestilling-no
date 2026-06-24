import {
  Apple,
  Baby,
  BriefcaseBusiness,
  CakeSlice,
  Croissant,
  Flame,
  GlassWater,
  Handshake,
  Network,
  PartyPopper,
  Pizza,
  Presentation,
  Salad,
  Soup,
  UtensilsCrossed,
} from "lucide-react";

export const browseTabs = [
  { id: "food-type", label: "Browse by Food Type", href: "/browse/food-type" },
  { id: "occasion", label: "Browse by Occasion", href: "/browse/occasion" },
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
  { key: "offer", label: "Offer" },
  { key: "pricing", label: "Pricing" },
  { key: "other", label: "Other Filters" },
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
  "Most Popular",
  "Highest Rated",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];

export const ratingOptions = [
  "5 or more",
  "4 or more",
  "3 or more",
  "2 or more",
];

export const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Gluten-Free"];

export const offerOptions = [
  "Free Delivery",
  "Accepts discount code",
  "Have a discount",
];

export const pricingOptions = [
  "Budget-friendly",
  "Standard",
  "Premium",
];

export const orderMinimumOptions = [
  "Any price",
  "Under NOK 250",
  "NOK 250 - NOK 500",
  "NOK 500+",
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
