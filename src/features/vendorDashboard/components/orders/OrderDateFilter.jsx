import { FiChevronDown, FiClock } from "react-icons/fi";
import { getDateFilterLabel, ORDER_DATE_OPTIONS } from "./orderUtils";

export default function OrderDateFilter({
  customDateRange,
  isOpen,
  menuRef,
  onSelect,
  onCustomDateChange,
  onApplyCustomDate,
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
          {getDateFilterLabel(selectedRange, referenceDate, customDateRange)}
        </span>
        <FiChevronDown
          className={["text-[15px] transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[280px] rounded-[20px] border border-[#ead8cb] bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-2.5 shadow-[0_22px_50px_rgba(31,24,19,0.16)]">
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

          {selectedRange === "custom-date" ? (
            <div className="mt-2 rounded-[18px] border border-[#f0ded2] bg-[linear-gradient(180deg,#fff7f2_0%,#fffaf7_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <div className="mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c06c42]">
                  Custom Range
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#8b7667]">
                  Choose a start and end date to filter the orders list.
                </p>
              </div>

              <div className="grid gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a6d53]">
                    From
                  </span>
                  <input
                    type="date"
                    value={customDateRange.from}
                    max={customDateRange.to || undefined}
                    onChange={(event) =>
                      onCustomDateChange("from", event.target.value)
                    }
                    className="w-full rounded-[14px] border border-[#e8d6c8] bg-white px-3 py-2.5 text-sm text-[#2d2d2d] outline-none transition focus:border-[#cf6e38] focus:ring-2 focus:ring-[#ffd8c6]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a6d53]">
                    To
                  </span>
                  <input
                    type="date"
                    value={customDateRange.to}
                    min={customDateRange.from || undefined}
                    onChange={(event) =>
                      onCustomDateChange("to", event.target.value)
                    }
                    className="w-full rounded-[14px] border border-[#e8d6c8] bg-white px-3 py-2.5 text-sm text-[#2d2d2d] outline-none transition focus:border-[#cf6e38] focus:ring-2 focus:ring-[#ffd8c6]"
                  />
                </label>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={onApplyCustomDate}
                  className="inline-flex items-center justify-center rounded-full bg-[#cf6e38] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(207,110,56,0.24)] transition hover:bg-[#bc602d]"
                >
                  Apply
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
