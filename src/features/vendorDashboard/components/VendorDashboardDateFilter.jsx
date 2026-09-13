import { useEffect, useRef } from "react";
import { FiCalendar, FiCheck, FiChevronDown } from "react-icons/fi";

export const DASHBOARD_DATE_FILTER_OPTIONS = [
  { label: "All time", value: "all-time" },
  { label: "Last 7 days", value: "last-7-days" },
  { label: "Last Month", value: "last-month" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "Last 6 Months", value: "last-6-months" },
  { label: "This Year", value: "this-year" },
  { label: "Custom Date", value: "custom-date" },
];

export function getDashboardDateFilterLabel(selectedRange, customDateRange = {}) {
  if (selectedRange === "custom-date" && customDateRange.from && customDateRange.to) {
    return `${customDateRange.from} - ${customDateRange.to}`;
  }

  return (
    DASHBOARD_DATE_FILTER_OPTIONS.find((option) => option.value === selectedRange)
      ?.label ?? "Last 7 days"
  );
}

export default function VendorDashboardDateFilter({
  customDateRange,
  isOpen,
  onApplyCustomDate,
  onCustomDateChange,
  onReset,
  onSelect,
  onToggle,
  selectedRange,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => onToggle()}
        className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[#decfc3] bg-white px-4 py-2.5 text-sm font-medium text-[#201b17] shadow-[0_10px_24px_rgba(31,24,19,0.08)] transition hover:border-[#d66a38] hover:bg-[#fffaf6]"
      >
        <FiCalendar className="text-[15px] text-[#d65f2f]" />
        <span>{getDashboardDateFilterLabel(selectedRange, customDateRange)}</span>
        <FiChevronDown
          className={["text-[15px] text-[#7b6f66] transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[255px] rounded-[16px] border border-[#eadbd0] bg-white p-2 shadow-[0_24px_55px_rgba(31,24,19,0.18)]">
          <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9b8a7c]">
            <FiCalendar className="text-[13px] text-[#d65f2f]" />
            <span>Filter by date</span>
          </div>

          <div className="mt-1 space-y-1">
            {DASHBOARD_DATE_FILTER_OPTIONS.map((option) => {
              const isSelected = option.value === selectedRange;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelect(option.value)}
                  className={[
                    "flex w-full cursor-pointer items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-sm transition",
                    isSelected
                      ? "bg-[#fff1e8] text-[#d65f2f]"
                      : "text-[#5c5149] hover:bg-[#faf6f2]",
                  ].join(" ")}
                >
                  <span>{option.label}</span>
                  {isSelected ? <FiCheck className="text-[14px]" /> : null}
                </button>
              );
            })}
          </div>

          {selectedRange === "custom-date" ? (
            <div className="mt-2 grid gap-2 border-t border-[#f0e4da] pt-3">
              <input
                type="date"
                value={customDateRange.from}
                max={customDateRange.to || undefined}
                onChange={(event) => onCustomDateChange("from", event.target.value)}
                className="min-h-10 rounded-[10px] border border-[#e3d5ca] px-3 text-sm text-[#2d2925] outline-none focus:border-[#d65f2f] focus:ring-2 focus:ring-[#ffd8c6]"
              />
              <input
                type="date"
                value={customDateRange.to}
                min={customDateRange.from || undefined}
                onChange={(event) => onCustomDateChange("to", event.target.value)}
                className="min-h-10 rounded-[10px] border border-[#e3d5ca] px-3 text-sm text-[#2d2925] outline-none focus:border-[#d65f2f] focus:ring-2 focus:ring-[#ffd8c6]"
              />
              <button
                type="button"
                onClick={onApplyCustomDate}
                className="min-h-10 cursor-pointer rounded-[10px] bg-[#d65f2f] px-3 text-sm font-semibold text-white transition hover:bg-[#bf5328]"
              >
                Apply
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onReset}
            className="mt-2 flex w-full cursor-pointer items-center rounded-[9px] border-t border-[#f0e4da] px-3 py-2.5 text-left text-sm font-medium text-[#d65f2f] transition hover:bg-[#fff6ef]"
          >
            Clear Filter
          </button>
        </div>
      ) : null}
    </div>
  );
}