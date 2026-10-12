import CheckoutField from "./CheckoutField";
import CheckoutSection from "./CheckoutSection";
import { CHECKOUT_PLACEHOLDERS } from "../../constants/checkoutForm";
import { getTodayDateValue } from "../../../order/utils/orderFlowValidation";
import { formatTimeTo24Hour } from "../../../../components/shared/navbar/navbarDateUtils";
import PreferredTimePicker from "../../../../components/shared/PreferredTimePicker";
import LocalizedDatePicker from "../../../../components/LocalizedDatePicker";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function getSlotStatusTone(slot) {
  if (slot.isFullyBooked) return "bg-[#f0e8e4] text-[#b08a7a]";
  if (slot.remainingCapacity >= 9999) return "bg-[#eaf5ee] text-[#2f8a4b]";
  if (slot.remainingCapacity <= 3) return "bg-[#fff0e5] text-[#cf6e38]";
  return "bg-[#eef6ef] text-[#2f8a4b]";
}

export default function EventDetailsSection({
  mode,
  vendors = [],
  formState,
  updateField,
  updateCartField,
  onDateChange,
  deliverySlots = [],
  isLoadingSlots = false,
  minimumPersonCount = 1,
}) {
  const { t } = useTranslation();
  const minimumCount = Math.max(1, Number(minimumPersonCount) || 1);
  const personCount = Math.max(minimumCount, Number(formState.personCount) || minimumCount);
  const [personCountDraft, setPersonCountDraft] = useState(String(personCount));
  useEffect(() => {
    setPersonCountDraft(String(personCount));
  }, [personCount]);

  function commitPersonCount(value) {
    const parsed = Number.parseInt(value, 10);
    const nextCount = Number.isSafeInteger(parsed) ? Math.max(minimumCount, parsed) : minimumCount;
    setPersonCountDraft(String(nextCount));
    updateField("personCount", nextCount);
    updateCartField("personCount", nextCount);
  }
  const eventLabel =
    mode === "corporate" ? t("checkout.eventName") : t("checkout.occasion");
  const eventKey = mode === "corporate" ? "eventName" : "occasion";
  const eventPlaceholder =
    mode === "corporate"
      ? CHECKOUT_PLACEHOLDERS.eventName
      : CHECKOUT_PLACEHOLDERS.occasion;

  const adjustPersonCount = (delta) => {
    commitPersonCount(personCount + delta);
  };

  const hasSlots = deliverySlots.length > 0;
  const selectedTime = formState.time || "";
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
    if (slot.isFullyBooked) return;
    // Set time to the slot start
    updateField("time", slot.start);
    updateCartField("deliveryTime", slot.start);
  }

  function getCapacityLabel(slot) {
    if (slot.isFullyBooked) return t("menu.fullyBooked");
    if (slot.remainingCapacity >= 9999) return t("menu.available");
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
      updateField("time", nextTime);
      updateCartField("deliveryTime", nextTime);
      return;
    }

    if (nextTime >= editableSlot.start && nextTime <= editableSlot.end) {
      updateField("time", nextTime);
      updateCartField("deliveryTime", nextTime);
    }
  }

  return (
    <CheckoutSection title={t("menu.eventDetails")}>
      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_220px_180px]">
        <CheckoutField
          label={eventLabel}
          value={formState[eventKey]}
          onChange={(event) => updateField(eventKey, event.target.value)}
          placeholder={eventPlaceholder}
        optional={mode === "corporate"}
          optionalLabel={t("checkout.optional")}
        />
        <div data-checkout-field="date">
          <span className="mb-1.5 block text-[13px] font-medium text-[#2d2d2d]">
            {t("menu.date")}
          </span>
          <LocalizedDatePicker
            className="w-full"
            bookingVendors={vendors}
            label={t("menu.date")}
            min={getTodayDateValue()}
            onChange={(nextDate) => {
              if (onDateChange) {
                onDateChange(nextDate);
                return;
              }

              updateField("date", nextDate);
              updateCartField("deliveryDate", nextDate);
            }}
            value={formState.date}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-[#2d2d2d]">
            {t("nav.numberOfAttendees")}
          </span>
          <div className="inline-flex h-9 items-center rounded-[8px] border border-[#ded6ce] bg-[#fffdfa]">
            <button
              type="button"
              onClick={() => adjustPersonCount(-1)}
              disabled={personCount <= minimumCount}
              aria-label={t("nav.numberOfAttendees") + " -"}
              className="h-full w-8 cursor-pointer border-r border-[#ded6ce] text-[14px] text-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={minimumCount}
              step="1"
              aria-label={t("nav.numberOfAttendees")}
              value={personCountDraft}
              onChange={(event) => {
                const value = event.target.value;
                if (!/^\d*$/.test(value)) return;
                setPersonCountDraft(value);
                const parsed = Number.parseInt(value, 10);
                if (Number.isSafeInteger(parsed) && parsed >= minimumCount) {
                  updateField("personCount", parsed);
                  updateCartField("personCount", parsed);
                }
              }}
              onBlur={(event) => commitPersonCount(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
              className="h-full w-16 min-w-0 bg-transparent px-1 text-center text-[13px] text-[#2d2d2d] outline-none focus:bg-[#fff4ed]"
            />
            <button
              type="button"
              onClick={() => adjustPersonCount(1)}
              aria-label={t("nav.numberOfAttendees") + " +"}
              className="h-full w-8 cursor-pointer border-l border-[#ded6ce] text-[14px] text-[#2d2d2d]"
            >
              +
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[#7e7469]">
            {t("menu.minimumLabel", { count: minimumPersonCount })}
          </p>
        </div>

        {/* Time / Slot Picker */}
        <div data-checkout-field="time" className="flex flex-col sm:col-span-3">
          <span className="mb-1 block text-[13px] font-medium text-[#2d2d2d]">{t("menu.time")}</span>

          {!formState.date ? (
            <p className="rounded-[8px] border border-[#ded6ce] bg-[#faf7f4] px-3 py-2 text-[12px] text-[#9b8f84]">
              {t("menu.selectDateFirst")}
            </p>
          ) : isLoadingSlots ? (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#ded6ce] bg-[#faf7f4] px-3 py-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#cf6e38]/30 border-t-[#cf6e38]" />
              <span className="text-[13px] text-[#9b8f84]">{t("menu.checkingSlots")}</span>
            </div>
          ) : hasSlots ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              <div className="rounded-[12px] bg-[#fffaf6] p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a6a4d]">
                      {t("menu.stepOne")}
                    </p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#1d1713]">
                      {t("menu.chooseWindow")}
                    </p>
                  </div>
                  {selectedSlot ? (
                      <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-semibold text-[#cf6e38]">
                      {t("menu.selectedWindow", { label: selectedSlot.label })}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 grid gap-2 xl:grid-cols-2">
                  {deliverySlots.map((slot) => {
                    const isSelected = isTimeInSlot(selectedTime, slot);
                    const isBooked = slot.isFullyBooked;
                    return (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        type="button"
                        disabled={isBooked}
                        onClick={() => handleSelectSlot(slot)}
                        className={`rounded-[10px] border p-2.5 text-left transition ${
                          isBooked
                            ? "cursor-not-allowed border-[#e4ddd7] bg-[#f5f2ef] text-[#b0a49a]"
                            : isSelected
                              ? "border-[#cf6e38] bg-[#fff4ed] text-[#cf6e38] ring-1 ring-[#cf6e38]/20"
                              : "cursor-pointer border-[#d9d1c7] bg-white text-[#2d2d2d] hover:border-[#cf6e38]/45 hover:bg-[#fdf8f4]"
                        }`}
                      >
                        <div className="flex min-w-0 flex-col items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold leading-5 break-words">
                              {slot.label}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-4 text-[#8a7b70]">
                              {t("menu.tapWindow")}
                            </p>
                          </div>
                          <span
                            className={`inline-flex w-fit max-w-full shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getSlotStatusTone(slot)}`}
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
                <div className="rounded-[12px] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a6a4d]">
                        {t("menu.stepTwo")}
                      </p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[#1d1713]">
                        {t("menu.fineTuneTime")}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-4 text-[#8a5a3a]">
                        {t("menu.timeBetween", {
                          start: editableSlot.start,
                          end: editableSlot.end,
                        })}
                      </p>
                    </div>
                    <div className="rounded-[10px] bg-white px-2.5 py-1.5 text-right">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#a19084]">
                        {t("menu.currentTime")}
                      </p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[#cf6e38]">
                        {selectedTime ? formatTimeTo24Hour(selectedTime) : t("menu.notSelected")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 max-w-[320px]">
                    <PreferredTimePicker
                      value={formState.time}
                      onChange={handleExactTimeChange}
                      selectedDate={formState.date}
                      minTimeValue={editableSlot.start}
                      maxTimeValue={editableSlot.end}
                      placeholder={t("timePicker.placeholder")}
                    />
                  </div>
                  <p className="mt-2 text-[11px] leading-4 text-[#8a5a3a]">
                    {availabilityHint}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <input
              type="time"
              value={formState.time}
              onChange={(event) => {
                updateField("time", event.target.value);
                updateCartField("deliveryTime", event.target.value);
              }}
              className="cursor-pointer rounded-[6px] border border-[#d9d1c7] bg-white px-3 py-2 text-[14px] text-[#2d2d2d] outline-none focus:border-[#cf6e38] focus:ring-1 focus:ring-[#cf6e38]/30"
            />
          )}
        </div>
      </div>

    </CheckoutSection>
  );
}
