import VendorSummaryCard from "./summary/VendorSummaryCard";
import {
  formatCurrency,
  getCheckoutTotals,
} from "./summary/checkoutSummary.utils";

export default function CheckoutSummaryPanel({
  carts,
  onTipChange,
  onRemoveItem,
  onTablewareChange,
  onPlaceOrder,
}) {
  const totals = getCheckoutTotals(carts);

  const grandTotal =
    totals.subtotal + totals.deliveryFee + totals.salesTax + totals.tip;

  return (
    <aside className="min-w-0 border-l border-[#d8d2ca] bg-[#f7f5f2]">
      <div className="sticky top-4">
        <div className="rounded-[22px] border border-[#e1d8cf] bg-[#f8f5f1] p-3 shadow-[0_18px_40px_rgba(31,21,13,0.08)]">
          <div className="mb-3 rounded-[16px] bg-[#cf6e38] px-4 py-3 text-white">
            <p className="type-para font-semibold uppercase tracking-[0.16em] text-white/80">
              Checkout summary
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="type-para font-medium text-white/85">
                Current total
              </span>
              <span className="text-[24px] font-semibold leading-none text-white">
                ${formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {carts.map((cart) => (
              <VendorSummaryCard
                key={cart.vendor.slug}
                cart={cart}
                onTipChange={onTipChange}
                onRemoveItem={onRemoveItem}
                onTablewareChange={onTablewareChange}
              />
            ))}
          </div>

          <div className="mt-3 rounded-[16px] bg-[#cf6e38] px-4 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="type-para font-semibold uppercase tracking-[0.12em] text-white/70">
                  Grand total
                </p>
                <p className="mt-1 type-subpara text-white/85">
                  Includes delivery, tax, and tip
                </p>
              </div>

              <span className="text-[26px] font-semibold leading-none">
                ${formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-[16px] border border-[#ead6ca] bg-white px-4 py-4">
            <p className="type-subpara text-[#8b8580]">
              I agree to the Terms &amp; Conditions and complete payment for
              this order.
            </p>
            <button
              type="button"
              onClick={onPlaceOrder}
              className="type-h5 mt-3 w-full cursor-pointer rounded-[6px] bg-[#cf6e38] px-4 py-3 text-white transition hover:bg-[#bb602d]"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
