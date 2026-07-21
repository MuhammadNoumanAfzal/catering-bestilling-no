import CheckoutField from "./CheckoutField";
import CheckoutSection from "./CheckoutSection";
import { CHECKOUT_PLACEHOLDERS } from "../../constants/checkoutForm";
import { getTodayDateValue } from "../../../order/utils/orderFlowValidation";
import { formatTimeTo24Hour } from "../../../../components/shared/navbar/navbarDateUtils";
import PreferredTimePicker from "../../../../components/shared/PreferredTimePicker";

function getSlotStatusTone(slot) {
  if (slot.isFullyBooked) return "bg-[#f0e8e4] text-[#b08a7a]";
  if (slot.remainingCapacity >= 9999) return "bg-[#eaf5ee] text-[#2f8a4b]";
  if (slot.remainingCapacity <= 3) return "bg-[#fff0e5] text-[#cf6e38]";
  return "bg-[#eef6ef] text-[#2f8a4b]";
}

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
            <div className="flex flex-col gap-3">
              <div className="rounded-[14px] border border-[#eadfd6] bg-[#fffaf6] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9a6a4d]">
                      Step 1
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-[#1d1713]">
                      Choose a delivery window
                    </p>
                  </div>
                  {selectedSlot ? (
                    <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                      Selected: {selectedSlot.label}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-2 lg:grid-cols-2">
                  {deliverySlots.map((slot) => {
                    const isSelected = isTimeInSlot(selectedTime, slot);
                    const isBooked = slot.isFullyBooked;
                    return (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        type="button"
                        disabled={isBooked}
                        onClick={() => handleSelectSlot(slot)}
                        className={`rounded-[12px] border p-3 text-left transition ${
                          isBooked
                            ? "cursor-not-allowed border-[#e4ddd7] bg-[#f5f2ef] text-[#b0a49a]"
                            : isSelected
                              ? "border-[#cf6e38] bg-[#fff4ed] text-[#cf6e38] ring-1 ring-[#cf6e38]/20"
                              : "cursor-pointer border-[#d9d1c7] bg-white text-[#2d2d2d] hover:border-[#cf6e38]/45 hover:bg-[#fdf8f4]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[15px] font-semibold">{slot.label}</p>
                            <p className="mt-1 text-[12px] text-[#8a7b70]">
                              Tap to use this delivery window
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getSlotStatusTone(slot)}`}
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
                <div className="rounded-[14px] border border-[#ead8ca] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9a6a4d]">
                        Step 2
                      </p>
                      <p className="mt-1 text-[15px] font-semibold text-[#1d1713]">
                        Fine-tune your exact time
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#8a5a3a]">
                        Pick any 15-minute time between {editableSlot.start} and {editableSlot.end}.
                      </p>
                    </div>
                    <div className="rounded-[12px] border border-[#efd8ca] bg-white px-3 py-2 text-right">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#a19084]">
                        Current time
                      </p>
                      <p className="mt-1 text-[15px] font-semibold text-[#cf6e38]">
                        {selectedTime ? formatTimeTo24Hour(selectedTime) : "Not selected"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 max-w-[320px]">
                    <PreferredTimePicker
                      value={formState.time}
                      onChange={handleExactTimeChange}
                      selectedDate={formState.date}
                      minTimeValue={editableSlot.start}
                      maxTimeValue={editableSlot.end}
                      placeholder="HH:MM"
                    />
                  </div>
                  <p className="mt-3 text-[12px] leading-5 text-[#8a5a3a]">
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
