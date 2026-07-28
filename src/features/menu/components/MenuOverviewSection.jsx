import {
  FiClock,
  FiMapPin,
  FiPackage,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";

function InfoCard({ icon, label, value, subvalue }) {
  return (
    <div className="min-h-[126px] rounded-[24px] border border-[#ecddd1] bg-[linear-gradient(180deg,#fffdfb_0%,#fff5ed_100%)] px-4 py-4 shadow-[0_14px_32px_rgba(39,24,13,0.05)] sm:min-h-[138px] sm:px-5">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[15px] text-[#cf6e38] shadow-[0_8px_18px_rgba(39,24,13,0.08)]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#947867]">
            {label}
          </p>
          <p className="mt-2 text-[16px] font-semibold leading-6 text-[#111111] sm:text-[17px]">
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
  const minimumPersons = Number(menuItem?.serves ?? 1);
  const cuisineBadge =
    menuItem?.modal?.badge || menuItem?.badge || menuItem?.category || "Chef's pick";
  const description =
    menuItem.description ||
    "A curated catering option prepared for dependable delivery and easy team ordering.";

  return (
    <>
      <div className="rounded-[30px] border border-[#eaded3] bg-[linear-gradient(135deg,#fffdfb_0%,#fff6ef_52%,#fffdf9_100%)] p-4 shadow-[0_18px_40px_rgba(55,34,19,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-[#fff1e8] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c56535]">
                {cuisineBadge}
              </span>
              <span className="rounded-full border border-[#ead9cd] bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#79675c]">
                Menu details
              </span>
            </div>

            <h1 className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#17120f] sm:text-[44px]">
              {menuItem.modal.heading}
            </h1>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[15px] font-semibold text-[#111111] shadow-[0_10px_20px_rgba(39,24,13,0.06)]">
              <LiaBicycleSolid className="text-[18px] text-[#cf6e38]" />
              <span>{vendor.name}</span>
            </div>

            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#564b43] sm:text-[16px] sm:leading-8">
              {description}
            </p>
          </div>

          <div className="w-full max-w-[320px] rounded-[24px] border border-[#f0ddd1] bg-white p-4 shadow-[0_18px_32px_rgba(39,24,13,0.07)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b48062]">
              Starting from
            </p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-[32px] font-semibold leading-none tracking-[-0.05em] text-[#17120f]">
                NOK {unitPrice.toFixed(2)}
              </p>
              <p className="pb-1 text-[13px] font-medium text-[#796b61]">
                {priceLabel}
              </p>
            </div>
            <div className="mt-3 grid gap-3">
              <div className="rounded-[16px] bg-[#faf4ee] px-4 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a48370]">
                  Minimum order
                </p>
                <p className="mt-1 text-[16px] font-semibold text-[#221b17]">
                  {minimumPersons} persons
                </p>
              </div>
              <div className="rounded-[16px] bg-[#faf4ee] px-4 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a48370]">
                  Delivery style
                </p>
                <p className="mt-1 text-[16px] font-semibold text-[#221b17]">
                  Ready for office or event service
                </p>
              </div>
            </div>
          </div>
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
          subvalue="Visible before checkout"
        />
        <InfoCard
          icon={<FiClock />}
          label="Timing"
          value={vendor.leadTime || "Not available"}
          subvalue={vendor.availability?.delivery?.label || ""}
        />
      </div>

      <div className="mt-5 rounded-[24px] border border-[#efe4da] bg-white p-5 shadow-[0_14px_28px_rgba(55,34,19,0.04)] sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f1eb] px-3.5 py-2 text-[13px] font-semibold text-[#2b221d]">
            <FiPackage className="text-[#cf6e38]" />
            Prepared menu with configurable add-ons
          </span>
          <span className="inline-flex rounded-full border border-[#e7dacf] px-3.5 py-2 text-[13px] font-medium text-[#6c5d52]">
            Vendor: {vendor.name}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-[14px] leading-7 text-[#4e443c] sm:text-[15px] sm:leading-8">
          Review what is included, choose your delivery slot, then add notes or extras before sending this item to your cart.
        </p>
      </div>
    </>
  );
}
