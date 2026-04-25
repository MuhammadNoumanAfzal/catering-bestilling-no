import { FiClock, FiMapPin, FiX } from "react-icons/fi";

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
            Restaurant Location
          </p>
          <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#171512]">
            {vendor.name}
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[18px] border border-[#eadfd2] bg-white p-4">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              <FiMapPin className="text-[14px]" />
              Address
            </p>
            <p className="mt-3 text-[17px] font-semibold text-[#1f1f1f]">
              {vendor.addressLine}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#6f675f]">
              {vendor.city}, Norway
            </p>
          </div>

          <div className="rounded-[18px] border border-[#eadfd2] bg-white p-4">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
              <FiClock className="text-[14px]" />
              Delivery
            </p>
            <p className="mt-3 text-[15px] font-semibold text-[#1f1f1f]">
              {vendor.availability?.delivery?.label}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#6f675f]">
              Typical lead time: {vendor.leadTime}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b6f64]">
            Service Postal Codes
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
