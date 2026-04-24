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

export const FILTER_BAR_VARIANTS = {
  default: {
    containerClassName:
      "relative mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2",
    chipsWrapperClassName:
      "grid w-full grid-cols-2 gap-2 lg:flex lg:min-w-0 lg:flex-1 lg:items-center lg:gap-2",
    chipContainerClassName: "relative min-w-0 lg:flex-1",
    chipButtonClassName:
      "type-subpara inline-flex h-10 w-full items-center justify-between gap-2 rounded-full border px-3 font-semibold transition lg:px-4",
    inactiveChipClassName: "border-[#ddd5cc] bg-white text-[#666666]",
    applyButtonClassName:
      "type-h6 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#c96b33] px-6 text-white transition hover:bg-[#b85e2a] lg:w-auto lg:shrink-0 lg:px-8",
  },
  preview: {
    containerClassName:
      "mt-5 flex flex-col gap-3 lg:flex-wrap lg:flex-row lg:items-center lg:justify-between lg:gap-2",
    chipsWrapperClassName:
      "grid w-full grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:gap-2",
    chipContainerClassName: "relative min-w-0",
    chipButtonClassName:
      "type-subpara inline-flex h-10 w-full items-center justify-between gap-2 rounded-full border px-3 font-semibold transition lg:w-auto lg:min-w-[132px] lg:px-4",
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
    orderMinimum: "Any price",
    distance: "Any distance",
  };
}
