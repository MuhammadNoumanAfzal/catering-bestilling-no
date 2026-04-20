import { LuUtensilsCrossed } from "react-icons/lu";

const TIP_OPTIONS = [
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
  { label: "Other", value: "other" },
];

function formatCurrency(value) {
  return Number(value).toFixed(2);
}

function extractAmount(value) {
  const matched = `${value ?? ""}`.match(/(\d+(?:\.\d+)?)/);
  return matched ? Number(matched[1]) : 0;
}

function formatDateTime(date, time) {
  if (!date) {
    return "";
  }

  const parsed = new Date(`${date}T${time || "00:00"}`);

  if (Number.isNaN(parsed.getTime())) {
    return [date, time].filter(Boolean).join(", ");
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

export default function VendorOrderSidebar({
  vendor,
  orderSummary,
  onRemoveItem,
  onTipChange,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onDeliveryAddressChange,
  onInvoiceAddressChange,
}) {
  const items = orderSummary.items.map((item) => ({
    ...item,
    price: Number(item.price ?? 0),
  }));
  const foodAndBeverage = items.reduce((total, item) => total + item.price, 0);
  const restaurantDeliveryFee = extractAmount(vendor?.deliveryFee);
  const salesTax = foodAndBeverage * 0.15;
  const tipValue =
    typeof orderSummary.tipRate === "number"
      ? foodAndBeverage * orderSummary.tipRate
      : 0;
  const total = foodAndBeverage + restaurantDeliveryFee + salesTax + tipValue;
  const hasItems = items.length > 0;
  const formattedDateTime = formatDateTime(
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
  );
  const restaurantName = vendor?.name ?? items[0]?.vendorName ?? "Selected restaurant";

  return (
    <aside className="rounded-none border-l border-[#e7dfd6] bg-[#fdfbf8]">
      <div className="sticky top-[84px] p-2 sm:p-3">
        {!hasItems ? (
          <div className="flex min-h-[720px] flex-col items-center justify-center text-center">
            <LuUtensilsCrossed className="text-[64px] text-[#9d9d9d]" />
            <p className="mt-4 text-[16px] font-semibold text-[#1f1f1f]">
              Add items to your cart
            </p>
          </div>
        ) : (
          <div className="border border-[#d8d2ca] bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <h2 className="text-center text-[20px] font-extrabold uppercase tracking-[0.04em] text-[#1d1d1d]">
              Order Summary
            </h2>

            <div className="mt-3 border-t border-[#ddd6cf] pt-3">
              {items.map((item) => (
                <div key={item.id} className="border-b border-[#e2ddd8] pb-4 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-medium leading-5 text-[#252525]">
                      {item.quantity} {item.name}
                    </p>
                    <p className="shrink-0 text-[14px] font-semibold text-[#252525]">
                      ${formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    {(item.details ?? []).map((detail) => (
                      <p
                        key={detail}
                        className="text-[12px] font-medium leading-5 text-[#8b8580]"
                      >
                        - {detail}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[13px] text-[#76706a]">
                      Serves {item.totalServes ?? item.serves ?? orderSummary.personCount}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="cursor-pointer text-[13px] font-medium text-[#e05b46]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b border-[#e2ddd8] py-4 text-[13px] text-[#4a4a4a]">
              <div className="flex items-center justify-between gap-3">
                <span>Food &amp; beverage</span>
                <span className="font-semibold text-[#252525]">
                  ${formatCurrency(foodAndBeverage)}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#76706a]">{restaurantName}</p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Restaurant delivery fee</span>
                <span className="font-semibold text-[#76706a]">
                  ${formatCurrency(restaurantDeliveryFee)}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#76706a]">This is not a driver tip</p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Sales Tax</span>
                <span className="font-semibold text-[#76706a]">
                  ${formatCurrency(salesTax)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Tip</span>
                <span className="font-semibold text-[#252525]">
                  ${formatCurrency(tipValue)}
                </span>
              </div>
            </div>

            <div className="border-b border-[#e2ddd8] py-4">
              <p className="text-[13px] font-semibold text-[#252525]">Tip</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIP_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => onTipChange(option.value)}
                    className={`rounded-full border px-3 py-1 text-[13px] leading-5 ${
                      orderSummary.tipRate === option.value
                        ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                        : "border-[#d4cfc8] bg-white text-[#555555]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-[#e2ddd8] py-4">
              <h3 className="text-center text-[18px] font-extrabold uppercase tracking-[0.04em] text-[#1d1d1d]">
                Event Details
              </h3>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#252525]">
                  Delivery Date &amp; Time
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onDeliveryDateChange(orderSummary.deliveryDate);
                    onDeliveryTimeChange(orderSummary.deliveryTime);
                  }}
                  className="mt-2 w-full border border-[#ddd6cf] px-3 py-3 text-left text-[14px] text-[#66605b]"
                >
                  {formattedDateTime}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#252525]">Person Count</p>
                <div className="mt-2 inline-flex items-center border border-[#d7d1ca] text-[14px] text-[#3a3a3a]">
                  <button
                    type="button"
                    onClick={() =>
                      onPersonCountChange(Math.max(1, orderSummary.personCount - 1))
                    }
                    className="h-8 w-8 border-r border-[#d7d1ca]"
                  >
                    -
                  </button>
                  <span className="inline-flex min-w-[40px] justify-center px-3">
                    {orderSummary.personCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => onPersonCountChange(orderSummary.personCount + 1)}
                    className="h-8 w-8 border-l border-[#d7d1ca]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center text-[13px] text-[#55514d]">
                <p>Location: {orderSummary.deliveryAddress}</p>
              </div>
            </div>

            <div className="pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#252525]">Total</span>
                <span className="text-[18px] font-semibold text-[#252525]">
                  ${formatCurrency(total)}
                </span>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-[4px] bg-[#cf6e38] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#bb602d]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
