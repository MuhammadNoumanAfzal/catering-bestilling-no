import { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

const CATEGORY_STRIP_VARIANTS = {
  default: {
    wrapperClassName: "relative",
    scrollAreaClassName:
      "mx-auto mt-6 w-full max-w-[1120px] overflow-x-auto bg-white py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    gridClassName: "flex min-w-max gap-9",
    buttonClassName:
      "flex w-[88px] shrink-0 cursor-pointer flex-col items-center gap-2 text-center",
    iconWrapperClassName:
      "flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f2ec]",
    imageClassName: "h-8 w-8 object-contain opacity-90",
    fallbackIcon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1eb] text-[#CF3A00]">
        <FiMoreHorizontal className="text-[18px]" />
      </span>
    ),
    labelClassName: "type-h5  font-medium text-[#5f5f5f] sm:text-sm",
    panelClassName:
      "absolute right-10 top-[calc(100%+14px)] z-20 w-[92%] max-w-[820px] rounded-[12px] border border-[#dcdcdc] bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)]",
    panelPointerClassName:
      "absolute -top-[7px] right-[60px] h-3.5 w-3.5 rotate-45 border-l border-t border-[#dcdcdc] bg-white",
    panelGridClassName: "grid grid-cols-2 gap-2 sm:grid-cols-3",
    optionButtonClassName:
      "type-para rounded-full border   cursor-pointer border-[#bbbbbb] px-3 py-2 text-center text-[#333] transition hover:bg-[#f7f2ec]",
    clearButtonClassName:
      "type-subpara rounded-[6px] cursor-pointer border border-[#bcbcbc] px-3 py-1.5 text-[#333]",
    applyButtonClassName:
      "type-subpara rounded-[6px] cursor-pointer bg-[#CF3A00] px-3 py-1.5 text-white",
  },
  preview: {
    wrapperClassName: "",
    scrollAreaClassName:
      "mx-auto mt-8 w-full max-w-[1120px] overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    gridClassName: "flex min-w-max gap-6",
    buttonClassName:
      "flex w-[82px] shrink-0 flex-col items-center cursor-pointer gap-2 text-center",
    iconWrapperClassName:
      "flex h-10 w-10 items-center justify-center text-[#8b8b8b]",
    imageClassName: "h-6 w-6 cursor-pointer object-contain opacity-90",
    fallbackIcon: (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1eb] text-[#CF3A00] shadow-sm">
        <FiMoreHorizontal className="text-[15px]" />
      </span>
    ),
    labelClassName: "type-h5 text-[#5f5f5f]",
    panelClassName:
      "absolute right-0 top-[calc(100%+14px)] z-20 w-[92%] max-w-[920px] rounded-[12px] border border-[#dcdcdc] bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)]",
    panelPointerClassName:
      "absolute -top-[7px] right-[26px] h-3.5 w-3.5 rotate-45 border-l border-t border-[#dcdcdc] bg-white",
    panelGridClassName: "grid grid-cols-2 gap-2 sm:grid-cols-3 cursor-pointer",
    optionButtonClassName:
      "type-para rounded-full border border-[#bbbbbb] px-3 py-2 text-center text-[#333] transition hover:bg-[#f7f2ec] cursor-pointer",
    clearButtonClassName:
      "type-para rounded-[6px] border border-[#bcbcbc] px-3 py-1.5 text-[#333]",
    applyButtonClassName:
      "type-para rounded-[6px] bg-[#CF3A00] px-3 py-1.5 text-white",
  },
};

export default function BrowseCategoryStrip({
  categories,
  moreOptions,
  variant = "default",
  isOpen,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedMoreOptions, setSelectedMoreOptions] = useState([]);
  const styles =
    CATEGORY_STRIP_VARIANTS[variant] ?? CATEGORY_STRIP_VARIANTS.default;
  const showMorePanel = isOpen ?? internalOpen;
  const hasSelectedMoreOptions = selectedMoreOptions.length > 0;
  const shouldScroll = categories.length > 8;

  const handleMorePanelChange = (nextOpen) => {
    if (isOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const toggleMoreOption = (option) => {
    setSelectedMoreOptions((current) =>
      current.includes(option) ? [] : [option],
    );
  };

  return (
    <div className={styles.wrapperClassName}>
      <div className={styles.scrollAreaClassName}>
        <div
          className={`${styles.gridClassName} ${
            shouldScroll ? "" : "mx-auto justify-center"
          }`}
        >
          {categories.map((item) => {
            const isMore = item.name === "More";
            const isMoreActive =
              isMore && (showMorePanel || hasSelectedMoreOptions);

            return (
              <button
                key={item.name}
                onClick={() => {
                  if (isMore) {
                    handleMorePanelChange(!showMorePanel);
                  } else {
                    handleMorePanelChange(false);
                  }
                }}
                className={`${styles.buttonClassName} transition ${
                  isMoreActive ? "text-[#CF3A00]" : ""
                }`}
              >
                <span
                  className={`${styles.iconWrapperClassName} transition ${
                    isMoreActive
                      ? "border border-[#CF3A00] bg-[#fff1eb] text-[#CF3A00]"
                      : ""
                  }`}
                >
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={styles.imageClassName}
                    />
                  ) : (
                    styles.fallbackIcon
                  )}
                </span>
                <span
                  className={`${styles.labelClassName} ${
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

      {showMorePanel ? (
        <div className={styles.panelClassName}>
          <span className={styles.panelPointerClassName} />
          <div className={styles.panelGridClassName}>
            {moreOptions.map((option) => {
              const isSelected = selectedMoreOptions.includes(option);

              return (
                <button
                  key={option}
                  onClick={() => toggleMoreOption(option)}
                  className={`${styles.optionButtonClassName} ${
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

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => {
                setSelectedMoreOptions([]);
                handleMorePanelChange(false);
              }}
              className={styles.clearButtonClassName}
            >
              Clear filter
            </button>
            <button
              onClick={() => handleMorePanelChange(false)}
              className={styles.applyButtonClassName}
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
