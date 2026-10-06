import { useTranslation } from "react-i18next";

function formatNorwegianDate(value, locale = "nb-NO") {
  const normalized = `${value ?? ""}`.trim();

  if (!normalized) {
    return "";
  }

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(normalized)
    ? new Date(`${normalized}T00:00:00`)
    : new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function buildFullAddress(orderPreview) {
  return [
    orderPreview.address,
    orderPreview.addressLine2,
    [orderPreview.postalCode, orderPreview.city].filter(Boolean).join(" "),
  ]
    .map((part) => `${part ?? ""}`.trim())
    .filter(Boolean)
    .join(", ");
}

export default function OrderDetailsSummary({ orderPreview }) {
  const { t, i18n } = useTranslation();
  const formattedDate = formatNorwegianDate(orderPreview.date, i18n.language?.startsWith("en") ? "en-GB" : "nb-NO");
  const dateTime = [formattedDate, orderPreview.time].filter(Boolean).join(` ${t("orderConfirmed.at")} `);
  const fullAddress = buildFullAddress(orderPreview);
  const details = [
    ["date", dateTime],
    ["personCount", orderPreview.personCount],
    ["address", fullAddress],
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");

  return (
    <div className="mt-3 text-left">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-1 py-2 sm:grid-cols-[1fr_0.7fr_1.3fr]">
        {details.map(([key, value]) => (
          <div key={key} className={key === "address" ? "min-w-0 col-span-2 sm:col-span-1" : "min-w-0"}>
            <dt className="text-[11px] font-medium text-[#938174]">{t(`orderConfirmed.${key}`)}</dt>
            <dd className="mt-1 break-words text-[13px] font-semibold text-[#201b17]">{value}</dd>
          </div>
        ))}
      </dl>
      {orderPreview.amountDue ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#fff3e9] px-4 py-3">
          <span className="text-[12px] font-semibold text-[#855b3c]">{t("orderConfirmed.amountDue")}</span>
          <strong className="text-[21px] tracking-tight text-[#2b2018]">{orderPreview.amountDue}</strong>
        </div>
      ) : null}
    </div>
  );
}