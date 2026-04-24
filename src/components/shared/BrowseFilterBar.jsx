import { useMemo, useState } from "react";
import {
  dietaryOptions,
  offerOptions,
  pricingOptions,
  ratingOptions,
  sortByOptions,
} from "../../features/browse/data/browseData";
import BrowseFilterControls from "./browseFilters/BrowseFilterControls";
import {
  createDefaultOtherFilters,
  DROPDOWN_CHIP_KEYS,
  FILTER_BAR_VARIANTS,
} from "./browseFilters/browseFilterConfig";
import OtherFiltersModal from "./browseFilters/OtherFiltersModal";
import SelectedFilterChipsRow from "./browseFilters/SelectedFilterChipsRow";

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
          setSelectedDietary((current) => current.filter((item) => item !== option)),
      });
    });

    selectedOffers.forEach((option) => {
      chips.push({
        id: `offer-${option}`,
        label: option,
        onRemove: () =>
          setSelectedOffers((current) => current.filter((item) => item !== option)),
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
          <BrowseFilterControls
            styles={styles}
            activeFilters={activeFilters}
            otherFilterCount={otherFilterCount}
            openDropdown={openDropdown}
            onChipClick={handleChipClick}
            setOpenDropdown={setOpenDropdown}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedDietary={selectedDietary}
            setSelectedDietary={setSelectedDietary}
            selectedOffers={selectedOffers}
            setSelectedOffers={setSelectedOffers}
            selectedPricing={selectedPricing}
            setSelectedPricing={setSelectedPricing}
            sortByOptions={sortByOptions}
            ratingOptions={ratingOptions}
            dietaryOptions={dietaryOptions}
            offerOptions={offerOptions}
            pricingOptions={pricingOptions}
          />

          <button type="button" className={styles.applyButtonClassName}>
            Apply
          </button>
        </div>

        <SelectedFilterChipsRow
          chips={selectedFilterChips}
          onClearAll={clearAllFilters}
        />
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
