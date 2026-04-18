import { useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

const CATEGORY_STRIP_VARIANTS = {
  default: {
    wrapper: "relative w-full",
    scrollArea:
      "mx-auto mt-4 w-full max-w-[1120px] overflow-x-auto px-2 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-6 sm:px-4 sm:py-5",
    grid: "flex min-w-max gap-4 sm:gap-6 md:gap-9",
    button:
      "flex w-[72px] shrink-0 flex-col items-center gap-2 text-center sm:w-[80px] md:w-[88px]",
    iconWrapper:
      "flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f2ec] transition sm:h-11 sm:w-11 md:h-12 md:w-12",
    image: "h-6 w-6 object-contain opacity-90 sm:h-7 sm:w-7 md:h-8 md:w-8",
    fallbackIcon: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1eb] text-[#CF3A00] sm:h-7 sm:w-7 md:h-8 md:w-8">
        <FiMoreHorizontal className="text-[14px] sm:text-[16px] md:text-[18px]" />
      </span>
    ),
    label:
      "text-[11px] font-medium leading-tight text-[#5f5f5f] sm:text-xs md:text-sm",
    panel:
      "absolute left-1/2 top-[calc(100%+12px)] z-20 w-[calc(100%-8px)] max-w-[820px] -translate-x-1/2 rounded-xl border border-[#dcdcdc] bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:w-[92%] sm:p-4",
    panelPointer:
      "absolute -top-[7px] right-8 h-3.5 w-3.5 rotate-45 border-l border-t border-[#dcdcdc] bg-white sm:right-14",
    panelGrid: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
    optionButton:
      "rounded-full border border-[#bbbbbb] px-3 py-2 text-center text-xs text-[#333] transition hover:bg-[#f7f2ec] sm:text-sm",
    clearButton:
      "rounded-md border border-[#bcbcbc] px-3 py-2 text-xs text-[#333] sm:text-sm",
    applyButton:
      "rounded-md bg-[#CF3A00] px-3 py-2 text-xs text-white sm:text-sm",
  },
  preview: {
    wrapper: "relative w-full",
    scrollArea:
      "mx-auto mt-6 w-full max-w-[1120px] overflow-x-auto px-2 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-8 sm:px-4",
    grid: "flex min-w-max gap-4 sm:gap-5 md:gap-6",
    button:
      "flex w-[70px] shrink-0 flex-col items-center gap-2 text-center sm:w-[76px] md:w-[82px]",
    iconWrapper:
      "flex h-9 w-9 items-center justify-center text-[#8b8b8b] sm:h-10 sm:w-10",
    image: "h-5 w-5 object-contain opacity-90 sm:h-6 sm:w-6",
    fallbackIcon: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1eb] text-[#CF3A00] shadow-sm sm:h-7 sm:w-7">
        <FiMoreHorizontal className="text-[14px] sm:text-[15px]" />
      </span>
    ),
    label: "text-[11px] font-medium text-[#5f5f5f] sm:text-xs md:text-sm",
    panel:
      "absolute left-1/2 top-[calc(100%+12px)] z-20 w-[calc(100%-8px)] max-w-[920px] -translate-x-1/2 rounded-xl border border-[#dcdcdc] bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:w-[92%] sm:p-4",
    panelPointer:
      "absolute -top-[7px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-[#dcdcdc] bg-white sm:right-8",
    panelGrid: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
    optionButton:
      "rounded-full border border-[#bbbbbb] px-3 py-2 text-center text-xs text-[#333] transition hover:bg-[#f7f2ec] sm:text-sm",
    clearButton:
      "rounded-md border border-[#bcbcbc] px-3 py-2 text-xs text-[#333] sm:text-sm",
    applyButton:
      "rounded-md bg-[#CF3A00] px-3 py-2 text-xs text-white sm:text-sm",
  },
};

export default function BrowseCategoryStrip({
  categories = [],
  moreOptions = [],
  variant = "default",
  isOpen,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedMoreOptions, setSelectedMoreOptions] = useState([]);

  const styles = useMemo(
    () => CATEGORY_STRIP_VARIANTS[variant] ?? CATEGORY_STRIP_VARIANTS.default,
    [variant],
  );

  const showMorePanel = isOpen ?? internalOpen;
  const hasSelectedMoreOptions = selectedMoreOptions.length > 0;
  const shouldScroll = categories.length > 6;

  const setPanelOpen = (nextOpen) => {
    if (isOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleCategoryClick = (itemName) => {
    if (itemName === "More") {
      setPanelOpen(!showMorePanel);
      return;
    }

    setPanelOpen(false);
  };

  const toggleMoreOption = (option) => {
    setSelectedMoreOptions((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const clearFilters = () => {
    setSelectedMoreOptions([]);
    setPanelOpen(false);
  };

  const applyFilters = () => {
    setPanelOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollArea}>
        <div
          className={`${styles.grid} ${
            shouldScroll ? "" : "justify-center sm:mx-auto"
          }`}
        >
          {categories.map((item) => {
            const isMore = item.name === "More";
            const isMoreActive =
              isMore && (showMorePanel || hasSelectedMoreOptions);

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleCategoryClick(item.name)}
                className={`${styles.button} transition ${
                  isMoreActive ? "text-[#CF3A00]" : ""
                }`}
              >
                <span
                  className={`${styles.iconWrapper} ${
                    isMoreActive
                      ? "border border-[#CF3A00] bg-[#fff1eb] text-[#CF3A00]"
                      : ""
                  }`}
                >
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={styles.image}
                    />
                  ) : (
                    styles.fallbackIcon
                  )}
                </span>

                <span
                  className={`${styles.label} ${
                    isMoreActive ? "text-[#CF3A00]" : ""
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showMorePanel && (
        <div className={styles.panel}>
          <span className={styles.panelPointer} />

          <div className={styles.panelGrid}>
            {moreOptions.map((option) => {
              const isSelected = selectedMoreOptions.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMoreOption(option)}
                  className={`${styles.optionButton} ${
                    isSelected
                      ? "border-[#CF3A00] bg-[#fff1eb] text-[#CF3A00]"
                      : ""
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Clear filter
            </button>

            <button
              type="button"
              onClick={applyFilters}
              className={styles.applyButton}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
