import { FiCalendar, FiClock, FiMapPin, FiX } from "react-icons/fi";

function DetailCard({ accentClassName, icon, title, children, className = "" }) {
  return (
    <div
      className={`rounded-[22px] border border-[#f0ded0] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf5_100%)] p-4 shadow-[0_10px_24px_rgba(39,24,13,0.05)] ${className}`}
    >
      <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9d7458]">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${accentClassName}`}
        >
          {icon}
        </span>
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function VendorLocationModal({ vendor, onClose }) {
  if (!vendor) {
    return null;
  }

  const displayAddress = vendor.pickupAddress || vendor.addressLine;
  const displayCity = vendor.city;
  const pickupInstructions = vendor.pickupInstructions || "";
  const deliveryFeeText = vendor.deliveryFee || "";
  const freeDeliveryText = vendor.freeDeliveryOver
    ? `Free delivery over ${vendor.freeDeliveryOver}`
    : "";
  const deliveryHours = vendor.availability?.delivery?.label || "";
  const takeoutHours = vendor.availability?.takeout?.label?.split(" | ").join("\n") || "";
  const displayAreas =
    Array.isArray(vendor.serviceAreas) && vendor.serviceAreas.length > 0
      ? vendor.serviceAreas
      : Array.isArray(vendor.servicePostalCodes) && vendor.servicePostalCodes.length > 0
        ? vendor.servicePostalCodes.map((postalCode) => ({
            id: postalCode,
            name: "",
            postCode: postalCode,
          }))
        : [];
  const hasPostalCodes = displayAreas.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(34,22,12,0.48)] px-4 py-4 backdrop-blur-[3px]">
      <div className="relative flex max-h-[min(88vh,860px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[30px] border border-[#ead7ca] bg-[linear-gradient(180deg,#fffdfb_0%,#fff6ef_100%)] shadow-[0_30px_80px_rgba(32,22,12,0.22)]">
        <div className="pointer-events-none absolute left-[-60px] top-[-70px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,_rgba(207,110,56,0.18)_0%,_rgba(207,110,56,0)_72%)]" />
        <div className="pointer-events-none absolute bottom-[-80px] right-[-20px] h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,_rgba(244,178,103,0.18)_0%,_rgba(244,178,103,0)_70%)]" />

        <div className="relative overflow-y-auto px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#eadfd2] bg-white/95 text-[#1f1f1f] shadow-[0_10px_24px_rgba(32,22,12,0.08)] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
            aria-label="Close location popup"
          >
            <FiX className="text-[18px]" />
          </button>

          <div className="pr-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#cf6e38]">
              Restaurant Details & Availability
            </p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#171512] sm:text-[32px]">
              {vendor.name}
            </h2>
            <p className="mt-2 max-w-[560px] text-[14px] leading-6 text-[#6f675f]">
              Delivery timings, pickup details, and service coverage for this restaurant.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailCard
              accentClassName="bg-[#fff2e8] text-[#cf6e38]"
              icon={<FiMapPin className="text-[14px]" />}
              title="Address"
            >
              <p className="text-[16px] font-semibold leading-7 text-[#1f1f1f] break-words">
                {displayAddress || "-"}
              </p>
              {displayCity ? (
                <p className="mt-1 text-[14px] font-medium text-[#6f675f]">{displayCity}</p>
              ) : null}
              {pickupInstructions ? (
                <div className="mt-3 rounded-[16px] bg-[#fff5ee] px-3 py-3">
                  <p className="whitespace-pre-line text-[13px] leading-6 text-[#7b6f64]">
                    {pickupInstructions}
                  </p>
                </div>
              ) : null}
              {vendor.leadTime ? (
                <p className="mt-3 inline-flex rounded-full bg-[#f5efe9] px-3 py-1.5 text-[13px] text-[#7b6f64]">
                  Typical lead time:
                  <span className="ml-1 font-semibold text-[#1f1f1f]">{vendor.leadTime}</span>
                </p>
              ) : null}
            </DetailCard>

            <DetailCard
              accentClassName="bg-[#eef7ff] text-[#3b82c4]"
              icon={<FiClock className="text-[14px]" />}
              title="Delivery Hours"
            >
              <p className="whitespace-pre-line text-[15px] font-semibold leading-7 text-[#1f1f1f]">
                {deliveryHours || "Delivery schedule not available"}
              </p>
              {deliveryFeeText ? (
                <p className="mt-3 rounded-[14px] bg-[#f5f9ff] px-3 py-2 text-[13px] text-[#5f6e7d]">
                  Fee: <span className="font-semibold text-[#1f1f1f]">{deliveryFeeText}</span>
                </p>
              ) : null}
              {freeDeliveryText ? (
                <p className="mt-2 rounded-[14px] bg-[#eefaf2] px-3 py-2 text-[13px] text-[#56735d]">
                  <span className="font-semibold text-[#1f1f1f]">{freeDeliveryText}</span>
                </p>
              ) : null}
            </DetailCard>

            <DetailCard
              accentClassName="bg-[#fff5e8] text-[#d49329]"
              icon={<FiCalendar className="text-[14px]" />}
              title="Opening Hours (Takeout)"
              className="sm:col-span-2"
            >
              {takeoutHours ? (
                <div className="max-h-[220px] overflow-y-auto rounded-[16px] bg-[#fffdfb] pr-1">
                  <p className="whitespace-pre-line text-[14px] font-medium leading-7 text-[#1f1f1f]">
                    {takeoutHours}
                  </p>
                </div>
              ) : (
                <p className="text-[14px] font-medium leading-6 text-[#6f675f]">-</p>
              )}
            </DetailCard>
          </div>

          <div className="mt-4 rounded-[22px] border border-[#f0ded0] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf5_100%)] p-4 shadow-[0_10px_24px_rgba(39,24,13,0.05)]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9d7458]">
              Service Areas
            </p>
            {hasPostalCodes ? (
              <div className="mt-3 flex max-h-[180px] flex-wrap gap-2 overflow-y-auto pr-1">
                {displayAreas.map((area) => (
                  <span
                    key={area.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#f0ddd0] bg-[#fff7f0] px-3 py-1.5 text-[13px] font-medium text-[#5d5249]"
                  >
                    {area.name ? (
                      <>
                        <span className="font-semibold text-[#3d3229]">{area.name}</span>
                        <span className="text-[#9c8a7d]">•</span>
                        <span>{area.postCode}</span>
                      </>
                    ) : (
                      <span>{area.postCode}</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[14px] text-[#6f675f]">-</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
