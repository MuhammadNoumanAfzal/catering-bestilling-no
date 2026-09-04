import PreferredTimePicker from "../../../components/shared/PreferredTimePicker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTodayDateValue } from "../../order/utils/orderFlowValidation";
import { formatTimeTo24Hour } from "../../../components/shared/navbar/navbarDateUtils";
import { getConfiguredDeliverySlotsForDate } from "../../vendor/services/vendorAvailability";

function getSlotStatusTone(slot) {
  if (slot.isFullyBooked) {
    return "bg-[#f0e8e4] text-[#b08a7a]";
  }

  if (slot.remainingCapacity >= 9999) {
    return "bg-[#eaf5ee] text-[#2f8a4b]";
  }

  if (slot.remainingCapacity <= 3) {
    return "bg-[#fff0e5] text-[#cf6e38]";
  }

  return "bg-[#eef6ef] text-[#2f8a4b]";
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateValue) {
  if (!dateValue) {
    return "Choose an available date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}

export default function MenuDeliveryForm({
  minimumPersons = 1,
  vendor,
  isVendorAvailable = true,
  orderSummary,
  vendorNote,
  deliverySlots = [],
  isLoadingSlots = false,
  hasDeliverySchedule = false,
  slotAccessRequiresAuth = false,
  slotAccessMessage = "",
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onVendorNoteChange,
  onAddToCart,
}) {
  const { t } = useTranslation();
  const [dateAvailabilityError, setDateAvailabilityError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const selected = orderSummary.deliveryDate
      ? new Date(`${orderSummary.deliveryDate}T00:00:00`)
      : new Date();
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const hasSlots = deliverySlots.length > 0;
  const selectedTime = orderSummary.deliveryTime || "";
  const firstAvailableSlot = deliverySlots.find((slot) => !slot.isFullyBooked) || null;

  function isTimeInSlot(time, slot) {
    return time >= slot.start && time <= slot.end;
  }

  function getMatchingSlot(time) {
    return deliverySlots.find(
      (slot) => !slot.isFullyBooked && isTimeInSlot(time, slot),
    ) || null;
  }

  function handleSelectSlot(slot) {
    if (slot.isFullyBooked) {
      return;
    }

    onDeliveryTimeChange(slot.start);
  }

  function getCapacityLabel(slot) {
    if (slot.isFullyBooked) {
      return t("menu.fullyBooked");
    }

    if (slot.remainingCapacity >= 9999) {
      return t("menu.available");
    }

    return t("menu.spotsLeft", { count: slot.remainingCapacity });
  }

  const selectedSlot = getMatchingSlot(selectedTime);
  const editableSlot = selectedSlot || firstAvailableSlot;
  const availabilityHint = editableSlot
    ? t("menu.availabilityHint", {
      start: editableSlot.start,
      end: editableSlot.end,
    })
    : "";

  function handleExactTimeChange(nextTime) {
    if (!editableSlot) {
      onDeliveryTimeChange(nextTime);
      return;
    }

    if (nextTime >= editableSlot.start && nextTime <= editableSlot.end) {
      onDeliveryTimeChange(nextTime);
    }
  }

  function handleDeliveryDateSelect(nextDate) {
    if (hasDeliverySchedule && getConfiguredDeliverySlotsForDate(vendor, nextDate).length === 0) {
      setDateAvailabilityError("Delivery is not available on this date. Please choose a day in the vendor's delivery schedule.");
      return;
    }

    setDateAvailabilityError("");
    onDeliveryDateChange(nextDate);
    setIsCalendarOpen(false);
  }

  const calendarDays = Array.from(
    { length: 42 },
    (_, index) => {
      const firstWeekday = calendarMonth.getDay();
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - firstWeekday + 1);
      const value = formatDateValue(date);
      const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
      const isAvailable =
        isCurrentMonth &&
        value >= getTodayDateValue() &&
        (!hasDeliverySchedule || getConfiguredDeliverySlotsForDate(vendor, value).length > 0);

      return { date, value, isCurrentMonth, isAvailable };
    },
  );

  return (
    <div className="mt-4 overflow-hidden rounded-[22px] border border-[#eadfd5] bg-white shadow-[0_12px_28px_rgba(55,34,19,0.04)]">
      <div className="border-b border-[#efe4da] bg-[linear-gradient(135deg,#fffdfb_0%,#fff5ed_100%)] px-3 py-3 sm:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b37a59]">
          {t("menu.bookingSetup")}
        </p>
        <h2 className="mt-1 text-[19px] font-semibold text-[#1c1713]">
          {t("menu.deliveryDateTime")}
        </h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#6b5d53]">
          {t("menu.bookingIntro")}
        </p>
      </div>

      <div className="p-3 sm:p-4">

      <div className="rounded-[18px] border border-[#efe5dc] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f2_100%)] p-2.5 sm:p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[320px_minmax(0,1fr)]">
        <label className="block min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f6850]">{t("menu.date")}</span>
          <div className="relative mt-1">
            <button
              aria-expanded={isCalendarOpen}
              className="flex min-h-[50px] w-full items-center justify-between gap-2.5 rounded-[15px] border border-[#d7cdc4] bg-white px-3 py-2 text-left text-[14px] text-[#1d1713] outline-none transition hover:border-[#cf6e38] hover:shadow-[0_10px_20px_rgba(207,110,56,0.07)]"
              onClick={() => setIsCalendarOpen((current) => !current)}
              type="button"
            >
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {formatDateLabel(orderSummary.deliveryDate)}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff3ea] text-[14px] text-[#cf6e38]">
                &#128197;
              </span>
            </button>
            {isCalendarOpen ? (
              <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[320px] rounded-[16px] border border-[#dfd4cb] bg-white p-3 shadow-[0_18px_38px_rgba(55,34,19,0.18)]">
                <div className="mb-3 flex items-center justify-between">
                  <button className="rounded-full px-2 py-1 text-[18px] text-[#6f6056] hover:bg-[#faf4ef]" onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} type="button">&#8249;</button>
                  <strong className="text-[14px] text-[#2b231e]">{calendarMonth.toLocaleString("en-GB", { month: "long", year: "numeric" })}</strong>
                  <button className="rounded-full px-2 py-1 text-[18px] text-[#6f6056] hover:bg-[#faf4ef]" onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} type="button">&#8250;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#8c7a6e]">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {calendarDays.map(({ date, value, isCurrentMonth, isAvailable }) => {
                    const isSelected = value === orderSummary.deliveryDate;
                    return <button key={value} disabled={!isAvailable} onClick={() => handleDeliveryDateSelect(value)} type="button" className={`h-9 rounded-[8px] text-[12px] font-semibold transition ${isSelected ? "bg-[#cf6e38] text-white" : isAvailable ? "cursor-pointer text-[#2b231e] hover:bg-[#fff0e8] hover:text-[#cf6e38]" : "cursor-not-allowed text-[#c9beb5] line-through"} ${!isCurrentMonth ? "opacity-40" : ""}`}>{date.getDate()}</button>;
                  })}
                </div>
                <p className="mt-3 border-t border-[#efe4dc] pt-2 text-[11px] leading-4 text-[#8a7161]">Only highlighted dates have delivery availability.</p>
              </div>
            ) : null}
            {dateAvailabilityError ? (
              <p className="mt-2 text-[12px] font-medium leading-5 text-[#b34d22]">
                {dateAvailabilityError}
              </p>
            ) : null}
          </div>
        </label>

        <label className="block min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f6850]">{t("menu.time")}</span>
          <div className="mt-1">
            {!orderSummary.deliveryDate ? (
              <p className="flex min-h-[50px] min-w-0 items-center rounded-[15px] border border-[#e3d8ce] bg-white px-3 py-2 text-[12px] text-[#9b8f84]">
                {t("menu.selectDateFirst")}
              </p>
            ) : isLoadingSlots ? (
              <div className="flex min-h-[50px] min-w-0 items-center gap-2 rounded-[15px] border border-[#e3d8ce] bg-white px-3 py-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#cf6e38]/30 border-t-[#cf6e38]" />
                <span className="text-[12px] text-[#9b8f84]">{t("menu.checkingSlots")}</span>
              </div>
            ) : slotAccessRequiresAuth ? (
              <p className="flex min-h-[50px] items-center rounded-[15px] border border-[#ead8ca] bg-[#fff7f1] px-3 py-2 text-[12px] text-[#8a5a3a]">
                {slotAccessMessage || t("menu.signInForSlots")}
              </p>
            ) : hasSlots ? (
              <div className="flex flex-col gap-3">
                <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-3.5 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9a6a4d]">
                        {t("menu.stepOne")}
                      </p>
                      <p className="mt-1 text-[14px] font-semibold text-[#1d1713]">
                        {t("menu.chooseWindow")}
                      </p>
                    </div>
                    {selectedSlot ? (
                      <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                        {t("menu.selectedWindow", { label: selectedSlot.label })}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
                    {deliverySlots.map((slot) => {
                      const isSelected = isTimeInSlot(selectedTime, slot);

                      return (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          disabled={slot.isFullyBooked}
                          onClick={() => handleSelectSlot(slot)}
                          className={`rounded-[16px] border p-3 text-left transition ${
                            slot.isFullyBooked
                              ? "cursor-not-allowed border-[#e4ddd7] bg-[#f5f2ef] text-[#b0a49a]"
                              : isSelected
                                ? "border-[#cf6e38] bg-[#fff4ed] text-[#cf6e38] shadow-[0_10px_24px_rgba(207,110,56,0.12)] ring-1 ring-[#cf6e38]/20"
                                : "cursor-pointer border-[#d9d1c7] bg-white text-[#2d2d2d] hover:border-[#cf6e38]/45 hover:bg-[#fdf8f4]"
                          }`}
                        >
                          <div className="flex min-w-0 flex-col items-start gap-3">
                            <div className="min-w-0">
                              <p className="text-[15px] font-semibold leading-6 break-words">
                                {slot.label}
                              </p>
                              <p className="mt-1 text-[12px] leading-5 text-[#8a7b70]">
                                {t("menu.tapWindow")}
                              </p>
                            </div>
                            <span
                              className={`inline-flex w-fit max-w-full shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                getSlotStatusTone(slot)
                              }`}
                            >
                              {getCapacityLabel(slot)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {editableSlot ? (
                  <div className="rounded-[20px] border border-[#ead8ca] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9a6a4d]">
                          {t("menu.stepTwo")}
                        </p>
                        <p className="mt-1 text-[15px] font-semibold text-[#1d1713]">
                          {t("menu.fineTuneTime")}
                        </p>
                        <p className="mt-1 text-[12px] leading-5 text-[#8a5a3a]">
                          {t("menu.timeBetween", {
                            start: editableSlot.start,
                            end: editableSlot.end,
                          })}
                        </p>
                      </div>
                      <div className="rounded-[14px] border border-[#efd8ca] bg-white px-3 py-2 text-right shadow-[0_8px_16px_rgba(55,34,19,0.04)]">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#a19084]">
                          {t("menu.currentTime")}
                        </p>
                        <p className="mt-1 text-[15px] font-semibold text-[#cf6e38]">
                          {selectedTime ? formatTimeTo24Hour(selectedTime) : t("menu.notSelected")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 max-w-[320px]">
                      <PreferredTimePicker
                        value={selectedTime}
                        onChange={handleExactTimeChange}
                        selectedDate={orderSummary.deliveryDate}
                        minTimeValue={editableSlot.start}
                        maxTimeValue={editableSlot.end}
                        placeholder={t("timePicker.placeholder")}
                      />
                    </div>
                    <p className="mt-3 text-[12px] leading-5 text-[#8a5a3a]">
                      {availabilityHint}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : hasDeliverySchedule ? (
              <p className="rounded-[14px] border border-[#ead8ca] bg-[#fff7f1] px-3 py-3 text-[13px] text-[#8a5a3a]">
                {t("menu.noSlotsForDate")}
              </p>
            ) : (
              <PreferredTimePicker
                value={orderSummary.deliveryTime}
                onChange={onDeliveryTimeChange}
                selectedDate={orderSummary.deliveryDate}
                placeholder={t("nav.selectPreferredTime")}
              />
            )}
          </div>
        </label>
      </div>
      </div>

      <div className="mt-3 rounded-[16px] border border-[#efe4da] bg-[#fffdfa] p-2.5">
        <h3 className="text-[15px] font-semibold text-[#1c1713]">
          {t("menu.eventDetails")}
        </h3>
        <p className="mt-0.5 text-[11px] leading-4 text-[#6b5d53]">
          {t("menu.guestCountIntro")}
        </p>

        <div className="mt-1.5 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center">
          <span className="text-[12px] text-[#1d1713]">{t("menu.personsLabel")}</span>
          <select
            value={orderSummary.personCount}
            onChange={(event) => onPersonCountChange(Number(event.target.value))}
            className="cursor-pointer rounded-[9px] border border-[#d7cdc4] bg-white px-2 py-1 text-[12px] font-medium text-[#1d1713] outline-none transition focus:border-[#cf6e38]"
          >
            {Array.from(
              { length: Math.max(50, minimumPersons) - minimumPersons + 1 },
              (_, index) => minimumPersons + index,
            ).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#7e7469]">
            {t("menu.minimumLabel", { count: minimumPersons })}
          </span>
        </div>

      </div>

      <div className="mt-4 border-t border-[#ece4dc] pt-3">
        <p className="text-[14px] font-semibold text-[#1d1713]">{t("menu.addVendorNote")}</p>
        <p className="mt-0.5 text-[12px] leading-4 text-[#7e7469]">
          {t("menu.addVendorNoteDesc")}
        </p>
        <textarea
          value={vendorNote}
          onChange={(event) => onVendorNoteChange(event.target.value)}
          placeholder={t("menu.addNotePlaceholder")}
          className="mt-2 h-20 w-full rounded-[14px] border border-[#d7cdc4] bg-[#fffdfa] px-3 py-2 text-[13px] text-[#3f342b] outline-none transition focus:border-[#cf6e38]"
        />
      </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={!isVendorAvailable}
          className={`mt-4 block w-full rounded-[14px] px-4 py-2.5 text-center text-[14px] font-semibold text-white shadow-[0_12px_24px_rgba(207,110,56,0.16)] transition ${
            isVendorAvailable
              ? "cursor-pointer bg-[#cf6e38] hover:bg-[#bb602d]"
              : "cursor-not-allowed bg-[#d7c5b9] shadow-none"
          }`}
        >
          {t("menu.addToCart")}
        </button>
      </div>
    </div>
  );
}
