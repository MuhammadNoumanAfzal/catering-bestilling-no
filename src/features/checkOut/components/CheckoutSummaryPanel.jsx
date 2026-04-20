import { Link } from "react-router-dom";

const TIP_OPTIONS = [
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
  { label: "Other", value: "other" },
];

function formatCurrency(value) {
  return Number(value ?? 0).toFixed(2);
}

function extractAmount(value) {
  const matched = `${value ?? ""}`.match(/(\d+(?:\.\d+)?)/);
  return matched ? Number(matched[1]) : 0;
}

function getTipValue(summary, subtotal) {
  return typeof summary.tipRate === "number" ? subtotal * summary.tipRate : 0;
}

function VendorSummaryCard({ cart, onTipChange, onRemoveItem }) {
  const subtotal = cart.orderSummary.items.reduce(
    (total, item) => total + Number(item.price ?? 0),
    0,
  );
  const deliveryFee = extractAmount(cart.vendor.deliveryFee);
  const salesTax = subtotal * 0.07;
  const tipValue = getTipValue(cart.orderSummary, subtotal);

  return (
    <section className="border-b border-[#d8d2ca] bg-white last:border-b-0">
      <div className="border-b border-[#e6e0d9] bg-[#f1efed] px-4 py-2">
        <p className="type-h5 text-center text-[#2c2c2c]">{cart.vendor.name}</p>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="type-subpara text-[#2c2c2c]">Cart item</p>
          <Link
            to={`/vendor/${cart.vendor.slug}`}
            className="type-subpara cursor-pointer text-[#d46331]"
          >
            Edit Cart
          </Link>
        </div>

        <div className="mt-3 border-l-2 border-[#c8c0b7] pl-3">
          {cart.orderSummary.items.map((item) => (
            <div key={item.id} className="pb-3 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <p className="type-subpara text-[#5f5a55]">
                  {item.quantity} x {item.name}
                </p>
                <button
                  type="button"
                  onClick={() => onRemoveItem(cart.vendor.slug, item.id)}
                  className="type-subpara cursor-pointer text-[#d46331]"
                >
                  Remove
                </button>
              </div>

              {(item.details ?? []).length > 0 ? (
                <ul className="mt-1 space-y-1 text-[11px] leading-4 text-[#8b8580]">
                  {item.details.map((detail) => (
                    <li key={detail}>- {detail}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="type-subpara text-[#d46331]">Promotions</p>
        </div>

        <div className="type-subpara mt-3 space-y-2 text-[#2c2c2c]">
          <div className="flex items-center justify-between gap-3">
            <span>Food &amp; beverage</span>
            <span className="font-semibold">${formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Restaurant delivery fee</span>
            <span className="font-semibold">${formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>7.0% Sales tax</span>
            <span className="font-semibold">${formatCurrency(salesTax)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Tip</span>
            <span className="font-semibold">${formatCurrency(tipValue)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TIP_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onTipChange(cart.vendor.slug, option.value)}
              className={`type-subpara min-w-[54px] cursor-pointer rounded-[4px] border px-3 py-1.5 transition ${
                cart.orderSummary.tipRate === option.value
                  ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                  : "border-[#d8d2ca] bg-white text-[#4f4a45]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSummaryPanel({
  carts,
  onTipChange,
  onRemoveItem,
}) {
  const totals = carts.reduce(
    (accumulator, cart) => {
      const subtotal = cart.orderSummary.items.reduce(
        (sum, item) => sum + Number(item.price ?? 0),
        0,
      );
      const deliveryFee = extractAmount(cart.vendor.deliveryFee);
      const salesTax = subtotal * 0.07;
      const tipValue = getTipValue(cart.orderSummary, subtotal);

      return {
        subtotal: accumulator.subtotal + subtotal,
        deliveryFee: accumulator.deliveryFee + deliveryFee,
        salesTax: accumulator.salesTax + salesTax,
        tip: accumulator.tip + tipValue,
      };
    },
    { subtotal: 0, deliveryFee: 0, salesTax: 0, tip: 0 },
  );

  const grandTotal =
    totals.subtotal + totals.deliveryFee + totals.salesTax + totals.tip;

  return (
    <aside className="min-w-0 border-l border-[#d8d2ca] bg-[#f7f5f2]">
      <div className="sticky top-4">
        <div className="overflow-hidden border border-[#d8d2ca] bg-white">
          {carts.map((cart) => (
            <VendorSummaryCard
              key={cart.vendor.slug}
              cart={cart}
              onTipChange={onTipChange}
              onRemoveItem={onRemoveItem}
            />
          ))}

        <div className="border-t border-[#d8d2ca] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="type-para font-semibold text-[#2c2c2c]">Total</span>
            <span className="type-h5 text-[#2c2c2c]">
              ${formatCurrency(grandTotal)}
            </span>
          </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
