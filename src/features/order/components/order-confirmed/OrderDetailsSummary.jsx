import { useTranslation } from "react-i18next";

export default function OrderDetailsSummary({ orderPreview }) {
  const { t } = useTranslation();
  const details = [
    ["date", [orderPreview.date, orderPreview.time].filter(Boolean).join(` ${t("orderConfirmed.at")} `)],
    ["personCount", orderPreview.personCount],
    ["address", orderPreview.address],
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
