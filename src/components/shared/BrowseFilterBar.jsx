import { useEffect, useMemo, useState } from "react";
import {
  dietaryOptions,
  offerOptions,
  pricingOptions,
  ratingOptions,
  sortByOptions,
} from "../../features/browse/data/browseData";
import BrowseFilterControls from "./browseFilters/BrowseFilterControls";
import {
  DROPDOWN_CHIP_KEYS,
  FILTER_BAR_VARIANTS,
} from "./browseFilters/browseFilterConfig";
import OtherFiltersModal from "./browseFilters/OtherFiltersModal";
import SelectedFilterChipsRow from "./browseFilters/SelectedFilterChipsRow";
import { useBrowseFilters } from "../../app/context/BrowseFiltersContext";

export default function BrowseFilterBar({
  variant = "default",
  onControlInteract,
  onApply,
  resultsAnchorId,
}) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAppliedState, setShowAppliedState] = useState(false);
  const {
    clearBrowseFilters,
    otherFilters,
    selectedDietary,
    selectedOffers,
    selectedPricing,
    selectedRating,
    selectedSort,
    setOtherFilters,
    setSelectedDietary,
    setSelectedOffers,
    setSelectedPricing,
    setSelectedRating,
    setSelectedSort,
  } = useBrowseFilters();
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
    clearBrowseFilters();
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

  const handleApplyClick = () => {
    setOpenDropdown(null);
    setShowAppliedState(true);
    onControlInteract?.();
    onApply?.();

    if (!resultsAnchorId) {
      return;
    }

    requestAnimationFrame(() => {
      const element = document.getElementById(resultsAnchorId);

      if (!element) {
        return;
      }

      const topOffset = 104;
      const nextScrollTop =
        element.getBoundingClientRect().top + window.scrollY - topOffset;

      window.scrollTo({
        top: Math.max(0, nextScrollTop),
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    if (!showAppliedState) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowAppliedState(false);
    }, 1400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showAppliedState]);

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

          <button
            type="button"
            onClick={handleApplyClick}
            className={`${styles.applyButtonClassName} ${
              showAppliedState ? "bg-[#2f8f57] hover:bg-[#2a7f4d]" : ""
            }`}
          >
            {showAppliedState ? "Applied" : "Apply"}
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
