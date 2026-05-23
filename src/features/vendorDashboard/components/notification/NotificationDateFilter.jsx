import { FiChevronDown } from "react-icons/fi";
import {
  getNotificationDateFilterLabel,
  NOTIFICATION_DATE_OPTIONS,
} from "./notificationUtils";

export default function NotificationDateFilter({
  customDateRange,
  isOpen,
  menuRef,
  onApplyCustomDate,
  onCustomDateChange,
  onSelect,
  onToggle,
  selectedRange,
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex w-full items-center justify-between gap-2 rounded-full border border-[#ead8cb] bg-[#fff7f3] px-4 py-2.5 text-sm font-semibold text-[#cf5c2f] transition hover:bg-[#fff0e8] sm:w-auto"
      >
        <span className="truncate">
          {getNotificationDateFilterLabel(selectedRange, customDateRange)}
        </span>
        <FiChevronDown
          className={["text-[15px] transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[290px] rounded-[18px] border border-[#ead8cb] bg-white p-2 shadow-[0_18px_40px_rgba(31,24,19,0.12)]">
          {NOTIFICATION_DATE_OPTIONS.map((option) => {
            const isSelected = option.value === selectedRange;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={[
                  "flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm transition",
                  isSelected
                    ? "bg-[#fff1e8] font-semibold text-[#c85f33]"
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
            <div className="mt-2 rounded-[14px] border border-[#f0ded2] bg-[#fff7f2] p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9a6d53]">
                    From
                  </span>
                  <input
                    type="date"
                    value={customDateRange.from}
                    max={customDateRange.to || undefined}
                    onChange={(event) =>
                      onCustomDateChange("from", event.target.value)
                    }
                    className="w-full rounded-[12px] border border-[#e8d6c8] bg-white px-3 py-2 text-sm text-[#2d2d2d] outline-none transition focus:border-[#cf6e38]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9a6d53]">
                    To
                  </span>
                  <input
                    type="date"
                    value={customDateRange.to}
                    min={customDateRange.from || undefined}
                    onChange={(event) =>
                      onCustomDateChange("to", event.target.value)
                    }
                    className="w-full rounded-[12px] border border-[#e8d6c8] bg-white px-3 py-2 text-sm text-[#2d2d2d] outline-none transition focus:border-[#cf6e38]"
                  />
                </label>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={onApplyCustomDate}
                  className="rounded-full bg-[#cf6e38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bc602d]"
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
