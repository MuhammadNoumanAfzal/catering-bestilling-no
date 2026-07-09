import { FiTruck } from "react-icons/fi";
import { formatCurrency } from "./checkoutSummaryUtils";

export default function PriceDetailsCard({
  subtotal,
  deliveryFee,
  salesTax,
  addOnsTotal,
  tipValue,
  discountAmount,
  serviceFee,
}) {
  return (
    <div className="mt-4 rounded-[14px] border border-[#eee7df] bg-[#fcfaf7] p-4">
      <div className="flex items-center gap-2 text-[#2c2c2c]">
        <FiTruck className="text-[15px] text-[#d46331]" />
        <p className="type-h4 font-semibold">Price details</p>
      </div>

      <div className="mt-3 space-y-2 text-[14px] text-[#2c2c2c]">
        <div className="flex items-center justify-between gap-3">
          <span>Food &amp; beverage</span>
          <span className="font-semibold">NOK {formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Restaurant delivery fee</span>
          <span className="font-semibold">NOK {formatCurrency(deliveryFee)}</span>
        </div>
        {addOnsTotal > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span>Add-ons</span>
            <span className="font-semibold">NOK {formatCurrency(addOnsTotal)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span>Sales Tax</span>
          <span className="font-semibold">NOK {formatCurrency(salesTax)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Tip</span>
          <span className="font-semibold">NOK {formatCurrency(tipValue)}</span>
        </div>
        {serviceFee > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span>Service fee</span>
            <span className="font-semibold">NOK {formatCurrency(serviceFee)}</span>
          </div>
        ) : null}
        {discountAmount > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span>Discount</span>
            <span className="font-semibold">-NOK {formatCurrency(discountAmount)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
