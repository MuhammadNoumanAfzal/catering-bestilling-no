import { FiClock, FiMapPin } from "react-icons/fi";

const TIME_OPTIONS = Array.from({ length: 25 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = `${Math.floor(totalMinutes / 60)}`.padStart(2, "0");
  const minutes = `${totalMinutes % 60}`.padStart(2, "0");

  return `${hours}:${minutes}`;
});

function formatTimeLabel(value) {
  const [rawHours = "0", rawMinutes = "00"] = value.split(":");
  const hours = Number(rawHours);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;

  return `${normalizedHours}:${rawMinutes} ${suffix}`;
}

export default function MenuDeliveryForm({
  minimumPersons = 1,
  orderSummary,
  vendorNote,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onDeliveryAddressChange,
  onVendorNoteChange,
  onAddToCart,
}) {
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
              className="w-full cursor-pointer rounded-[8px] border border-[#d7cdc4] px-4 py-2.5 text-[14px] text-[#1d1713] outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[13px] text-[#3f342b]">Time</span>
          <div className="relative mt-1">
            <select
              value={orderSummary.deliveryTime}
              onChange={(event) => onDeliveryTimeChange(event.target.value)}
              className="w-full cursor-pointer appearance-none rounded-[8px] border border-[#d7cdc4] bg-white px-4 py-2.5 pr-16 text-[14px] text-[#1d1713] outline-none"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {formatTimeLabel(time)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[#1d1713]">
              <FiClock className="text-[16px]" />
            </div>
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

        <label className="mt-4 block">
          <span className="text-[13px] text-[#3f342b]">Delivery address</span>
          <div className="relative mt-1">
            <input
              type="text"
              value={orderSummary.deliveryAddress}
              onChange={(event) => onDeliveryAddressChange(event.target.value)}
              placeholder="Enter delivery address"
              className="w-full rounded-[8px] border border-[#d7cdc4] px-4 py-2.5 pl-10 text-[14px] text-[#1d1713] outline-none placeholder:text-[#a49b92]"
            />
            <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#1d1713]" />
          </div>
        </label>
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
        className="mt-5 block w-full cursor-pointer rounded-[10px] bg-[#cf6e38] px-4 py-3 text-center text-[15px] font-semibold text-white transition hover:bg-[#bb602d]"
      >
        Add to Cart
      </button>
    </div>
  );
}
