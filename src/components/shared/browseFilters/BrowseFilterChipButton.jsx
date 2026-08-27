import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";
import { DROPDOWN_CHIP_KEYS, translateBrowseChipLabel } from "./browseFilterConfig";

const FILTER_CHIP_IMAGE_MAP = {
  sort: "/home/breakfast.svg",
  rating: "/home/salad.svg",
  dietary: "/home/salad.svg",
  offer: "/home/meetingPackages.svg",
  pricing: "/home/hotMeal.svg",
  other: "/home/pizza.svg",
};

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
            ? "border-[#cf6e38] bg-[linear-gradient(135deg,#cf6e38_0%,#e48754_100%)] text-white shadow-[0_14px_30px_rgba(207,110,56,0.22)]"
            : styles.inactiveChipClassName
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border ${
            isActive
              ? "border-white/35 bg-white/18"
              : "border-[#f2d9c9] bg-[#fff3ea]"
          }`}
        >
          <img
            src={FILTER_CHIP_IMAGE_MAP[chip.key]}
            alt=""
            aria-hidden="true"
            className="h-4.5 w-4.5 object-contain sm:h-5 sm:w-5"
          />
        </span>

        <span className="min-w-0 flex-1 truncate text-left">
          {translateBrowseChipLabel(t, chip.key)}
        </span>

        {isDropdownChip ? (
          <FiChevronDown
            className={`shrink-0 text-[16px] transition ${
              isActive ? "text-white" : "text-[#b7774f]"
            }`}
          />
        ) : null}
      </button>

      {children}
    </div>
  );
}
