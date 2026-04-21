import { Link } from "react-router-dom";
import TablewareModal, {
  getSelectedTablewareCount,
  getTablewareSummaryText,
} from "../../../components/shared/TablewareModal";
import { useState } from "react";
import { FiPackage, FiShoppingBag, FiTruck } from "react-icons/fi";

const TIP_OPTIONS = [
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
  { label: "Other", value: "other" },
];
const SALES_TAX_RATE = 0.15;

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

function getItemServes(item, personCount) {
  const baseServes = Number(item.totalServes ?? item.serves ?? 0);
  return Math.max(baseServes, Number(personCount ?? 0) || 0);
}

function getItemPrice(item, personCount) {
  const unitPrice = Number(item.unitPrice ?? 0);

  if (unitPrice > 0) {
    return unitPrice * getItemServes(item, personCount);
  }

  return Number(item.price ?? 0);
}

function sortSummaryItems(items) {
  return [...items].sort((left, right) => {
    if (left.isAddOn === right.isAddOn) {
      return 0;
    }

    return left.isAddOn ? 1 : -1;
  });
}

function IncludedTablewareRow({ tableware, onEdit }) {
  const selectedCount = getSelectedTablewareCount(tableware);
  const summaryText = getTablewareSummaryText(tableware);

  return (
    <div className="rounded-[10px] border border-[#eee7df] bg-[#faf8f5] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1ea] text-[#d46331]">
            <FiPackage className="text-[14px]" />
          </div>
          <div>
            <p className="type-para font-semibold text-[#252525]">
              {selectedCount} Tableware
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[#8b8580]">
              {summaryText}
            </p>
          </div>
        </div>

        <p className="type-para font-semibold text-[#252525]">$0.00</p>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="type-para cursor-pointer text-[#4f7cff]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function VendorSummaryCard({
  cart,
  onTipChange,
  onRemoveItem,
  onTablewareChange,
}) {
  const [isTablewareModalOpen, setIsTablewareModalOpen] = useState(false);
  const items = sortSummaryItems(cart.orderSummary.items).map((item) => ({
    ...item,
    effectivePrice: getItemPrice(item, cart.orderSummary.personCount),
  }));
  const subtotal = items.reduce(
    (total, item) => total + item.effectivePrice,
    0,
  );
  const deliveryFee = extractAmount(cart.vendor.deliveryFee);
  const salesTax = subtotal * SALES_TAX_RATE;
  const tipValue = getTipValue(cart.orderSummary, subtotal);

  return (
    <section className="rounded-[18px] border border-[#e7dfd7] bg-white p-4 shadow-[0_10px_30px_rgba(45,31,20,0.08)]">
      <div className="rounded-[14px] bg-[linear-gradient(135deg,#fdf7f1_0%,#f6efe8_100%)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="type-h4 font-semibold uppercase tracking-[0.16em] text-[#b77a57]">
              Vendor
            </p>
            <p className="mt-1 type-h4 font-semibold leading-tight text-[#2c2c2c]">
              {cart.vendor.name}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#d46331] shadow-[0_6px_14px_rgba(212,99,49,0.14)]">
            <FiShoppingBag className="text-[18px]" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="type-h5 font-semibold text-[#2c2c2c]">
              Order items
            </p>
            <p className="mt-1 text-[12px] text-[#8b8580]">
              Review everything before placing the order
            </p>
          </div>

          <Link
            to={`/vendor/${cart.vendor.slug}`}
            className="cursor-pointer text-[14px] font-semibold text-[#cf6e38]"
          >
            Edit Cart
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[12px] border border-[#eee7df] bg-[#fffdfa] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="type-para font-semibold text-[#2c2c2c]">
                    {item.quantity} x {item.name}
                  </p>
                  <p className="mt-1 type-para text-[#8b8580]">
                    Serves {getItemServes(item, cart.orderSummary.personCount)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="type-para font-semibold text-[#252525]">
                    ${formatCurrency(item.effectivePrice)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(cart.vendor.slug, item.id)}
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
          ))}

          <IncludedTablewareRow
            tableware={cart.orderSummary.tableware}
            onEdit={() => setIsTablewareModalOpen(true)}
          />
        </div>

        <div className="mt-4 rounded-[14px] border border-[#eee7df] bg-[#fcfaf7] p-4">
          <div className="flex items-center gap-2 text-[#2c2c2c]">
            <FiTruck className="text-[15px] text-[#d46331]" />
            <p className="type-h4 font-semibold">Price details</p>
          </div>

          <div className="mt-3 space-y-2 text-[14px] text-[#2c2c2c]">
            <div className="flex items-center justify-between gap-3">
              <span>Food &amp; beverage</span>
              <span className="font-semibold">${formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Restaurant delivery fee</span>
              <span className="font-semibold">
                ${formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Sales Tax</span>
              <span className="font-semibold">${formatCurrency(salesTax)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Tip</span>
              <span className="font-semibold">${formatCurrency(tipValue)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9a8f83]">
            Add a tip
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {TIP_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onTipChange(cart.vendor.slug, option.value)}
                className={`min-w-[60px] cursor-pointer rounded-full border px-3 py-2 text-[13px] font-semibold transition ${
                  cart.orderSummary.tipRate === option.value
                    ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                    : "border-[#ddd5cc] bg-white text-[#4f4a45]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TablewareModal
        isOpen={isTablewareModalOpen}
        initialValue={cart.orderSummary.tableware}
        onClose={() => setIsTablewareModalOpen(false)}
        onSave={(tableware) => {
          onTablewareChange(cart.vendor.slug, tableware);
          setIsTablewareModalOpen(false);
        }}
      />
    </section>
  );
}

export default function CheckoutSummaryPanel({
  carts,
  onTipChange,
  onRemoveItem,
  onTablewareChange,
  onPlaceOrder,
}) {
  const totals = carts.reduce(
    (accumulator, cart) => {
      const subtotal = cart.orderSummary.items.reduce(
        (sum, item) => sum + getItemPrice(item, cart.orderSummary.personCount),
        0,
      );
      const deliveryFee = extractAmount(cart.vendor.deliveryFee);
      const salesTax = subtotal * SALES_TAX_RATE;
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
