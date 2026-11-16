import { toggleCategorySelection } from "../../features/browse/utils/categoryFilters.js";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiGrid, FiMoreHorizontal, FiX } from "react-icons/fi";

const CATEGORY_STRIP_VARIANTS = {
  default: {
    wrapper: "relative w-full",
    scrollArea:
      "mx-auto mt-3 flex w-fit max-w-full justify-center overflow-x-auto px-1 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-6 sm:px-4 sm:py-5",
    grid: "flex min-w-max justify-center gap-3 sm:gap-6 md:gap-9",
    button:
      "flex w-[64px] shrink-0 cursor-pointer flex-col items-center gap-1.5 text-center sm:w-[80px] md:w-[88px]",
    iconWrapper:
      "flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f2ec] transition sm:h-11 sm:w-11 md:h-12 md:w-12",
    image: "h-5 w-5 object-contain opacity-90 sm:h-7 sm:w-7 md:h-8 md:w-8",
    fallbackIcon: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1eb] text-[#CF3A00] sm:h-7 sm:w-7 md:h-8 md:w-8">
        <FiMoreHorizontal className="text-[14px] sm:text-[16px] md:text-[18px]" />
      </span>
    ),
    label:
      "text-[12px] font-semibold leading-snug text-[#332b25] sm:text-[13px] md:text-[14px]",
    panel:
      "absolute left-1/2 top-[calc(100%+10px)] z-50 w-[calc(100%-8px)] max-w-[820px] -translate-x-1/2 rounded-xl border border-[#dcdcdc] bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:w-[92%] sm:p-4",
    panelPointer:
      "absolute -top-[7px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-[#dcdcdc] bg-white sm:right-14",
    panelGrid: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
    optionButton:
      "rounded-full cursor-pointer border border-[#bbbbbb] px-3 py-2 text-center text-xs text-[#333] transition hover:bg-[#f7f2ec] sm:text-sm",
    clearButton:
      "rounded-md cursor-pointer border border-[#bcbcbc] px-3 py-2 text-xs text-[#333] sm:text-sm",
    applyButton:
      "rounded-md cursor-pointer bg-[#CF3A00] px-3 py-2 text-xs text-white sm:text-sm",
  },
  preview: {
    wrapper: "relative w-full",
    scrollArea:
      "mx-auto mt-4 flex w-fit max-w-full justify-center overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-8 sm:px-4",
    grid: "mx-auto flex w-max min-w-max justify-center gap-3 sm:gap-5 md:gap-6",
    button:
      "flex w-[64px] shrink-0 cursor-pointer flex-col items-center gap-1.5 text-center sm:w-[76px] md:w-[82px]",
    iconWrapper:
      "flex h-8 w-8 items-center justify-center text-[#8b8b8b] sm:h-10 sm:w-10",
    image: "h-4.5 w-4.5 object-contain opacity-90 sm:h-6 sm:w-6",
    fallbackIcon: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1eb] text-[#CF3A00] shadow-sm sm:h-7 sm:w-7">
        <FiMoreHorizontal className="text-[14px] sm:text-[15px]" />
      </span>
    ),
    label: "text-[12px] font-semibold leading-snug text-[#332b25] sm:text-[13px] md:text-[14px]",
    panel:
      "absolute left-1/2 top-[calc(100%+12px)] z-50 w-[calc(100%-8px)] max-w-[920px] -translate-x-1/2 rounded-xl border border-[#dcdcdc] bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:w-[92%] sm:p-4",
    panelPointer:
      "absolute -top-[7px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-[#dcdcdc] bg-white sm:right-8",
    panelGrid: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
    optionButton:
      "rounded-full cursor-pointer border border-[#bbbbbb] px-3 py-2 text-center text-xs text-[#333] transition hover:bg-[#f7f2ec] sm:text-sm",
    clearButton:
      "rounded-md cursor-pointer border border-[#bcbcbc] px-3 py-2 text-xs text-[#333] sm:text-sm",
    applyButton:
      "rounded-md cursor-pointer bg-[#CF3A00] px-3 py-2 text-xs text-white sm:text-sm",
  },
};

