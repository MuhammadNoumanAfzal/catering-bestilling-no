import PreferredTimePicker from "../../../components/shared/PreferredTimePicker";
import { getTodayDateValue } from "../../order/utils/orderFlowValidation";
import { formatTimeTo24Hour } from "../../../components/shared/navbar/navbarDateUtils";

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

export default function MenuDeliveryForm({
  minimumPersons = 1,
  isVendorAvailable = true,
  orderSummary,
  vendorNote,
  deliverySlots = [],
  isLoadingSlots = false,
  hasDeliverySchedule = false,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onVendorNoteChange,
  onAddToCart,
}) {
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
      return "Fully booked";
    }

    if (slot.remainingCapacity >= 9999) {
      return "Available";
    }

    return `${slot.remainingCapacity} spot${slot.remainingCapacity !== 1 ? "s" : ""} left`;
  }

  const selectedSlot = getMatchingSlot(selectedTime);
  const editableSlot = selectedSlot || firstAvailableSlot;
  const availabilityHint = editableSlot
    ? `Vendor available between ${editableSlot.start} and ${editableSlot.end} for this selection.`
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

  return (
    <div className="mt-6 rounded-[16px] border border-[#e8ddd2] bg-white p-4">
      <h2 className="text-[18px] font-semibold text-[#1c1713]">
        Delivery Date & Time
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[176px_minmax(0,1fr)]">
        <label className="block min-w-0">
          <span className="text-[13px] text-[#3f342b]">Date</span>
          <div className="mt-1">
            <input
              type="date"
              value={orderSummary.deliveryDate}
              onChange={(event) => onDeliveryDateChange(event.target.value)}
              min={getTodayDateValue()}
              className="block min-w-0 w-full max-w-full cursor-pointer rounded-[8px] border border-[#d7cdc4] px-3 py-2.5 text-[14px] text-[#1d1713] outline-none sm:px-4"
            />
          </div>
        </label>

        <label className="block min-w-0">
          <span className="text-[13px] text-[#3f342b]">Time</span>
          <div className="mt-1">
            {!orderSummary.deliveryDate ? (
              <p className="min-w-0 rounded-[8px] border border-[#d9d1c7] bg-[#faf7f4] px-3 py-2 text-[13px] text-[#9b8f84]">
                Select a date first
              </p>
            ) : isLoadingSlots ? (
              <div className="flex min-w-0 items-center gap-2 rounded-[8px] border border-[#d9d1c7] bg-[#faf7f4] px-3 py-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#cf6e38]/30 border-t-[#cf6e38]" />
                <span className="text-[13px] text-[#9b8f84]">Checking available delivery slots...</span>
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

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {deliverySlots.map((slot) => {
                      const isSelected = isTimeInSlot(selectedTime, slot);

                      return (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          disabled={slot.isFullyBooked}
                          onClick={() => handleSelectSlot(slot)}
                          className={`rounded-[12px] border p-3 text-left transition ${
                            slot.isFullyBooked
                              ? "cursor-not-allowed border-[#e4ddd7] bg-[#f5f2ef] text-[#b0a49a]"
                              : isSelected
                                ? "border-[#cf6e38] bg-[#fff4ed] text-[#cf6e38] ring-1 ring-[#cf6e38]/20"
                                : "cursor-pointer border-[#d9d1c7] bg-white text-[#2d2d2d] hover:border-[#cf6e38]/45 hover:bg-[#fdf8f4]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[15px] font-semibold">
                                {slot.label}
                              </p>
                              <p className="mt-1 text-[12px] text-[#8a7b70]">
                                Tap to use this delivery window
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
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
                        value={selectedTime}
                        onChange={handleExactTimeChange}
                        selectedDate={orderSummary.deliveryDate}
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
            ) : hasDeliverySchedule ? (
              <p className="rounded-[8px] border border-[#ead8ca] bg-[#fff7f1] px-3 py-2 text-[13px] text-[#8a5a3a]">
                No delivery slots are available for the selected date. Please choose another day.
              </p>
            ) : (
              <PreferredTimePicker
                value={orderSummary.deliveryTime}
                onChange={onDeliveryTimeChange}
                selectedDate={orderSummary.deliveryDate}
                placeholder="Select preferred time"
              />
            )}
          </div>
        </label>
      </div>

      <div className="mt-5">
        <h3 className="text-[18px] font-semibold text-[#1c1713]">
          Event Details
        </h3>

        <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="text-[15px] text-[#1d1713]">Persons:</span>
          <select
            value={orderSummary.personCount}
            onChange={(event) => onPersonCountChange(Number(event.target.value))}
            className="cursor-pointer rounded-[8px] border border-[#d7cdc4] bg-white px-3 py-1.5 text-[14px] text-[#1d1713] outline-none"
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
          <span className="text-[13px] text-[#7e7469]">
            Minimum {minimumPersons}
          </span>
        </div>

      </div>

      <div className="mt-6 border-t border-[#ece4dc] pt-4">
        <p className="text-[15px] font-medium text-[#1d1713]">Add Note for Vendor</p>
        <textarea
          value={vendorNote}
          onChange={(event) => onVendorNoteChange(event.target.value)}
          placeholder="Add Note..."
          className="mt-3 h-28 w-full rounded-[8px] border border-[#d7cdc4] px-3 py-3 text-[14px] text-[#3f342b] outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={!isVendorAvailable}
        className={`mt-5 block w-full rounded-[10px] px-4 py-3 text-center text-[15px] font-semibold text-white transition ${
          isVendorAvailable
            ? "cursor-pointer bg-[#cf6e38] hover:bg-[#bb602d]"
            : "cursor-not-allowed bg-[#d7c5b9]"
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
}
