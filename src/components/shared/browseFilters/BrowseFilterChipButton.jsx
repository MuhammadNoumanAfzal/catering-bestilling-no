import { useTranslation } from "react-i18next";
import { FiChevronDown, FiStar } from "react-icons/fi";
import { DROPDOWN_CHIP_KEYS, translateBrowseChipLabel } from "./browseFilterConfig";

export default function BrowseFilterChipButton({
  chip,
  isActive,
  onClick,
  styles,
  children,
}) {
  const { t } = useTranslation();
  const isDropdownChip = DROPDOWN_CHIP_KEYS.has(chip.key);

  return (
    <div className={styles.chipContainerClassName}>
      <button
        type="button"
        onClick={onClick}
        className={`${styles.chipButtonClassName} ${
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

        <span className="truncate">{translateBrowseChipLabel(t, chip.key)}</span>

        {isDropdownChip ? (
          <FiChevronDown className="shrink-0 text-[16px]" />
        ) : null}
      </button>

      {children}
    </div>
  );
}
