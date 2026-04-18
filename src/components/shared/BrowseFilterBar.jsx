import { useMemo, useState } from "react";
import { FiCheck, FiChevronDown, FiStar, FiX } from "react-icons/fi";
import {
  browseFilterChips,
  dietaryOptions,
  distanceOptions,
  offerOptions,
  orderMinimumOptions,
  pricingOptions,
  ratingOptions,
  sortByOptions,
} from "../../features/browse/data/browseData";

const DROPDOWN_CHIP_KEYS = new Set([
  "sort",
  "rating",
  "dietary",
  "offer",
  "pricing",
  "other",
]);

const createDefaultOtherFilters = () => ({
  individualPackaging: false,
  newlyAdded: false,
  smallBusiness: false,
  budgetPerPerson: "",
  orderMinimum: "Any price",
  distance: "Any distance",
});

const FILTER_BAR_VARIANTS = {
  default: {
    containerClassName:
      "relative mt-5 flex items-center gap-2",
    chipsWrapperClassName:
      "flex min-w-0 flex-1 items-center gap-2",
    inactiveChipClassName: "border-[#ddd5cc] bg-white text-[#666666]",
    applyButtonClassName:
      "type-h6 cursor-pointer inline-flex h-10 shrink-0 items-center rounded-full bg-[#c96b33] px-8 text-white transition hover:bg-[#b85e2a]",
  },
  preview: {
    containerClassName:
      "mt-5 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-between",
    chipsWrapperClassName:
      "grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2",
    inactiveChipClassName: "border-[#bdbdbd] bg-white text-[#666666]",
    applyButtonClassName:
      "type-h6 inline-flex h-8 shrink-0 items-center rounded-full bg-[#c96b33] px-5 text-white hover:bg-[#b85e2a]",
  },
};

