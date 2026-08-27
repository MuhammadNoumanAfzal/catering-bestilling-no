import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  FILTER_DEFAULTS,
  FILTER_BAR_VARIANTS,
  translateBrowseOptionLabel,
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
  const { t } = useTranslation();
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
        otherFilters.orderMinimum !== FILTER_DEFAULTS.orderMinimum,
        otherFilters.distance !== FILTER_DEFAULTS.distance,
      ].filter(Boolean).length,
    [otherFilters],
  );

  const selectedFilterChips = useMemo(() => {
    const chips = [];

    if (selectedSort !== FILTER_DEFAULTS.sort) {
      chips.push({
        id: `sort-${selectedSort}`,
        label: translateBrowseOptionLabel(t, selectedSort),
        onRemove: () => setSelectedSort(FILTER_DEFAULTS.sort),
      });
    }

    if (selectedRating !== FILTER_DEFAULTS.rating) {
      chips.push({
        id: `rating-${selectedRating}`,
        label: translateBrowseOptionLabel(t, selectedRating),
        onRemove: () => setSelectedRating(FILTER_DEFAULTS.rating),
        tone: "highlight",
      });
    }

    selectedDietary.forEach((option) => {
      chips.push({
        id: `dietary-${option}`,
        label: translateBrowseOptionLabel(t, option),
        onRemove: () =>
          setSelectedDietary((current) => current.filter((item) => item !== option)),
      });
    });

    selectedOffers.forEach((option) => {
      chips.push({
        id: `offer-${option}`,
        label: translateBrowseOptionLabel(t, option),
        onRemove: () =>
          setSelectedOffers((current) => current.filter((item) => item !== option)),
      });
    });

    if (selectedPricing !== FILTER_DEFAULTS.pricing) {
      chips.push({
        id: `pricing-${selectedPricing}`,
        label: translateBrowseOptionLabel(t, selectedPricing),
        onRemove: () => setSelectedPricing(FILTER_DEFAULTS.pricing),
      });
    }

    if (otherFilters.individualPackaging) {
      chips.push({
        id: "other-individualPackaging",
        label: t("browse.otherFilters.individualPackaging"),
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
        label: t("browse.otherFilters.new"),
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
        label: t("browse.otherFilters.smallBusiness"),
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
        label: `${t("browse.otherFilters.budget")} ${otherFilters.budgetPerPerson}`,
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            budgetPerPerson: "",
          })),
      });
    }

    if (otherFilters.orderMinimum !== FILTER_DEFAULTS.orderMinimum) {
      chips.push({
        id: `other-orderMinimum-${otherFilters.orderMinimum}`,
        label: translateBrowseOptionLabel(t, otherFilters.orderMinimum),
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            orderMinimum: FILTER_DEFAULTS.orderMinimum,
          })),
      });
    }

    if (otherFilters.distance !== FILTER_DEFAULTS.distance) {
      chips.push({
        id: `other-distance-${otherFilters.distance}`,
        label: translateBrowseOptionLabel(t, otherFilters.distance),
        onRemove: () =>
          setOtherFilters((current) => ({
            ...current,
            distance: FILTER_DEFAULTS.distance,
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
    t,
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
      <div className="sticky top-[68px] z-30 bg-white/92 pb-3 backdrop-blur-[10px] sm:top-[76px]">
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
              showAppliedState
                ? "!border-[#d88c5d] !bg-[linear-gradient(135deg,#b95f2d_0%,#cf6e38_100%)]"
                : ""
            }`}
          >
            {showAppliedState ? t("browse.applied") : t("browse.apply")}
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
