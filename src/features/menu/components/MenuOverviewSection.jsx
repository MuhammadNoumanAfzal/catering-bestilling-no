import { FiClock, FiMapPin, FiStar, FiTruck } from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";
import { formatDistance } from "./menuDetailsUtils";

function InfoCard({ icon, label, value, subvalue }) {
  return (
    <div className="rounded-[22px] border border-[#ead8c8] bg-[#fffaf5] px-4 py-4 shadow-[0_6px_18px_rgba(39,24,13,0.04)]">
      <div className="flex items-start gap-3">
        <span className="mt-1 text-[16px] text-[#1f1712]">{icon}</span>
        <div>
          <p className="text-[13px] font-medium text-[#1f1712]">{label}</p>
          <p className="mt-1 text-[15px] font-semibold leading-6 text-[#111111]">
            {value}
          </p>
          {subvalue ? (
            <p className="mt-1 text-[12px] leading-5 text-[#2f241c]">{subvalue}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MenuOverviewSection({ vendor, menuItem }) {
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

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<FiStar className="fill-[#f4b400] text-[#f4b400]" />}
          label="Rating"
          value={`${vendor.rating} / 5`}
          subvalue="Top-rated vendor in this area"
        />
        <InfoCard
          icon={<FiMapPin />}
          label="Location"
          value="Bergen City Center"
          subvalue={formatDistance(vendor.addressLine)}
        />
        <InfoCard
          icon={<FiTruck />}
          label="Delivery"
          value={vendor.deliveryFee.replace("fee", "").trim()}
          subvalue="15% off large orders"
        />
        <InfoCard
          icon={<FiClock />}
          label="Timing"
          value={vendor.leadTime}
          subvalue="Catering | Lunch | Office Events"
        />
      </div>

      <div className="mt-5 rounded-[16px] bg-white pb-4">
        <p className="text-[16px] leading-9 text-[#1d1713]">
          Price: {menuItem.price} per person
        </p>
        <p className="text-[16px] leading-9 text-[#1d1713]">
          Vendor: {vendor.name}
        </p>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#4e443c]">
          {menuItem.description}
        </p>
      </div>
    </>
  );
}
