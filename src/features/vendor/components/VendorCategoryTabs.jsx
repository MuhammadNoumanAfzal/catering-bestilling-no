import { useState } from "react";
import { FiSliders, FiX } from "react-icons/fi";

const FILTER_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Gluten-Free",
  "Individual Packaging",
];

export default function VendorCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (option) => {
    setSelectedFilters((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  return (
    <div className="border-b border-[#ece5dc] pb-6">
      <div className="hide-scrollbar flex items-center gap-5 overflow-x-auto pb-2 text-[14px] font-semibold">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`shrink-0 border-b pb-2 transition ${
                isActive
                  ? "cursor-pointer border-[#1a1a1a] font-semibold text-[#1a1a1a]"
                  : "cursor-pointer border-transparent text-[#5f5f5f]"
              }`}
            >
              {category}
            </button>
          );
        })}

        <div className="relative ml-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#1f1f1f] bg-white px-5 py-3 text-[16px] font-semibold text-[#1f1f1f]"
          >
            Filter
            <FiSliders className="text-[18px]" />
          </button>

          {showFilters ? (
            <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[220px] rounded-[12px] border border-[#ddd6cd] bg-white p-3 shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
              <div className="space-y-1.5">
                {FILTER_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2 type-para font-medium text-[#2b2b2b]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option)}
                      onChange={() => toggleFilter(option)}
                      className="h-3 w-3 accent-[#cf6e38]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {selectedFilters.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {selectedFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[8px] bg-[#efefef] px-4 py-2 text-[16px] font-semibold text-[#1f1f1f]"
            >
              <span>{filter}</span>
              <FiX className="text-[16px]" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
