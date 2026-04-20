import { FiCalendar, FiClock } from "react-icons/fi";

export default function MenuDeliveryForm({
  orderSummary,
  vendorNote,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onVendorNoteChange,
  onAddToCart,
}) {
  return (
    <div className="mt-6 rounded-[16px] border border-[#e8ddd2] bg-white p-4">
      <h2 className="text-[18px] font-semibold text-[#1c1713]">
        Delivery Date & Time
      </h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <label className="block">
          <span className="text-[13px] text-[#3f342b]">Date</span>
          <div className="relative mt-1">
            <input
              type="date"
              value={orderSummary.deliveryDate}
              onChange={(event) => onDeliveryDateChange(event.target.value)}
              className="w-[176px] cursor-pointer rounded-[4px] border border-[#d7cdc4] px-4 py-2.5 pr-10 text-[14px] text-[#1d1713] outline-none"
            />
            <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#1d1713]" />
          </div>
        </label>

        <label className="block">
          <span className="text-[13px] text-[#3f342b]">Time</span>
          <div className="relative mt-1">
            <input
              type="time"
              value={orderSummary.deliveryTime}
              onChange={(event) => onDeliveryTimeChange(event.target.value)}
              className="w-[136px] cursor-pointer rounded-[4px] border border-[#d7cdc4] px-4 py-2.5 pr-10 text-[14px] text-[#1d1713] outline-none"
            />
            <FiClock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#1d1713]" />
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
            className="cursor-pointer rounded-[4px] border border-[#d7cdc4] bg-white px-3 py-1.5 text-[14px] text-[#1d1713] outline-none"
          >
            {Array.from({ length: 50 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-[15px] text-[#1d1713]">
          Location: {orderSummary.deliveryAddress}
        </p>
      </div>

      <div className="mt-6 border-t border-[#ece4dc] pt-4">
        <p className="text-[15px] font-medium text-[#1d1713]">Add Note for Vendor</p>
        <textarea
          value={vendorNote}
          onChange={(event) => onVendorNoteChange(event.target.value)}
          placeholder="Add Note..."
          className="mt-3 h-28 w-full rounded-[2px] border border-[#d7cdc4] px-3 py-3 text-[14px] text-[#3f342b] outline-none"
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
