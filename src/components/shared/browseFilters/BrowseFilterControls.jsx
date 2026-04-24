import { browseFilterChips } from "../../../features/browse/data/browseData";
import { DROPDOWN_CHIP_KEYS } from "./browseFilterConfig";
import BrowseFilterChipButton from "./BrowseFilterChipButton";
import BrowseFilterOptionsDropdown from "./BrowseFilterOptionsDropdown";

export default function BrowseFilterControls({
  styles,
  activeFilters,
  otherFilterCount,
  openDropdown,
  onChipClick,
  setOpenDropdown,
  selectedSort,
  setSelectedSort,
  selectedRating,
  setSelectedRating,
  selectedDietary,
  setSelectedDietary,
  selectedOffers,
  setSelectedOffers,
  selectedPricing,
  setSelectedPricing,
  sortByOptions,
  ratingOptions,
  dietaryOptions,
  offerOptions,
  pricingOptions,
}) {
  return (
    <div className={styles.chipsWrapperClassName}>
      {browseFilterChips.map((chip) => {
        const isActive =
          activeFilters.includes(chip.key) ||
          (chip.key === "sort" && selectedSort !== "Sort by") ||
          (chip.key === "rating" && selectedRating !== "Ratings") ||
          (chip.key === "dietary" && selectedDietary.length > 0) ||
          (chip.key === "offer" && selectedOffers.length > 0) ||
          (chip.key === "pricing" && selectedPricing !== "Pricing") ||
          (chip.key === "other" && otherFilterCount > 0);

        return (
          <BrowseFilterChipButton
            key={chip.key}
            chip={chip}
            isActive={isActive}
            onClick={() => onChipClick(chip.key)}
            styles={styles}
          >
            {DROPDOWN_CHIP_KEYS.has(chip.key) ? (
              <BrowseFilterOptionsDropdown
                chipKey={chip.key}
                openDropdown={openDropdown}
                closeDropdown={() => setOpenDropdown(null)}
                selectedSort={selectedSort}
                setSelectedSort={(value) => {
                  setSelectedSort(value);
                  setOpenDropdown(null);
                }}
                selectedRating={selectedRating}
                setSelectedRating={(value) => {
                  setSelectedRating(value);
                  setOpenDropdown(null);
                }}
                selectedDietary={selectedDietary}
                setSelectedDietary={setSelectedDietary}
                selectedOffers={selectedOffers}
                setSelectedOffers={setSelectedOffers}
                selectedPricing={selectedPricing}
                setSelectedPricing={(value) => {
                  setSelectedPricing(value);
                  setOpenDropdown(null);
                }}
                sortByOptions={sortByOptions}
                ratingOptions={ratingOptions}
                dietaryOptions={dietaryOptions}
                offerOptions={offerOptions}
                pricingOptions={pricingOptions}
              />
            ) : null}
          </BrowseFilterChipButton>
        );
      })}
    </div>
  );
}
