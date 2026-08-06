import {
  FiClock,
  FiMapPin,
  FiPackage,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";

const DAY_LABELS = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  su: "Sun",
  sun: "Sun",
  sunday: "Sun",
  mo: "Mon",
  mon: "Mon",
  monday: "Mon",
  tu: "Tue",
  tue: "Tue",
  tuesday: "Tue",
  we: "Wed",
  wed: "Wed",
  wednesday: "Wed",
  th: "Thu",
  thu: "Thu",
  thursday: "Thu",
  fr: "Fri",
  fri: "Fri",
  friday: "Fri",
  sa: "Sat",
  sat: "Sat",
  saturday: "Sat",
};

function normalizeTimingEntries(vendor) {
  const rawSlots = Array.isArray(vendor?.availability?.delivery?.slots)
    ? vendor.availability.delivery.slots
    : [];

  const slotEntries = rawSlots
    .map((slot) => {
      const dayKey = `${slot?.day ?? ""}`.trim().toLowerCase();
      const dayLabel = DAY_LABELS[dayKey] ?? DAY_LABELS[slot?.day] ?? `${slot?.day ?? ""}`.trim();
      const start = `${slot?.start ?? ""}`.trim();
      const end = `${slot?.end ?? ""}`.trim();

      if (!dayLabel || !start || !end) {
        return null;
      }

      return `${dayLabel} ${start}-${end}`;
    })
    .filter(Boolean);

  if (slotEntries.length > 0) {
    return [...new Set(slotEntries)];
  }

  const fallbackLabel = `${vendor?.availability?.delivery?.label ?? ""}`.trim();
  return fallbackLabel ? [fallbackLabel] : [];
}

function MetricCard({ icon, label, value, subvalue }) {
  return (
    <div className="rounded-[24px] border border-[#eadfd5] bg-white p-4 shadow-[0_14px_30px_rgba(55,34,19,0.05)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#fff4ec_0%,#fff8f4_100%)] text-[15px] text-[#cf6e38] shadow-[0_10px_18px_rgba(207,110,56,0.12)]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7a66]">
            {label}
          </p>
          <p className="mt-2 text-[20px] font-semibold leading-6 tracking-[-0.03em] text-[#17120f]">
            {value}
          </p>
          {subvalue ? (
            <p className="mt-2 text-[13px] leading-6 text-[#66584d]">
              {subvalue}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TimingPanel({ entries }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-[28px] border border-[#e8ddd3] bg-[linear-gradient(135deg,#fffaf6_0%,#fff4eb_100%)] p-4 shadow-[0_18px_36px_rgba(55,34,19,0.05)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-[18px] text-[#cf6e38] shadow-[0_10px_20px_rgba(55,34,19,0.08)]">
              <FiClock />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7a66]">
                {t("menu.timing")}
              </p>
              <p className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[#17120f] sm:text-[28px]">
                {t("menu.deliverySchedule")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-6 text-[#66584d] sm:text-[14px]">
            {t("menu.deliveryScheduleDesc")}
          </p>
        </div>

        <div className="w-full lg:max-w-[520px]">
          {entries.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {entries.map((entry) => (
                <div
                  key={entry}
                  className="rounded-[18px] border border-[#ead8ca] bg-white px-4 py-3 shadow-[0_8px_18px_rgba(55,34,19,0.04)]"
                >
                  <p className="text-[14px] font-semibold leading-6 text-[#2a211b] break-words">
                    {entry}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#e1d4c7] bg-white/80 px-4 py-5 text-[14px] font-medium text-[#77685e]">
              {t("menu.deliveryScheduleUnavailable")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuOverviewSection({ vendor, menuItem }) {
  const { t } = useTranslation();
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
  const timingEntries = normalizeTimingEntries(vendor);

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
                {t("menu.menuDetails")}
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
              {t("menu.startingFrom")}
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
                  {t("menu.minimumOrder")}
                </p>
                <p className="mt-1 text-[16px] font-semibold text-[#221b17]">
                  {t("menu.persons", { count: minimumPersons })}
                </p>
              </div>
              <div className="rounded-[16px] bg-[#faf4ee] px-4 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a48370]">
                  {t("menu.deliveryStyle")}
                </p>
                <p className="mt-1 text-[16px] font-semibold text-[#221b17]">
                  {t("menu.deliveryStyleValue")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3.5 md:grid-cols-3">
        <MetricCard
          icon={<FiStar className="fill-[#f4b400] text-[#f4b400]" />}
          label={t("menu.rating")}
          value={`${vendor.rating} / 5`}
          subvalue={vendor.reviewCount ? t("vendor.reviewsCount", { count: vendor.reviewCount }) : ""}
        />
        <MetricCard
          icon={<FiMapPin />}
          label={t("menu.location")}
          value={vendor.city || vendor.addressLine || t("menu.notAvailable")}
          subvalue={vendor.addressLine || ""}
        />
        <MetricCard
          icon={<FiTruck />}
          label={t("menu.delivery")}
          value={vendor.deliveryFee ? vendor.deliveryFee.replace(" fee", "").trim() : t("menu.notAvailable")}
          subvalue={t("menu.visibleBeforeCheckout")}
        />
      </div>

      <div className="mt-4">
        <TimingPanel entries={timingEntries} />
      </div>

      <div className="mt-5 rounded-[24px] border border-[#efe4da] bg-white p-5 shadow-[0_14px_28px_rgba(55,34,19,0.04)] sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f1eb] px-3.5 py-2 text-[13px] font-semibold text-[#2b221d]">
            <FiPackage className="text-[#cf6e38]" />
            {t("menu.preparedMenu")}
          </span>
          <span className="inline-flex rounded-full border border-[#e7dacf] px-3.5 py-2 text-[13px] font-medium text-[#6c5d52]">
            {t("menu.vendorPrefix", { name: vendor.name })}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-[14px] leading-7 text-[#4e443c] sm:text-[15px] sm:leading-8">
          {t("menu.overviewNote")}
        </p>
      </div>
    </>
  );
}