function FilterDropdown({ minWidthClassName, children, onClear }) {
  return (
    <div
      className={`absolute left-0 top-[calc(100%+12px)] z-30 rounded-[12px] border border-[#d9d9d9] bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.16)] ${minWidthClassName}`}
    >
      <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-[#d9d9d9] bg-white" />
      <div className="space-y-1">{children}</div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={onClear}
          className="type-paara cursor-pointer rounded-[6px] border border-[#bcbcbc] px-2 py-1 text-black"
        >
          Clear filter
        </button>
      </div>
    </div>
  );
}

function MultiSelectIndicator({ isSelected }) {
  return (
    <span
      className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
        isSelected
          ? "border-[#CF3A00] bg-[#CF3A00]"
          : "border-[#bcbcbc] bg-white"
      }`}
    >
      {isSelected ? (
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      ) : null}
    </span>
  );
}

function InlineSelectDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  menuPosition = "bottom",
}) {
  const menuPositionClassName =
    menuPosition === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]";

  return (
    <div className="relative">
      <p className="type-para mb-1 text-black">{label}</p>
      <button
        type="button"
        onClick={onToggle}
        className={`type-subpara flex w-full items-center justify-between rounded-[2px] border bg-white px-3 py-2 text-left outline-none transition ${
          value !== "Any price" && value !== "Any distance"
            ? "border-[#CF3A00] text-[#CF3A00]"
            : "border-[#cfcfcf] text-black"
        }`}
      >
        <span>{value}</span>
        <FiChevronDown
          className={`text-[18px] ${
            value !== "Any price" && value !== "Any distance"
              ? "text-[#CF3A00]"
              : "text-[#666]"
          }`}
        />
      </button>

      {isOpen ? (
        <div
          className={`absolute left-0 z-20 w-[250px] rounded-[8px] border border-[#d9d9d9] bg-white p-1 shadow-[0_12px_26px_rgba(0,0,0,0.16)] ${menuPositionClassName}`}
        >
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className={`type-subpara flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left transition ${
                  isSelected
                    ? "bg-[#fff1eb] text-[#CF3A00]"
                    : "text-black hover:bg-[#f7f2ec]"
                }`}
              >
                <span>{option}</span>
                <span className="flex w-4 justify-center">
                  {isSelected ? (
                    <FiCheck className="text-[14px] text-[#CF3A00]" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function OtherFiltersModal({ otherFilters, setOtherFilters, onClose }) {
  const [openInlineDropdown, setOpenInlineDropdown] = useState(null);

  const updateOtherFilter = (key, value) => {
    setOtherFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 px-4">
      <div className="w-full max-w-[440px] rounded-[12px] border border-[#d9d9d9] bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
        <h1 className="type-h3 mb-3 text-black">Other Filters</h1>
        <div className="space-y-3">
          <label className="flex items-start gap-2  ">
            <input
              type="checkbox"
              checked={otherFilters.individualPackaging}
              onChange={(event) =>
                updateOtherFilter("individualPackaging", event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-[#CF3A00]"
            />
            <span>
              <span className="type-para block text-black">
                Individual Packaging
              </span>
              <span className="type-subpara text-[#8a8a8a]">
                Restaurants that offer individually packaged items
              </span>
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={otherFilters.newlyAdded}
              onChange={(event) =>
                updateOtherFilter("newlyAdded", event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-[#CF3A00]"
            />
            <span>
              <span className="type-para block text-black">New</span>
              <span className="type-subpara text-[#8a8a8a]">
                Restaurants that are new to Lunsjavtale
              </span>
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={otherFilters.smallBusiness}
              onChange={(event) =>
                updateOtherFilter("smallBusiness", event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-[#CF3A00]"
            />
            <span className="type-para text-black">Small business</span>
          </label>

          <div>
            <p className="type-para mb-1 text-black">Budget per person</p>
            <input
              type="text"
              value={otherFilters.budgetPerPerson}
              onChange={(event) =>
                updateOtherFilter("budgetPerPerson", event.target.value)
              }
              placeholder="$"
              className={`type-subpara w-full rounded-[2px] border px-3 py-2 outline-none transition ${
                otherFilters.budgetPerPerson
                  ? "border-[#CF3A00] text-[#CF3A00]"
                  : "border-[#cfcfcf] text-black"
              }`}
            />
          </div>

          <div className=" pt-10">
            <h4 className="type-h4 mb-3 text-black">Delivery filters</h4>

            <div className="space-y-3">
              <InlineSelectDropdown
                label="Order minimum"
                value={otherFilters.orderMinimum}
                options={orderMinimumOptions}
                isOpen={openInlineDropdown === "orderMinimum"}
                onToggle={() =>
                  setOpenInlineDropdown((current) =>
                    current === "orderMinimum" ? null : "orderMinimum",
                  )
                }
                onSelect={(option) => {
                  updateOtherFilter("orderMinimum", option);
                  setOpenInlineDropdown(null);
                }}
                menuPosition="bottom"
              />

              <InlineSelectDropdown
                label="Distance"
                value={otherFilters.distance}
                options={distanceOptions}
                isOpen={openInlineDropdown === "distance"}
                onToggle={() =>
                  setOpenInlineDropdown((current) =>
                    current === "distance" ? null : "distance",
                  )
                }
                onSelect={(option) => {
                  updateOtherFilter("distance", option);
                  setOpenInlineDropdown(null);
                }}
                menuPosition="top"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setOtherFilters(createDefaultOtherFilters());
                onClose();
              }}
              className="type-para cursor-pointer rounded-[6px] border border-[#bcbcbc] px-2 py-1 text-black"
            >
              Clear filter
            </button>
            <button
              onClick={onClose}
              className="type-para cursor-pointer rounded-[6px] bg-[#CF3A00] px-2 py-1 text-white"
            >
              Apply filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedFilterChip({ label, onRemove, tone = "default" }) {
  const toneClassName =
    tone === "highlight"
      ? "border-[#bfe5af] bg-[#d8f1ca] text-[#1f1f1f]"
      : "border-[#e2dfda] bg-[#f3f1ee] text-[#1f1f1f]";

  return (
    <button
      type="button"
      onClick={onRemove}
      className={`type-subpara inline-flex h-9 items-center gap-2 rounded-[10px] border px-3 transition hover:opacity-90 ${toneClassName}`}
    >
      <span>{label}</span>
      <FiX className="text-[14px]" />
    </button>
  );
}

export default function BrowseFilterBar({
  variant = "default",
  onControlInteract,
}) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedSort, setSelectedSort] = useState("Sort by");
  const [selectedRating, setSelectedRating] = useState("Ratings");
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState("Pricing");
  const [otherFilters, setOtherFilters] = useState(createDefaultOtherFilters);
  const styles = FILTER_BAR_VARIANTS[variant] ?? FILTER_BAR_VARIANTS.default;

  const otherFilterCount = useMemo(
    () =>
      [
        otherFilters.individualPackaging,
        otherFilters.newlyAdded,
        otherFilters.smallBusiness,
        otherFilters.budgetPerPerson,
        otherFilters.orderMinimum !== "Any price",
        otherFilters.distance !== "Any distance",
      ].filter(Boolean).length,
    [otherFilters],
  );

  const chipLabels = {
    sort: "Sort by",
    rating: "Ratings",
    dietary: "Dietary options",
    offer: "Offer",
    pricing: "Pricing",
    other: "Other Filters",
  };

  const selectedFilterChips = useMemo(() => {
    const chips = [];

    if (selectedSort !== "Sort by") {
      chips.push({
        id: `sort-${selectedSort}`,
        label: selectedSort,
        onRemove: () => setSelectedSort("Sort by"),
      });
    }

    if (selectedRating !== "Ratings") {
      chips.push({
        id: `rating-${selectedRating}`,
        label: selectedRating,
        onRemove: () => setSelectedRating("Ratings"),
        tone: "highlight",
      });
    }

    selectedDietary.forEach((option) => {
      chips.push({
        id: `dietary-${option}`,
        label: option,
        onRemove: () =>
          setSelectedDietary((current) =>
            current.filter((item) => item !== option),
          ),
      });
    });

    selectedOffers.forEach((option) => {
      chips.push({
        id: `offer-${option}`,
        label: option,
        onRemove: () =>
          setSelectedOffers((current) =>
            current.filter((item) => item !== option),
          ),
      });
    });

    if (selectedPricing !== "Pricing") {
      chips.push({
        id: `pricing-${selectedPricing}`,
        label: selectedPricing,
        onRemove: () => setSelectedPricing("Pricing"),
      });
    }

    if (otherFilters.individualPackaging) {
      chips.push({
        id: "other-individualPackaging",
        label: "Individual packaging",
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            individualPackaging: false,
          })),
      });
    }

    if (otherFilters.newlyAdded) {
      chips.push({
        id: "other-newlyAdded",
        label: "New",
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            newlyAdded: false,
          })),
      });
    }

    if (otherFilters.smallBusiness) {
      chips.push({
        id: "other-smallBusiness",
        label: "Small business",
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            smallBusiness: false,
          })),
      });
    }

    if (otherFilters.budgetPerPerson) {
      chips.push({
        id: "other-budgetPerPerson",
        label: `Budget ${otherFilters.budgetPerPerson}`,
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            budgetPerPerson: "",
          })),
      });
    }

    if (otherFilters.orderMinimum !== "Any price") {
      chips.push({
        id: `other-orderMinimum-${otherFilters.orderMinimum}`,
        label: otherFilters.orderMinimum,
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            orderMinimum: "Any price",
          })),
      });
    }

    if (otherFilters.distance !== "Any distance") {
      chips.push({
        id: `other-distance-${otherFilters.distance}`,
        label: otherFilters.distance,
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            distance: "Any distance",
          })),
      });
    }

    return chips;
  }, [
    otherFilters,
    selectedDietary,
    selectedOffers,
    selectedPricing,
    selectedRating,
    selectedSort,
  ]);

  const clearAllFilters = () => {
    setActiveFilters([]);
    setOpenDropdown(null);
    setSelectedSort("Sort by");
    setSelectedRating("Ratings");
    setSelectedDietary([]);
    setSelectedOffers([]);
    setSelectedPricing("Pricing");
    setOtherFilters(createDefaultOtherFilters());
  };

  const toggleFilter = (key) => {
    setActiveFilters((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const toggleMultiSelect = (setter, option) => {
    setter((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const handleChipClick = (chipKey) => {
    onControlInteract?.();

    if (DROPDOWN_CHIP_KEYS.has(chipKey)) {
      setOpenDropdown((current) => (current === chipKey ? null : chipKey));
      return;
    }

    setOpenDropdown(null);
    toggleFilter(chipKey);
  };

  return (
    <>
      <div className="sticky top-[76px] z-30 bg-white/95 pb-2 backdrop-blur-[6px]">
        <div className={styles.containerClassName}>
          <div className={styles.chipsWrapperClassName}>
            {browseFilterChips.map((chip) => {
              const isDropdownChip = DROPDOWN_CHIP_KEYS.has(chip.key);
              const isActive =
                activeFilters.includes(chip.key) ||
                (chip.key === "sort" && selectedSort !== "Sort by") ||
                (chip.key === "rating" && selectedRating !== "Ratings") ||
                (chip.key === "dietary" && selectedDietary.length > 0) ||
                (chip.key === "offer" && selectedOffers.length > 0) ||
                (chip.key === "pricing" && selectedPricing !== "Pricing") ||
                (chip.key === "other" && otherFilterCount > 0);

              return (
                <div key={chip.key} className="relative min-w-0 flex-1">
                  <button
                    onClick={() => handleChipClick(chip.key)}
                    className={`type-subpara font-semibold cursor-pointer inline-flex h-10 w-full items-center justify-between gap-2 rounded-full border px-3 text-[30px] font-medium transition xl:px-4 ${
                      isActive  
                        ? "border-[#CF3A00] bg-[#fff1eb] text-[#CF3A00]"
                        : styles.inactiveChipClassName
                    }`}
                  >
                    <span className="flex w-3 shrink-0 justify-center">
                      {chip.icon === "star" ? (
                        <FiStar className="text-[11px] text-[#d5aa22]" />
                      ) : null}
                    </span>

                    <span className="truncate">
                      {chipLabels[chip.key] ?? chip.label}
                    </span>

                    {isDropdownChip ? (
                      <FiChevronDown className="shrink-0 text-[16px]" />
                    ) : null}
                  </button>

                  {chip.key === "sort" && openDropdown === "sort" ? (
                    <FilterDropdown
                      minWidthClassName="min-w-[190px]"
                      onClear={() => {
                        setSelectedSort("Sort by");
                        setOpenDropdown(null);
                      }}
                    >
                      {sortByOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedSort(option);
                            setOpenDropdown(null);
                          }}
                          className="type-para block w-full rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
                        >
                          {option}
                        </button>
                      ))}
                    </FilterDropdown>
                  ) : null}

                  {chip.key === "rating" && openDropdown === "rating" ? (
                    <FilterDropdown
                      minWidthClassName="min-w-[190px]"
                      onClear={() => {
                        setSelectedRating("Ratings");
                        setOpenDropdown(null);
                      }}
                    >
                      {ratingOptions.map((option, index) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedRating(option);
                            setOpenDropdown(null);
                          }}
                          className="type-para flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
                        >
                          <span className="flex items-center gap-1 text-[#d5aa22]">
                            <span className="text-black">{5 - index}</span>
                            <FiStar className="text-[11px] fill-[#d5aa22]" />
                          </span>
                          <span>{option.replace(/^\d+\s*/, "")}</span>
                        </button>
                      ))}
                    </FilterDropdown>
                  ) : null}

                  {chip.key === "dietary" && openDropdown === "dietary" ? (
                    <FilterDropdown
                      minWidthClassName="min-w-[190px]"
                      onClear={() => {
                        setSelectedDietary([]);
                        setOpenDropdown(null);
                      }}
                    >
                      {dietaryOptions.map((option) => {
                        const isSelected = selectedDietary.includes(option);

                        return (
                          <button
                            key={option}
                            onClick={() =>
                              toggleMultiSelect(setSelectedDietary, option)
                            }
                            className="type-para flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
                          >
                            <MultiSelectIndicator isSelected={isSelected} />
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </FilterDropdown>
                  ) : null}

                  {chip.key === "offer" && openDropdown === "offer" ? (
                    <FilterDropdown
                      minWidthClassName="min-w-[250px]"
                      onClear={() => {
                        setSelectedOffers([]);
                        setOpenDropdown(null);
                      }}
                    >
                      {offerOptions.map((option) => {
                        const isSelected = selectedOffers.includes(option);

                        return (
                          <button
                            key={option}
                            onClick={() =>
                              toggleMultiSelect(setSelectedOffers, option)
                            }
                            className="type-para flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
                          >
                            <MultiSelectIndicator isSelected={isSelected} />
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </FilterDropdown>
                  ) : null}

                  {chip.key === "pricing" && openDropdown === "pricing" ? (
                    <FilterDropdown
                      minWidthClassName="min-w-[190px]"
                      onClear={() => {
                        setSelectedPricing("Pricing");
                        setOpenDropdown(null);
                      }}
                    >
                      {pricingOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedPricing(option);
                            setOpenDropdown(null);
                          }}
                          className="type-para block w-full rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
                        >
                          {option}
                        </button>
                      ))}
                    </FilterDropdown>
                  ) : null}
                </div>
              );
            })}
          </div>

          <button className={styles.applyButtonClassName}>Apply</button>
        </div>

        {selectedFilterChips.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#efe9e2] pt-3">
            {selectedFilterChips.map((chip) => (
              <SelectedFilterChip
                key={chip.id}
                label={chip.label}
                onRemove={chip.onRemove}
                tone={chip.tone}
              />
            ))}

            <button
              type="button"
              onClick={clearAllFilters}
              className="type-subpara inline-flex h-9 items-center rounded-full border border-[#c9c4be] bg-white px-4 text-[#1f1f1f] transition hover:bg-[#f7f2ec]"
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </div>

      {openDropdown === "other" ? (
        <OtherFiltersModal
          otherFilters={otherFilters}
          setOtherFilters={setOtherFilters}
          onClose={() => setOpenDropdown(null)}
        />
      ) : null}
    </>
  );
}
