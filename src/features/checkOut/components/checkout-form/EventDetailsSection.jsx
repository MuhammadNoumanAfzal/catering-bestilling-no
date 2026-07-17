import CheckoutField from "./CheckoutField";
import CheckoutSection from "./CheckoutSection";
import { CHECKOUT_PLACEHOLDERS } from "../../constants/checkoutForm";
import { getTodayDateValue } from "../../../order/utils/orderFlowValidation";
import { formatTimeTo24Hour } from "../../../../components/shared/navbar/navbarDateUtils";

export default function EventDetailsSection({
  mode,
  formState,
  updateField,
  updateCartField,
  deliverySlots = [],
  isLoadingSlots = false,
}) {
  const eventLabel = mode === "corporate" ? "Event Name" : "Occasion";
  const eventKey = mode === "corporate" ? "eventName" : "occasion";
  const eventPlaceholder =
    mode === "corporate"
      ? CHECKOUT_PLACEHOLDERS.eventName
      : CHECKOUT_PLACEHOLDERS.occasion;

  const adjustPersonCount = (delta) => {
    const nextPersonCount = Math.max(1, Number(formState.personCount) + delta);
    updateField("personCount", nextPersonCount);
    updateCartField("personCount", nextPersonCount);
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
    if (slot.isFullyBooked) return "Fully booked";
    if (slot.remainingCapacity >= 9999) return "Available";
    return `${slot.remainingCapacity} spot${slot.remainingCapacity !== 1 ? "s" : ""} left`;
  }

  const selectedSlot = getMatchingSlot(selectedTime);
  const editableSlot = selectedSlot || firstAvailableSlot;
  const availabilityHint = editableSlot
    ? `Vendor available between ${editableSlot.start} and ${editableSlot.end} for this selection.`
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
    <CheckoutSection title="Event Details">
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckoutField
          label={eventLabel}
          value={formState[eventKey]}
          onChange={(event) => updateField(eventKey, event.target.value)}
          placeholder={eventPlaceholder}
          className="sm:col-span-2"
        />
        <CheckoutField
          label="Date"
          type="date"
          value={formState.date}
          min={getTodayDateValue()}
          onChange={(event) => {
            updateField("date", event.target.value);
            updateCartField("deliveryDate", event.target.value);
          }}
          inputClassName="cursor-pointer"
        />

        {/* Time / Slot Picker */}
        <div className="flex flex-col">
          <span className="type-subpara mb-1 block text-[#2d2d2d]">Time</span>

          {!formState.date ? (
            <p className="rounded-[8px] border border-[#d9d1c7] bg-[#faf7f4] px-3 py-2 text-[13px] text-[#9b8f84]">
              Select a date first
            </p>
          ) : isLoadingSlots ? (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#d9d1c7] bg-[#faf7f4] px-3 py-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#cf6e38]/30 border-t-[#cf6e38]" />
              <span className="text-[13px] text-[#9b8f84]">Checking availability...</span>
            </div>
          ) : hasSlots ? (
            <div className="flex flex-col gap-2">
              {deliverySlots.map((slot) => {
                const isSelected = isTimeInSlot(selectedTime, slot);
                const isBooked = slot.isFullyBooked;
                return (
                  <button
                    key={`${slot.start}-${slot.end}`}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleSelectSlot(slot)}
                    className={`flex w-full items-center justify-between rounded-[8px] border px-3 py-2 text-left text-[13px] transition ${
                      isBooked
                        ? "cursor-not-allowed border-[#e4ddd7] bg-[#f5f2ef] text-[#b0a49a] line-through"
                        : isSelected
                          ? "border-[#cf6e38] bg-[#fff4ed] font-semibold text-[#cf6e38] ring-1 ring-[#cf6e38]/30"
                          : "cursor-pointer border-[#d9d1c7] bg-white text-[#2d2d2d] hover:border-[#cf6e38]/50 hover:bg-[#fdf8f4]"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isBooked
                          ? "bg-[#f0e8e4] text-[#b08a7a]"
                          : slot.remainingCapacity >= 9999
                            ? "bg-[#eaf5ee] text-[#2f8a4b]"
                            : slot.remainingCapacity <= 3
                              ? "bg-[#fff0e5] text-[#cf6e38]"
                              : "bg-[#eaf5ee] text-[#2f8a4b]"
                      }`}
                    >
                      {getCapacityLabel(slot)}
                    </span>
                  </button>
                );
              })}

              {editableSlot ? (
                <div className="rounded-[10px] border border-[#ead8ca] bg-[#fffaf5] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a5a3a]">
                      Choose exact time
                    </p>
                    {selectedTime ? (
                      <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-semibold text-[#cf6e38]">
                        {formatTimeTo24Hour(selectedTime)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <input
                      type="time"
                      value={formState.time}
                      step={900}
                      min={editableSlot.start}
                      max={editableSlot.end}
                      onChange={(event) => handleExactTimeChange(event.target.value)}
                      className="w-full cursor-pointer rounded-[8px] border border-[#d9d1c7] bg-white px-3 py-2 text-[14px] text-[#2d2d2d] outline-none focus:border-[#cf6e38] focus:ring-1 focus:ring-[#cf6e38]/30"
                    />
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-[#8a5a3a]">
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

      <div className="mt-3">
        <span className="type-subpara mb-1 block text-[#2d2d2d]">
          Person Count
        </span>
        <div className="inline-flex items-center border border-[#d9d1c7] bg-white">
          <button
            type="button"
            onClick={() => adjustPersonCount(-1)}
            className="type-subpara h-8 w-8 cursor-pointer border-r border-[#d9d1c7] text-[#2d2d2d]"
          >
            -
          </button>
          <span className="type-subpara inline-flex min-w-[56px] justify-center px-3 text-[#2d2d2d]">
            {formState.personCount}
          </span>
          <button
            type="button"
            onClick={() => adjustPersonCount(1)}
            className="type-subpara h-8 w-8 cursor-pointer border-l border-[#d9d1c7] text-[#2d2d2d]"
          >
            +
          </button>
        </div>
      </div>
    </CheckoutSection>
  );
}
