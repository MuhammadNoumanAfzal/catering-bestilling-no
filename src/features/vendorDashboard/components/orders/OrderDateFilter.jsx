import { FiChevronDown, FiClock } from "react-icons/fi";
import { getDateFilterLabel, ORDER_DATE_OPTIONS } from "./orderUtils";

export default function OrderDateFilter({
  isOpen,
  menuRef,
  onSelect,
  onToggle,
  referenceDate,
  selectedRange,
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ded6ce] bg-[#fff7f3] px-4 py-2.5 text-sm font-semibold text-[#cf5c2f] transition hover:bg-[#fff0e8]"
      >
        <FiClock className="text-[14px]" />
        <span className="type-subpara font-semibold">
          {getDateFilterLabel(selectedRange, referenceDate)}
        </span>
        <FiChevronDown
          className={["text-[15px] transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[190px] rounded-[10px] border border-[#e5ddd5] bg-white p-1.5 shadow-[0_18px_40px_rgba(31,24,19,0.12)]">
          {ORDER_DATE_OPTIONS.map((option) => {
            const isSelected = option.value === selectedRange;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={[
                  "type-subpara flex w-full cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 text-left transition",
                  isSelected
                    ? "bg-[#fff1e8] text-[#c85f33]"
                    : "text-[#4d4d4d] hover:bg-[#faf7f3]",
                ].join(" ")}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <span className="text-[10px] font-semibold uppercase">Active</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
