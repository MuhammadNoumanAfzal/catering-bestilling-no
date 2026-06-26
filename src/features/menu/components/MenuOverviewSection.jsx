import { FiClock, FiMapPin, FiStar, FiTruck } from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";

function InfoCard({ icon, label, value, subvalue }) {
  return (
    <div className="min-h-[116px] rounded-[22px] border border-[#ead8c8] bg-[#fffaf5] px-4 py-4 shadow-[0_6px_18px_rgba(39,24,13,0.04)] sm:min-h-[128px] sm:px-5">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[15px] text-[#1f1712] shadow-[0_4px_10px_rgba(39,24,13,0.05)]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7a6453]">
            {label}
          </p>
          <p className="mt-1.5 text-[16px] font-semibold leading-6 text-[#111111] sm:text-[17px]">
            {value}
          </p>
          {subvalue ? (
            <p className="mt-1.5 text-[12px] leading-5 text-[#5d5147] sm:text-[13px]">
              {subvalue}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MenuOverviewSection({ vendor, menuItem }) {
  const priceLabel = menuItem.modal?.priceLabel ?? "per person";
  const unitPrice = Number(
    menuItem.modal?.unitPrice ?? menuItem.modal?.pricePerPerson ?? menuItem.price ?? 0,
  );

  return (
    <>
      <div>
        <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.03em] text-[#17120f] sm:text-[48px]">
          {menuItem.modal.heading}
        </h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f2efec] px-4 py-2 text-[16px] font-semibold text-[#111111]">
          <LiaBicycleSolid className="text-[18px] text-[#cf6e38]" />
          <span>{vendor.name}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<FiStar className="fill-[#f4b400] text-[#f4b400]" />}
          label="Rating"
          value={`${vendor.rating} / 5`}
          subvalue={vendor.reviewCount ? `${vendor.reviewCount} reviews` : ""}
        />
        <InfoCard
          icon={<FiMapPin />}
          label="Location"
          value={vendor.city || vendor.addressLine || "Not available"}
          subvalue={vendor.addressLine || ""}
        />
        <InfoCard
          icon={<FiTruck />}
          label="Delivery"
          value={vendor.deliveryFee ? vendor.deliveryFee.replace(" fee", "").trim() : "Not available"}
        />
        <InfoCard
          icon={<FiClock />}
          label="Timing"
          value={vendor.leadTime || "Not available"}
          subvalue={vendor.availability?.delivery?.label || ""}
        />
      </div>

      <div className="mt-5 rounded-[18px] border border-[#efe4da] bg-white p-4 sm:p-5">
        <p className="text-[15px] leading-8 text-[#1d1713] sm:text-[16px] sm:leading-9">
          Price: NOK {unitPrice.toFixed(2)} {priceLabel}
        </p>
        <p className="text-[15px] leading-8 text-[#1d1713] sm:text-[16px] sm:leading-9">
          Vendor: {vendor.name}
        </p>
        <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[#4e443c] sm:mt-4 sm:text-[15px] sm:leading-8">
          {menuItem.description}
        </p>
      </div>
    </>
  );
}
