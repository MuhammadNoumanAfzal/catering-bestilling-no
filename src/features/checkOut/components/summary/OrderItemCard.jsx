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
  return (
    <div className="rounded-[10px] bg-[#fffdfa] p-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#2c2c2c]">
            {item.quantity} x {item.name}
          </p>
          <p className="mt-0.5 text-[12px] text-[#8b8580]">
            {item.isAddOn
              ? `Qty ${item.quantity}`
              : `Serves ${getItemServes(item, personCount)}`}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[13px] font-semibold text-[#252525]">
            NOK {formatCurrency(item.effectivePrice)}
          </p>
          <button
            type="button"
            onClick={() => onRemoveItem(vendorSlug, item.id)}
            className="mt-1 cursor-pointer text-[12px] font-medium text-[#cf6e38]"
          >
            Remove
          </button>
        </div>
      </div>

      {(item.details ?? []).length > 0 ? (
        <ul className="mt-1.5 space-y-0.5 text-[12px] leading-4 text-[#8b8580]">
          {item.details.map((detail) => (
            <li key={detail}>- {detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
