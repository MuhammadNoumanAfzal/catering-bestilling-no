import { FiClock, FiMapPin, FiX, FiCalendar } from "react-icons/fi";

export default function VendorLocationModal({ vendor, onClose }) {
  if (!vendor) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-xl rounded-[24px] border border-[#eadfd2] bg-[#fffaf6] p-6 shadow-[0_24px_60px_rgba(32,22,12,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#eadfd2] bg-white text-[#1f1f1f] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
          aria-label="Close location popup"
        >
          <FiX className="text-[18px]" />
        </button>

        <div className="pr-12">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#cf6e38]">
            Restaurant Details & Availability
          </p>
          <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#171512]">
            {vendor.name}
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Address Card */}
          <div className="rounded-[18px] border border-[#eadfd2] bg-white p-4">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              <FiMapPin className="text-[14px]" />
              Address
            </p>
            <p className="mt-3 text-[16px] font-semibold text-[#1f1f1f] break-words">
              {vendor.addressLine || "No business address provided"}
            </p>
            {vendor.city && (
              <p className="mt-1 text-[14px] text-[#6f675f]">
                {vendor.city}, Norway
              </p>
            )}
            {vendor.leadTime && (
              <p className="mt-3 text-[13px] text-[#7b6f64]">
                Typical lead time: <span className="font-semibold text-[#1f1f1f]">{vendor.leadTime}</span>
              </p>
            )}
          </div>

          {/* Delivery Settings Card */}
          <div className="rounded-[18px] border border-[#eadfd2] bg-white p-4">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              <FiClock className="text-[14px]" />
              Delivery Hours
            </p>
            <p className="mt-3 text-[15px] font-semibold text-[#1f1f1f] whitespace-pre-line">
              {vendor.availability?.delivery?.label || "Open 24/7"}
            </p>
            {vendor.deliveryFee && (
              <p className="mt-3 text-[13px] text-[#7b6f64]">
                Fee: <span className="font-semibold text-[#1f1f1f]">{vendor.deliveryFee}</span>
              </p>
            )}
          </div>

          {/* Opening / Business Hours Card */}
          <div className="rounded-[18px] border border-[#eadfd2] bg-white p-4 sm:col-span-2">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              <FiCalendar className="text-[14px]" />
              Opening Hours (Takeout)
            </p>
            <p className="mt-3 text-[14px] leading-6 text-[#1f1f1f] font-medium whitespace-pre-line">
              {vendor.availability?.takeout?.label?.split(" | ").join("\n") || "Closed"}
            </p>
          </div>
        </div>

        {/* Service Areas Postal Codes */}
        {vendor.servicePostalCodes && vendor.servicePostalCodes.length > 0 ? (
          <div className="mt-4 rounded-[18px] border border-[#eadfd2] bg-white p-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              Service Postal Codes
            </p>
            <div className="mt-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
              {vendor.servicePostalCodes.map((postalCode) => (
                <span
                  key={postalCode}
                  className="inline-flex rounded-full bg-[#f7efe8] px-3 py-1 text-[13px] font-medium text-[#5d5249]"
                >
                  {postalCode}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-[18px] border border-[#eadfd2] bg-white p-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              Service Area
            </p>
            <p className="mt-2 text-[14px] text-[#6f675f]">
              Serves all local postal codes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
