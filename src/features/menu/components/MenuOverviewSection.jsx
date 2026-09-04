import {
  FiClock,
  FiMapPin,
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
    <div className="rounded-[18px] border border-[#eadfd5] bg-white p-3 shadow-[0_10px_22px_rgba(55,34,19,0.04)] sm:p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,#fff4ec_0%,#fff8f4_100%)] text-[13px] text-[#cf6e38] shadow-[0_8px_14px_rgba(207,110,56,0.10)]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9b7a66]">
            {label}
          </p>
          <p className="mt-1 text-[16px] font-semibold leading-5 tracking-[-0.03em] text-[#17120f]">
            {value}
          </p>
          {subvalue ? (
            <p className="mt-1 text-[11px] leading-4 text-[#66584d]">
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
    <div className="rounded-[20px] border border-[#e8ddd3] bg-[linear-gradient(135deg,#fffaf6_0%,#fff4eb_100%)] p-3 shadow-[0_12px_26px_rgba(55,34,19,0.04)] sm:p-3.5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[14px] bg-white text-[15px] text-[#cf6e38] shadow-[0_8px_16px_rgba(55,34,19,0.06)]">
              <FiClock />
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9b7a66]">
                {t("menu.timing")}
              </p>
              <p className="text-[19px] font-semibold tracking-[-0.04em] text-[#17120f] sm:text-[22px]">
                {t("menu.deliverySchedule")}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-[#66584d] sm:text-[12px]">
            {t("menu.deliveryScheduleDesc")}
          </p>
        </div>

        <div className="w-full lg:max-w-[520px]">
          {entries.length ? (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {entries.map((entry) => (
                <div
                  key={entry}
                  className="rounded-[14px] border border-[#ead8ca] bg-white px-3 py-2 shadow-[0_6px_14px_rgba(55,34,19,0.03)]"
                >
                  <p className="text-[12px] font-semibold leading-5 text-[#2a211b] break-words">
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
      <div id="menu-item-overview" className="scroll-mt-6 rounded-[24px] border border-[#eaded3] bg-[linear-gradient(135deg,#fffdfb_0%,#fff6ef_52%,#fffdf9_100%)] p-3 shadow-[0_12px_28px_rgba(55,34,19,0.04)] sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#menu-item-overview"
                className="rounded-full bg-[#fff1e8] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#c56535] transition hover:bg-[#ffe4d3] focus:outline-none focus:ring-2 focus:ring-[#cf6e38]/35"
              >
                {cuisineBadge}
              </a>
              <a
                href="#menu-included-details"
                className="rounded-full border border-[#ead9cd] bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#79675c] transition hover:border-[#cf6e38] hover:text-[#cf6e38] focus:outline-none focus:ring-2 focus:ring-[#cf6e38]/35"
              >
                {t("menu.menuDetails")}
              </a>
            </div>

            <h1 className="mt-2 text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#17120f] sm:text-[34px]">
              {menuItem.modal.heading}
            </h1>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[#111111] shadow-[0_8px_16px_rgba(39,24,13,0.05)]">
              <LiaBicycleSolid className="text-[15px] text-[#cf6e38]" />
              <span>{vendor.name}</span>
            </div>

            <p className="mt-3 max-w-3xl text-[12px] leading-5 text-[#564b43] sm:text-[13px] sm:leading-6">
              {description}
            </p>
          </div>

          <div className="w-full max-w-[280px] rounded-[18px] border border-[#f0ddd1] bg-white p-3 shadow-[0_12px_22px_rgba(39,24,13,0.05)]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#b48062]">
              {t("menu.startingFrom")}
            </p>
            <div className="mt-1 flex items-end gap-1.5">
              <p className="text-[25px] font-semibold leading-none tracking-[-0.05em] text-[#17120f]">
                NOK {unitPrice.toFixed(2)}
              </p>
              <p className="pb-0.5 text-[10px] font-medium text-[#796b61]">
                {priceLabel}
              </p>
            </div>
            <div className="mt-2 grid gap-2">
              <div className="rounded-[14px] bg-[#faf4ee] px-3 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.10em] text-[#a48370]">
                  {t("menu.minimumOrder")}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-[#221b17]">
                  {t("menu.persons", { count: minimumPersons })}
                </p>
              </div>
              <div className="rounded-[14px] bg-[#faf4ee] px-3 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.10em] text-[#a48370]">
                  {t("menu.deliveryStyle")}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-[#221b17]">
                  {t("menu.deliveryStyleValue")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2.5 md:grid-cols-3">
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

      <div className="mt-3">
        <TimingPanel entries={timingEntries} />
      </div>

    </>
  );
}
