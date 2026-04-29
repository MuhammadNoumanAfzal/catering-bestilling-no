import {
  formatCurrency,
  getItemServes,
} from "./checkoutSummary.utils";

export default function OrderItemCard({
  item,
  personCount,
  vendorSlug,
  onRemoveItem,
}) {
  return (
    <div className="rounded-[12px] border border-[#eee7df] bg-[#fffdfa] p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-para font-semibold text-[#2c2c2c]">
            {item.quantity} x {item.name}
          </p>
          <p className="mt-1 type-para text-[#8b8580]">
            Serves {getItemServes(item, personCount)}
          </p>
        </div>

        <div className="text-right">
          <p className="type-para font-semibold text-[#252525]">
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
        <ul className="mt-2 space-y-1 text-[14px] leading-4 text-[#8b8580]">
          {item.details.map((detail) => (
            <li key={detail}>- {detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
