import { useTranslation } from "react-i18next";
import {
  formatCurrency,
  getItemServes,
} from "./checkoutSummaryUtils";

export default function OrderItemCard({
  item,
  personCount,
  vendorSlug,
  onRemoveItem,
}) {
  const { t } = useTranslation();
  const filteredDetails = (item.details ?? []).filter(
    (detail) =>
      detail &&
      !/^\d+\s*order/i.test(detail) &&
      !/^(serves|serverer|holder til)/i.test(detail),
  );

  return (
    <div className="rounded-[10px] bg-[#fffdfa] p-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#2c2c2c]">
            {item.quantity} x {item.name}
          </p>
          <p className="mt-0.5 text-[12px] text-[#8b8580]">
            {item.isAddOn
              ? t("vendor.qty", { count: item.quantity })
              : t("vendor.serves", { count: getItemServes(item, personCount) })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[13px] font-semibold text-[#252525]">
            {formatCurrency(item.effectivePrice)}
          </p>
          <button
            type="button"
            onClick={() => onRemoveItem(vendorSlug, item.id)}
            className="mt-1 cursor-pointer text-[12px] font-medium text-[#cf6e38]"
          >
            {t("vendor.deleteItem")}
          </button>
        </div>
      </div>

      {filteredDetails.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5 text-[12px] leading-4 text-[#8b8580]">
          {filteredDetails.map((detail) => (
            <li key={detail}>- {detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
