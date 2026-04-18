import { FiTrash2 } from "react-icons/fi";
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

export default function VendorOrderSidebar({
  orderSummary,
  onRemoveItem,
  onTipChange,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onDeliveryAddressChange,
  onInvoiceAddressChange,
}) {
  const itemsWithLivePrice = orderSummary.items.map((item) => ({
    ...item,
    price: item.unitPrice ? item.unitPrice * orderSummary.personCount : item.price,
  }));

  const foodAndBeverage = itemsWithLivePrice.reduce(
    (total, item) => total + item.price,
    0,
  );
  const restaurantDeliveryFee = foodAndBeverage;
  const salesTax = 32.83;
  const tipValue =
    typeof orderSummary.tipRate === "number"
      ? foodAndBeverage * orderSummary.tipRate
      : 0;
  const total =
    foodAndBeverage + restaurantDeliveryFee + salesTax + tipValue;
  const hasItems = orderSummary.items.length > 0;

  return (
    <aside className="rounded-none border-l border-[#e7dfd6] bg-[#fffdfb]">
      <div className="sticky top-[84px] p-4">
        {!hasItems ? (
          <div className="flex min-h-[720px] flex-col items-center justify-center text-center">
            <LuUtensilsCrossed className="text-[64px] text-[#9d9d9d]" />
            <p className="mt-4 text-[16px] font-semibold text-[#1f1f1f]">
              Add items to your cart
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-center text-[20px] font-extrabold uppercase text-[#1e1e1e]">
              Order Summary
            </h2>

            <div className="mt-5 space-y-5">
              {itemsWithLivePrice.map((item, index) => (
                <div key={item.id} className="border-b border-[#eee5dc] pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-semibold text-[#1e1e1e]">
                        {index + 1}. {item.name}
                      </p>
                      {item.details.map((detail) => (
                        <p key={detail} className="mt-1 text-[11px] text-[#7c746d]">
                          - {detail}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[13px] font-semibold text-[#1e1e1e]">
                        ${formatCurrency(item.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="cursor-pointer text-[#cf6e38]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <FiTrash2 className="text-[13px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-[#eee5dc] pt-4">
                <div className="space-y-3 text-[12px] text-[#2b2b2b]">
                  <div className="flex items-center justify-between">
                    <span>Food & beverage</span>
                    <span>${formatCurrency(foodAndBeverage)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Restaurant delivery fee</span>
                    <span>${formatCurrency(restaurantDeliveryFee)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>7.0% Sales tax</span>
                    <span>${formatCurrency(salesTax)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tip</span>
                    <span>${formatCurrency(tipValue)}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#eee5dc] pt-4">
                  <p className="text-[11px] font-semibold text-[#2b2b2b]">Tip</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIP_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => onTipChange(option.value)}
                        className={`cursor-pointer rounded-[6px] border px-3 py-1.5 text-[11px] ${
                          orderSummary.tipRate === option.value
                            ? "border-[#cf6e38] bg-[#fff1eb] text-[#cf6e38]"
                            : "border-[#ddd6cd] text-[#3b3b3b]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#eee5dc] pt-5">
                  <p className="text-center text-[18px] font-extrabold uppercase text-[#1e1e1e]">
                    Event Details
                  </p>

                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="text-[11px] font-semibold text-[#2b2b2b]">
                        Delivery Date & Time
                      </p>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <input
                          type="date"
                          value={orderSummary.deliveryDate}
                          onChange={(event) =>
                            onDeliveryDateChange(event.target.value)
                          }
                          className="w-full rounded-[6px] border border-[#ddd6cd] px-3 py-2 text-[12px] text-[#5b5550] outline-none"
                        />
                        <input
                          type="time"
                          value={orderSummary.deliveryTime}
                          onChange={(event) =>
                            onDeliveryTimeChange(event.target.value)
                          }
                          className="w-full rounded-[6px] border border-[#ddd6cd] px-3 py-2 text-[12px] text-[#5b5550] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#2b2b2b]">
                        Person Count
                      </p>
                      <div className="mt-2 inline-flex items-center gap-4 rounded-[6px] border border-[#ddd6cd] px-4 py-2 text-[12px] text-[#5b5550]">
                        <button
                          type="button"
                          onClick={() =>
                            onPersonCountChange(Math.max(1, orderSummary.personCount - 1))
                          }
                          className="cursor-pointer"
                        >
                          -
                        </button>
                        <span>{orderSummary.personCount}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onPersonCountChange(orderSummary.personCount + 1)
                          }
                          className="cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#2b2b2b]">
                        Delivery Address
                      </p>
                      <input
                        type="text"
                        value={orderSummary.deliveryAddress}
                        onChange={(event) =>
                          onDeliveryAddressChange(event.target.value)
                        }
                        className="mt-2 w-full rounded-[6px] border border-[#ddd6cd] px-3 py-2 text-[12px] text-[#5b5550] outline-none"
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#2b2b2b]">
                        Invoice Address
                      </p>
                      <input
                        type="text"
                        value={orderSummary.invoiceAddress}
                        onChange={(event) =>
                          onInvoiceAddressChange(event.target.value)
                        }
                        className="mt-2 w-full rounded-[6px] border border-[#ddd6cd] px-3 py-2 text-[12px] text-[#5b5550] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#eee5dc] pt-4">
                  <span className="text-[14px] font-semibold text-[#1e1e1e]">
                    Total
                  </span>
                  <span className="text-[18px] font-extrabold text-[#1e1e1e]">
                    ${formatCurrency(total)}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-[6px] bg-[#cf6e38] px-4 py-3 text-[14px] font-bold text-white transition hover:bg-[#bb602d]"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
