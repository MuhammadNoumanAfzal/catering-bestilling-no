import { FiStar } from "react-icons/fi";
import FilterDropdown from "./FilterDropdown";
import MultiSelectIndicator from "./MultiSelectIndicator";

export default function BrowseFilterOptionsDropdown({
  chipKey,
  openDropdown,
  closeDropdown,
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
  mobileAlign,
}) {
  const toggleMultiSelect = (setter, option) => {
    setter((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  if (chipKey === "sort" && openDropdown === "sort") {
    return (
      <FilterDropdown
        minWidthClassName="min-w-[190px]"
        mobileAlign={mobileAlign}
        onClear={() => {
          setSelectedSort("Sort by");
          closeDropdown();
        }}
      >
        {sortByOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelectedSort(option);
            }}
            className="type-para block w-full rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
          >
            {option}
          </button>
        ))}
      </FilterDropdown>
    );
  }

  if (chipKey === "rating" && openDropdown === "rating") {
    return (
      <FilterDropdown
        minWidthClassName="min-w-[190px]"
        mobileAlign={mobileAlign}
        onClear={() => {
          setSelectedRating("Ratings");
          closeDropdown();
        }}
      >
        {ratingOptions.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelectedRating(option);
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
    );
  }

  if (chipKey === "dietary" && openDropdown === "dietary") {
    return (
      <FilterDropdown
        minWidthClassName="min-w-[190px]"
        mobileAlign={mobileAlign}
        onClear={() => {
          setSelectedDietary([]);
          closeDropdown();
        }}
      >
        {dietaryOptions.map((option) => {
          const isSelected = selectedDietary.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleMultiSelect(setSelectedDietary, option)}
              className="type-para flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
            >
              <MultiSelectIndicator isSelected={isSelected} />
              <span>{option}</span>
            </button>
          );
        })}
      </FilterDropdown>
    );
  }

  if (chipKey === "offer" && openDropdown === "offer") {
    return (
      <FilterDropdown
        minWidthClassName="min-w-[250px]"
        mobileAlign={mobileAlign}
        onClear={() => {
          setSelectedOffers([]);
          closeDropdown();
        }}
      >
        {offerOptions.map((option) => {
          const isSelected = selectedOffers.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleMultiSelect(setSelectedOffers, option)}
              className="type-para flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
            >
              <MultiSelectIndicator isSelected={isSelected} />
              <span>{option}</span>
            </button>
          );
        })}
      </FilterDropdown>
    );
  }

  if (chipKey === "pricing" && openDropdown === "pricing") {
    return (
      <FilterDropdown
        minWidthClassName="min-w-[190px]"
        mobileAlign={mobileAlign}
        onClear={() => {
          setSelectedPricing("Pricing");
          closeDropdown();
        }}
      >
        {pricingOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelectedPricing(option);
            }}
            className="type-para block w-full rounded-[8px] px-3 py-2 text-left text-black transition hover:bg-[#f7f2ec]"
          >
            {option}
          </button>
        ))}
      </FilterDropdown>
    );
  }

  return null;
}
