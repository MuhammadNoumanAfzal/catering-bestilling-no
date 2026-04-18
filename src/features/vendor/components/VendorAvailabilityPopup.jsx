import { FiStar, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

function VendorSuggestionCard({ vendor }) {
  return (
    <Link
      to={`/vendor/${vendor.slug}`}
      className="block cursor-pointer overflow-hidden rounded-[12px] border border-[#ddd6cd] bg-white text-left transition hover:border-[#cf6e38]"
    >
      <img
        src={vendor.banner}
        alt={vendor.name}
        className="h-[74px] w-full object-cover"
      />
      <div className="p-2">
        <p className="line-clamp-2 text-[13px] font-semibold leading-[1.2] text-[#1f1f1f]">
          {vendor.name}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6e675f]">
          <FiStar className="fill-[#f2b21b] text-[#f2b21b]" />
          <span>{vendor.rating.toFixed(1)}</span>
          <span>({vendor.reviewCount})</span>
        </div>
        <span className="mt-1 inline-block text-[13px] font-medium text-[#4f7cff]">
          View Menu
        </span>
      </div>
    </Link>
  );
}

export default function VendorAvailabilityPopup({
  availability,
  availableRestaurants = [],
  onClose,
}) {
  if (!availability) {
    return null;
  }

  const primaryRestaurant = availableRestaurants[0] ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="relative w-full max-w-[620px] rounded-[16px] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 cursor-pointer rounded-full p-1 text-[#1f1f1f] transition hover:bg-white/60"
          aria-label="Close availability popup"
        >
          <FiX className="text-[18px]" />
        </button>

        <p className="pr-8 text-[18px] font-semibold text-[#1f1f1f] sm:text-[20px]">
          This caterer is closed at your selected time.
        </p>

        <div className="mt-4 rounded-[12px] bg-[#f4f1ed] px-4 py-5 text-center">
          <p className="text-[12px] font-semibold text-[#1f1f1f]">
            Delivery Hours
          </p>
          <p className="mt-1 text-[12px] text-[#5f5852]">
            {availability.delivery.label}
          </p>
          <p className="mt-4 text-[12px] font-semibold text-[#1f1f1f]">
            Takeout Hours
          </p>
          <p className="mt-1 text-[12px] text-[#5f5852]">
            {availability.takeout.label}
          </p>
        </div>

        {availableRestaurants.length > 0 ? (
          <>
            <p className="mt-4 text-[13px] text-[#3f3a35]">
              One of these restaurants may be available to cater your event.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {availableRestaurants.slice(0, 3).map((vendor) => (
                <VendorSuggestionCard key={vendor.slug} vendor={vendor} />
              ))}
            </div>

            {primaryRestaurant ? (
              <div className="mt-5 flex justify-end">
                <Link
                  to={`/vendor/${primaryRestaurant.slug}`}
                  className="inline-flex cursor-pointer items-center justify-center rounded-[8px] bg-[#cf6e38] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#bb602d]"
                >
                  View available restaurant
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-4 text-[13px] text-[#3f3a35]">
            No other restaurants are available for this delivery time right now.
          </p>
        )}
      </div>
    </div>
  );
}
