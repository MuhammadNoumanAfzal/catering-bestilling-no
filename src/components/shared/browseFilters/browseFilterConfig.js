export const DROPDOWN_CHIP_KEYS = new Set([
  "sort",
  "rating",
  "dietary",
  "offer",
  "pricing",
  "other",
]);

export const FILTER_LABELS = {
  sort: "Sort by",
  rating: "Ratings",
  dietary: "Dietary options",
  offer: "Offer",
  pricing: "Pricing",
  other: "Other Filters",
};

export const FILTER_DEFAULTS = {
  sort: "Sort by",
  rating: "Ratings",
  pricing: "Pricing",
  orderMinimum: "Any price",
  distance: "Any distance",
};

export const SORT_OPTION_KEYS = {
  Recommended: "browse.filterOptions.sort.recommended",
  "Most Popular": "browse.filterOptions.sort.mostPopular",
  "Highest Rated": "browse.filterOptions.sort.highestRated",
  "Price: Low to High": "browse.filterOptions.sort.priceLowToHigh",
  "Price: High to Low": "browse.filterOptions.sort.priceHighToLow",
  Newest: "browse.filterOptions.sort.newest",
};

export const RATING_OPTION_KEYS = {
  "5 or more": "browse.filterOptions.rating.fiveOrMore",
  "4 or more": "browse.filterOptions.rating.fourOrMore",
  "3 or more": "browse.filterOptions.rating.threeOrMore",
  "2 or more": "browse.filterOptions.rating.twoOrMore",
};

export const DIETARY_OPTION_KEYS = {
  Vegetarian: "browse.filterOptions.dietary.vegetarian",
  Vegan: "browse.filterOptions.dietary.vegan",
  Halal: "browse.filterOptions.dietary.halal",
  "Gluten-Free": "browse.filterOptions.dietary.glutenFree",
};

export const OFFER_OPTION_KEYS = {
  "Free Delivery": "browse.filterOptions.offer.freeDelivery",
  "Accepts discount code": "browse.filterOptions.offer.acceptsDiscountCode",
  "Have a discount": "browse.filterOptions.offer.haveDiscount",
};

export const PRICING_OPTION_KEYS = {
  "Budget-friendly": "browse.filterOptions.pricing.budgetFriendly",
  Standard: "browse.filterOptions.pricing.standard",
  Premium: "browse.filterOptions.pricing.premium",
};

export const ORDER_MINIMUM_OPTION_KEYS = {
  "Any price": "browse.filterOptions.orderMinimum.anyPrice",
  "Under NOK 250": "browse.filterOptions.orderMinimum.under250",
  "NOK 250 - NOK 500": "browse.filterOptions.orderMinimum.range250To500",
  "NOK 500+": "browse.filterOptions.orderMinimum.over500",
};

export const DISTANCE_OPTION_KEYS = {
  "Any distance": "browse.filterOptions.distance.anyDistance",
  "Within 2 km": "browse.filterOptions.distance.within2km",
  "Within 5 km": "browse.filterOptions.distance.within5km",
  "Within 10 km": "browse.filterOptions.distance.within10km",
};

const BROWSE_LABEL_KEY_GROUPS = [
  SORT_OPTION_KEYS,
  RATING_OPTION_KEYS,
  DIETARY_OPTION_KEYS,
  OFFER_OPTION_KEYS,
  PRICING_OPTION_KEYS,
  ORDER_MINIMUM_OPTION_KEYS,
  DISTANCE_OPTION_KEYS,
];

export function translateBrowseChipLabel(t, key) {
  return t(`browse.filters.${key}`, {
    defaultValue: FILTER_LABELS[key] ?? key,
  });
}

export function translateBrowseOptionLabel(t, value) {
  for (const group of BROWSE_LABEL_KEY_GROUPS) {
    if (group[value]) {
      return t(group[value], { defaultValue: value });
    }
  }

  return value;
}

export const FILTER_BAR_VARIANTS = {
  default: {
    containerClassName:
      "relative mt-4 flex flex-col gap-2.5 lg:mt-5 lg:flex-row lg:items-center lg:gap-2",
    chipsWrapperClassName:
      "grid w-full grid-cols-2 gap-2 lg:flex lg:min-w-0 lg:flex-1 lg:items-center lg:gap-2",
    chipContainerClassName: "relative min-w-0 lg:flex-1",
    chipButtonClassName:
      "type-subpara inline-flex h-9 w-full items-center justify-between gap-2 rounded-full border px-3 text-[12px] font-semibold transition sm:h-10 lg:px-4",
    inactiveChipClassName: "border-[#ddd5cc] bg-white text-[#666666]",
    applyButtonClassName:
      "type-h6 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#c96b33] px-6 text-white transition hover:bg-[#b85e2a] lg:w-auto lg:shrink-0 lg:px-8",
  },
  preview: {
    containerClassName:
      "mt-4 flex flex-col gap-2.5 lg:mt-5 lg:flex-wrap lg:flex-row lg:items-center lg:justify-between lg:gap-2",
    chipsWrapperClassName:
      "grid w-full grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:gap-2",
    chipContainerClassName: "relative min-w-0",
    chipButtonClassName:
      "type-subpara inline-flex h-9 w-full items-center justify-between gap-2 rounded-full border px-3 text-[12px] font-semibold transition sm:h-10 lg:w-auto lg:min-w-[132px] lg:px-4",
    inactiveChipClassName: "border-[#bdbdbd] bg-white text-[#666666]",
    applyButtonClassName:
      "type-h6 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#c96b33] px-5 text-white transition hover:bg-[#b85e2a] sm:w-auto sm:self-end lg:h-8",
  },
};

export function createDefaultOtherFilters() {
  return {
    individualPackaging: false,
    newlyAdded: false,
    smallBusiness: false,
    budgetPerPerson: "",
    orderMinimum: FILTER_DEFAULTS.orderMinimum,
    distance: FILTER_DEFAULTS.distance,
  };
}
