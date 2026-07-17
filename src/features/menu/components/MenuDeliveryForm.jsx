import PreferredTimePicker from "../../../components/shared/PreferredTimePicker";
import { getTodayDateValue } from "../../order/utils/orderFlowValidation";
import { formatTimeTo24Hour } from "../../../components/shared/navbar/navbarDateUtils";

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

  function isTimeInSlot(time, slot) {
    return time >= slot.start && time <= slot.end;
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

  return (
    <div className="mt-6 rounded-[16px] border border-[#e8ddd2] bg-white p-4">
      <h2 className="text-[18px] font-semibold text-[#1c1713]">
        Delivery Date & Time
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-[176px_176px]">
        <label className="block">
          <span className="text-[13px] text-[#3f342b]">Date</span>
          <div className="mt-1">
            <input
              type="date"
              value={orderSummary.deliveryDate}
              onChange={(event) => onDeliveryDateChange(event.target.value)}
              min={getTodayDateValue()}
              className="w-full cursor-pointer rounded-[8px] border border-[#d7cdc4] px-4 py-2.5 text-[14px] text-[#1d1713] outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[13px] text-[#3f342b]">Time</span>
          <div className="mt-1">
            {!orderSummary.deliveryDate ? (
              <p className="rounded-[8px] border border-[#d9d1c7] bg-[#faf7f4] px-3 py-2 text-[13px] text-[#9b8f84]">
                Select a date first
              </p>
            ) : isLoadingSlots ? (
              <div className="flex items-center gap-2 rounded-[8px] border border-[#d9d1c7] bg-[#faf7f4] px-3 py-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#cf6e38]/30 border-t-[#cf6e38]" />
                <span className="text-[13px] text-[#9b8f84]">Checking available delivery slots...</span>
              </div>
            ) : hasSlots ? (
              <div className="flex flex-col gap-2">
                {deliverySlots.map((slot) => {
                  const isSelected = isTimeInSlot(selectedTime, slot);
                  const shouldShowExactTime =
                    isSelected && selectedTime && selectedTime !== slot.start;

                  return (
                    <button
                      key={`${slot.start}-${slot.end}`}
                      type="button"
                      disabled={slot.isFullyBooked}
                      onClick={() => handleSelectSlot(slot)}
                      className={`flex w-full items-center justify-between rounded-[8px] border px-3 py-2 text-left text-[13px] transition ${
                        slot.isFullyBooked
                          ? "cursor-not-allowed border-[#e4ddd7] bg-[#f5f2ef] text-[#b0a49a] line-through"
                          : isSelected
                            ? "border-[#cf6e38] bg-[#fff4ed] font-semibold text-[#cf6e38] ring-1 ring-[#cf6e38]/30"
                            : "cursor-pointer border-[#d9d1c7] bg-white text-[#2d2d2d] hover:border-[#cf6e38]/50 hover:bg-[#fdf8f4]"
                      }`}
                    >
                      <span className="flex flex-col">
                        <span>{slot.label}</span>
                        {shouldShowExactTime ? (
                          <span className="mt-1 text-[11px] font-medium text-[#8a5a3a]">
                            Selected time: {formatTimeTo24Hour(selectedTime)}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          slot.isFullyBooked
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

        <div className="mt-3 flex items-center gap-3">
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