export default function BrowseCategoryStrip({
  activeCategory,
  categories = [],
  moreOptions = [],
  onCategoryChange,
  variant = "default",
  isOpen,
  onOpenChange,
}) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedMoreOptions, setSelectedMoreOptions] = useState([]);

  const styles = useMemo(
    () => CATEGORY_STRIP_VARIANTS[variant] ?? CATEGORY_STRIP_VARIANTS.default,
    [variant],
  );

  const showMorePanel = isOpen ?? internalOpen;
  const panelId = useId();
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!showMorePanel) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [showMorePanel]);
  const shouldScroll = categories.length > 6;

  const getItemLabel = (item) =>
    typeof item === "string" ? item : item?.name ?? "";

  const getItemValue = (item) =>
    typeof item === "string"
      ? item
      : item?.value ?? item?.slug ?? item?.name ?? "";

  const isMoreItem = (item) => getItemValue(item) === "__more__" || getItemValue(item) === "More";
  const panelOptions = [...new Map([...categories.filter((item) => !isMoreItem(item)), ...moreOptions].map((item) => [getItemValue(item), item])).values()];
  const activeValues = Array.isArray(activeCategory) ? activeCategory : [activeCategory];
  const hasActiveExtraCategory = moreOptions.some((item) => activeValues.includes(getItemValue(item)));

  const renderIcon = (item) => {
    if (typeof item.icon === "string") {
      return (
        <img
          src={item.icon}
          alt={getItemLabel(item)}
          className={styles.image}
        />
      );
    }

    if (item.icon) {
      const Icon = item.icon;
      return <Icon className={styles.image} aria-hidden="true" />;
    }

    return styles.fallbackIcon;
  };

  const setPanelOpen = (nextOpen) => {
    if (isOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleCategoryClick = (item) => {
    const itemValue = getItemValue(item);

    if (isMoreItem(item)) {
      if (!showMorePanel) setSelectedMoreOptions(activeValues.filter(Boolean));
      setPanelOpen(!showMorePanel);
      return;
    }

    const nextCategory = toggleCategorySelection(activeCategory, itemValue);

    onCategoryChange?.(nextCategory);
    setPanelOpen(false);
  };

  const toggleMoreOption = (option) => {
    const optionValue = getItemValue(option);

    setSelectedMoreOptions((current) =>
      current.includes(optionValue) ? current.filter(value => value !== optionValue) : [...current, optionValue],
    );
  };

  const clearFilters = () => {
    setSelectedMoreOptions([]);
    onCategoryChange?.(null);
    setPanelOpen(false);
  };

  const applyFilters = () => {
    onCategoryChange?.(selectedMoreOptions.length ? selectedMoreOptions : null);
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
            const itemLabel = getItemLabel(item);
            const itemValue = getItemValue(item);
            const isMore = isMoreItem(item);
            const isMoreActive =
              isMore && (showMorePanel || hasActiveExtraCategory);
            const isActiveCategory =
              !isMore &&
              (Array.isArray(activeCategory)
                ? activeCategory.includes(itemValue)
                : activeCategory === itemValue);

            return (
              <button
                key={itemValue || itemLabel}
                type="button"
                aria-expanded={isMore ? showMorePanel : undefined}
                aria-controls={isMore ? panelId : undefined}
                aria-pressed={isMore ? undefined : isActiveCategory}
                onClick={() => handleCategoryClick(item)}
                className={`${styles.button} rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-[#cf6e38] focus-visible:ring-offset-4 ${
                  isMoreActive || isActiveCategory ? "text-[#CF3A00]" : ""
                }`}
              >
                <span
                  className={`${styles.iconWrapper} ${
                    isMoreActive || isActiveCategory
                      ? "border border-[#CF3A00] bg-[#fff1eb] text-[#CF3A00]"
                      : ""
                  }`}
                >
                  {renderIcon(item)}
                </span>

                <span
                  className={`${styles.label} ${
                    isMoreActive || isActiveCategory ? "text-[#CF3A00]" : ""
                  }`}
                >
                  {itemLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showMorePanel && (
        <dialog ref={dialogRef} id={panelId} aria-labelledby={panelId + "-title"} className="fixed inset-0 m-auto flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-[780px] flex-col overflow-hidden rounded-[22px] border border-[#eadfd7] bg-white p-0 text-[#29211d] shadow-[0_24px_80px_rgba(35,22,15,0.24)] backdrop:bg-[#241b16]/40 backdrop:backdrop-blur-[3px]" onCancel={() => setPanelOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setPanelOpen(false); } }}>
          <div className="flex shrink-0 items-center gap-3 border-b border-[#f0e9e3] px-4 py-4 sm:px-6 sm:py-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#fff1e8] text-[#c65e30]"><FiGrid size={18} /></span>
            <div className="min-w-0 flex-1">
              <h3 id={panelId + "-title"} className="text-[16px] font-semibold text-[#29211d]">{t("browse.categoryPickerTitle")}</h3>
              <p className="mt-1 text-xs leading-5 text-[#89796e]">{t("browse.categoryPickerHint")}</p>
            </div>
            <button type="button" aria-label={t("common.close")} onClick={() => setPanelOpen(false)} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f7f4f1] text-[#76675d] transition hover:bg-[#eee6df] focus-visible:outline-2 focus-visible:outline-[#cf6e38]"><FiX size={18} /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 py-4 sm:px-6 sm:py-5">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {panelOptions.map((option) => {
                const optionValue = getItemValue(option);
                const optionLabel = getItemLabel(option);
                const isSelected = selectedMoreOptions.includes(optionValue);
                return (
                  <button key={optionValue} type="button" aria-pressed={isSelected} onClick={() => toggleMoreOption(option)} className={"flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-left text-[13px] leading-5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cf6e38] " + (isSelected ? "border-[#cf6e38] bg-[#fff3eb] font-semibold text-[#b55028] shadow-[0_0_0_1px_rgba(207,110,56,0.1)]" : "border-[#ece5df] bg-white text-[#5d5149] hover:border-[#dfb89e] hover:bg-[#fcf8f5]")}>
                    <span className="min-w-0 flex-1 break-words">{optionLabel}</span>
                    <span className={"flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border " + (isSelected ? "border-[#cf6e38] bg-[#cf6e38] text-white" : "border-[#ded5cd] bg-white")} aria-hidden="true">{isSelected && <FiCheck size={12} />}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#eee6df] bg-[#fcfaf8] px-4 py-3 sm:px-6 sm:py-4">
            <button type="button" onClick={clearFilters} className="min-h-11 cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#827267] transition hover:bg-[#f1eae4] focus-visible:outline-2 focus-visible:outline-[#cf6e38]">{t("browse.clearFilter")}</button>
            <button type="button" onClick={applyFilters} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#c65e30] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(198,94,48,0.17)] transition hover:bg-[#ad4e26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cf6e38]">{t("browse.apply")}<FiCheck size={15} /></button>
          </div>
        </dialog>
      )}
    </div>
  );
}
