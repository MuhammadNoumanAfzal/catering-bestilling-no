import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
  getMonthDays,
  getTodayStart,
  isPastDate,
  isSameDay,
  weekdayLabels,
} from "./navbarDateUtils";
import PreferredTimePicker from "../PreferredTimePicker";

export default function DeliveryDatePopover({
  calendarMonth,
  draftDate,
  draftTime,
  onApply,
  onClear,
  onDateSelect,
  onMonthChange,
  onTimeSelect,
}) {
  const { t, i18n } = useTranslation();
  const calendarDays = getMonthDays(calendarMonth);
  const displayedMonth = calendarMonth.toLocaleDateString(
    i18n.language === "no" ? "nb-NO" : "en-US",
    {
    month: "long",
    year: "numeric",
    },
  );
  const today = getTodayStart();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const calendarMonthStart = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1,
  );
  const previousMonthDisabled = calendarMonthStart <= currentMonthStart;

  return (
    <div className="absolute left-[108px] top-[calc(100%+10px)] z-50 max-h-[calc(100vh-96px)] w-[330px] overflow-y-auto rounded-[22px] border border-[#e6ded4] bg-white p-4 shadow-[0_18px_60px_rgba(26,18,9,0.18)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-l border-t border-[#e6ded4] bg-white" />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold ">{t("nav.deliveryDate")}</p>
        </div>
        {draftDate || draftTime ? (
          <button
            type="button"
            onClick={onClear}
            className="text-[13px] font-semibold text-[#c85f33] transition hover:text-[#a94b24]"
          >
            {t("nav.clear")}
          </button>
        ) : null}
      </div>

      <div className="rounded-[16px] border border-[#d9d2c9] p-3">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-black"
          >
            <span>{displayedMonth}</span>
            <FiChevronDown className="text-[12px] text-black" />
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (!previousMonthDisabled) {
                  onMonthChange(-1);
                }
              }}
              disabled={previousMonthDisabled}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black transition hover:bg-[#f4efe9] disabled:cursor-not-allowed disabled:text-[#d2c8be] disabled:hover:bg-transparent"
              aria-label={t("nav.previousMonth")}
            >
              <FiArrowLeft className="text-[14px]" />
            </button>
            <button
              type="button"
              onClick={() => onMonthChange(1)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-black transition hover:bg-[#f4efe9]"
              aria-label={t("nav.nextMonth")}
            >
              <FiArrowRight className="text-[14px]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="text-[11px] font-medium text-[#9a9186]"
            >
              {label}
            </span>
          ))}

          {calendarDays.map((date, index) =>
            date ? (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => {
                  if (!isPastDate(date)) {
                    onDateSelect(isSameDay(date, draftDate) ? null : date);
                  }
                }}
                disabled={isPastDate(date)}
                className={`mx-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] transition ${
                  isSameDay(date, draftDate)
                    ? "bg-[#d56d41] font-semibold text-white"
                    : isPastDate(date)
                      ? "cursor-not-allowed text-[#d8cec4]"
                      : isSameDay(date, today)
                        ? "font-semibold text-[#c85f33] hover:bg-[#fff1e8]"
                        : "cursor-pointer text-[#2b2b2b] hover:bg-[#f4efe9]"
                }`}
              >
                {date.getDate()}
              </button>
            ) : (
              <span key={`blank-${index}`} className="h-7 w-7" />
            ),
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="type-h4 font-semibold ">{t("nav.deliveryTime")}</p>
            <p className="type-subpara mt-3 max-w-[250px] leading-5 text-[#7e7469]">
              {t("nav.deliveryTimeHint")}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e4d9cf] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <PreferredTimePicker
            value={draftTime}
            onChange={onTimeSelect}
            selectedDate={draftDate}
            placeholder={t("nav.selectPreferredTime")}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-4 w-full cursor-pointer rounded-[10px] bg-[#c85f33] px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-[#b6542c]"
      >
        {t("nav.updateResults")}
      </button>
    </div>
  );
}
