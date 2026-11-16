import RichDescription from "../../../components/shared/RichDescription";
import { useState } from "react";
import { formatMoney } from "../../pricing/formatMoney.js";
import {
  FiClock,
  FiMapPin,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";

const DAY_INDEX_BY_KEY = {
  0: 0,
  su: 0,
  sun: 0,
  sunday: 0,
  1: 1,
  mo: 1,
  mon: 1,
  monday: 1,
  2: 2,
  tu: 2,
  tue: 2,
  tuesday: 2,
  3: 3,
  we: 3,
  wed: 3,
  wednesday: 3,
  4: 4,
  th: 4,
  thu: 4,
  thursday: 4,
  5: 5,
  fr: 5,
  fri: 5,
  friday: 5,
  6: 6,
  sa: 6,
  sat: 6,
  saturday: 6,
};

const DELIVERY_DAY_ORDER = { mo: 0, mon: 0, monday: 0, 1: 0, tu: 1, tue: 1, tuesday: 1, 2: 1, we: 2, wed: 2, wednesday: 2, 3: 2, th: 3, thu: 3, thursday: 3, 4: 3, fr: 4, fri: 4, friday: 4, 5: 4, sa: 5, sat: 5, saturday: 5, 6: 5, su: 6, sun: 6, sunday: 6, 0: 6 };

function formatDayLabel(day, locale) {
  const key = `${day ?? ""}`.trim().toLowerCase();
  const dayIndex = DAY_INDEX_BY_KEY[key];

  if (dayIndex === undefined) {
    return `${day ?? ""}`.trim();
  }

  const label = new Intl.DateTimeFormat(locale, { weekday: "short" })
    .format(new Date(2024, 5, 2 + dayIndex))
    .replace(/\.$/, "");

  return label ? label.charAt(0).toUpperCase() + label.slice(1) : "";
}

function normalizeTimingEntries(vendor, locale) {
  const rawSlots = Array.isArray(vendor?.availability?.delivery?.slots)
    ? vendor.availability.delivery.slots
    : [];

  const slotEntries = rawSlots
    .map((slot) => {
      const dayKey = `${slot?.day ?? ""}`.trim().toLowerCase();
      const dayLabel = formatDayLabel(slot?.day, locale);
      const start = `${slot?.start ?? ""}`.trim();
      const end = `${slot?.end ?? ""}`.trim();

      if (!dayLabel || !start || !end) {
        return null;
      }

      return {
        label: `${dayLabel} ${start}-${end}`,
        day: dayLabel,
        time: `${start}\u2013${end}`,
        order: DELIVERY_DAY_ORDER[dayKey] ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .filter(Boolean);

  if (slotEntries.length > 0) {
    return [...new Map(slotEntries.map((entry) => [entry.label, entry])).values()]
      .sort((left, right) => left.order - right.order || left.label.localeCompare(right.label))
      .map((entry) => ({...entry, key: String(entry.order)}));
  }

  const fallbackLabel = `${vendor?.availability?.delivery?.label ?? ""}`.trim();
  return fallbackLabel ? [{key:"fallback",label:fallbackLabel,day:"",time:fallbackLabel}] : [];
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
  const [focusedDay, setFocusedDay] = useState("");
  const days = [...new Map(entries.map(entry => [entry.key, {key:entry.key,label:entry.day}])).values()];
  const selectedDay = days.some(day=>day.key===focusedDay) ? focusedDay : days[0]?.key;
  const slots = entries.filter(entry=>entry.key===selectedDay);
  return <section className="rounded-[18px] border border-[#e8ddd3] bg-[#fffaf6] p-4 sm:p-5" aria-label={t("menu.deliverySchedule")}>
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e5] text-[#cf6e38]"><FiClock size={19}/></span>
      <div><h3 className="text-[18px] font-semibold text-[#17120f]">{t("menu.deliverySchedule")}</h3><p className="mt-1 text-[12px] leading-5 text-[#77685e]">{t("menu.deliveryScheduleDesc")}</p></div>
    </div>
    {entries.length ? <div className="mt-4">
      {days[0]?.label ? <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={t("menu.deliverySchedule")}>
        {days.map(day=><button type="button" key={day.key} aria-pressed={selectedDay===day.key} onClick={()=>setFocusedDay(day.key)} className={"min-h-10 min-w-12 rounded-xl border px-3 py-2 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cf6e38] "+(selectedDay===day.key?"border-[#cf6e38] bg-[#cf6e38] text-white":"border-[#e7dcd2] bg-white text-[#66584d] hover:border-[#cf6e38]")}>{day.label}</button>)}
      </div>:null}
      <div className="grid max-h-[240px] grid-cols-2 gap-2 overflow-y-auto overscroll-contain p-1 sm:grid-cols-3" role="list">
        {slots.map(entry=><div key={entry.label} role="listitem" className="rounded-[10px] border border-[#eadfd5] bg-white px-3 py-2.5 text-center text-[13px] font-medium tabular-nums text-[#46372b]">{entry.time}</div>)}
      </div>
    </div>:<p className="mt-4 rounded-xl border border-dashed border-[#e1d4c7] bg-white p-4 text-[13px] text-[#77685e]">{t("menu.deliveryScheduleUnavailable")}</p>}
  </section>;
}

export default function MenuOverviewSection({ vendor, menuItem }) {
  const { t, i18n } = useTranslation();
  const rawPriceLabel = menuItem.modal?.priceLabel ?? menuItem?.pricingType ?? "per-person";
  const unitPrice = Number(
    menuItem.modal?.unitPrice ?? menuItem.modal?.pricePerPerson ?? menuItem.price ?? 0,
  );
  const normalizedPriceLabel = `${rawPriceLabel}`.trim().toLowerCase();
  const priceLabel = ["per person", "per-person", "per_person"].includes(normalizedPriceLabel)
    ? t("menu.perPerson", { defaultValue: "pr. person" })
    : rawPriceLabel;
const formattedUnitPrice = formatMoney(unitPrice);
  const priceText = formattedUnitPrice;
  const minimumPersons = Number(menuItem?.serves ?? 1);
  const description =
    menuItem.description ||
    "A curated catering option prepared for dependable delivery and easy team ordering.";
  const locale = /^(nb|nn|no)/i.test(i18n.language || "") ? "nb-NO" : "en-GB";
  const timingEntries = normalizeTimingEntries(vendor, locale);
  const vendorLocationText = vendor.addressLine || vendor.city || t("menu.notAvailable");

  return (
    <>
      <div id="menu-item-overview" className="scroll-mt-6 rounded-[24px] border border-[#eaded3] bg-[linear-gradient(135deg,#fffdfb_0%,#fff6ef_52%,#fffdf9_100%)] p-3 shadow-[0_12px_28px_rgba(55,34,19,0.04)] sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#menu-item-overview"
                className="rounded-full bg-[#fff1e8] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#c56535] transition hover:bg-[#ffe4d3] focus:outline-none focus:ring-2 focus:ring-[#cf6e38]/35"
              >
                {t("menu.menuItem")}
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

            
          </div>

          <div className="w-full shrink-0 xl:max-w-[240px] rounded-[18px] border border-[#f0ddd1] bg-white p-3 shadow-[0_12px_22px_rgba(39,24,13,0.05)]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#b48062]">
              {t("menu.startingFrom")}
            </p>
            <div className="mt-1 flex items-end gap-1.5">
              <p className="text-[25px] font-semibold leading-none tracking-[-0.05em] text-[#17120f]">
                {priceText}
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
            </div>
          </div>
        </div>
        <div className="product-description-panel">
          <RichDescription menuLayout className="product-description-copy" value={description} />
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
          value={vendorLocationText}
          subvalue=""
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
