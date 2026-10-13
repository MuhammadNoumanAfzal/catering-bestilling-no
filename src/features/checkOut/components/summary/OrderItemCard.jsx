import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  formatCurrency,
  getItemServes,
} from "./checkoutSummaryUtils";

export default function OrderItemCard({
  item,
  personCount,
  vendorSlug,
  onRemoveItem,
  onAddOnQuantityChange,
}) {
  const { t } = useTranslation();
  const [quantityDraft, setQuantityDraft] = useState(String(item.quantity));
  useEffect(() => setQuantityDraft(String(item.quantity)), [item.quantity]);
  function commitQuantity(value) {
    const parsed = Number.parseInt(value, 10);
    const quantity = Number.isSafeInteger(parsed) ? Math.max(0, parsed) : item.quantity;
    setQuantityDraft(String(quantity));
    onAddOnQuantityChange(vendorSlug, item.id, quantity);
  }
  const filteredDetails = (item.details ?? []).filter(
    (detail) =>
      detail &&
      !/^\d+\s*order/i.test(detail) &&
      !/^qty\s*:/i.test(detail) &&
      !/^add[- ]on item\s*$/i.test(detail) &&
      !/^(serves|serverer|holder til)/i.test(detail),
  );

  return (
    <div className="rounded-[10px] bg-[#fffdfa] p-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#2c2c2c]">
            {item.name}
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

      {item.isAddOn && onAddOnQuantityChange ? (
        <div className="mt-2 inline-flex h-8 items-center rounded-[8px] border border-[#ded6ce] bg-white">
          <button type="button" aria-label={`${item.name} -`} onClick={() => commitQuantity(item.quantity - 1)} className="h-full w-8 border-r border-[#ded6ce] text-[#555]">-</button>
          <input
            type="number" inputMode="numeric" min="0" step="1" aria-label={item.name}
            value={quantityDraft}
            onChange={(event) => {
              if (/^\d*$/.test(event.target.value)) setQuantityDraft(event.target.value);
            }}
            onBlur={(event) => commitQuantity(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); }
            }}
            className="h-full w-16 min-w-0 bg-transparent px-1 text-center text-[13px] outline-none focus:bg-[#fff4ed]"
          />
          <button type="button" aria-label={`${item.name} +`} onClick={() => commitQuantity(item.quantity + 1)} className="h-full w-8 border-l border-[#ded6ce] text-[#cf6e38]">+</button>
        </div>
      ) : null}

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
