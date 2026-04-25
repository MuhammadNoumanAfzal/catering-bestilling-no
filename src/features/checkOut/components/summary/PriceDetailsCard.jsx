import { FiTruck } from "react-icons/fi";
import { formatCurrency } from "./checkoutSummary.utils";

export default function PriceDetailsCard({
  subtotal,
  deliveryFee,
  salesTax,
  tipValue,
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
          <span className="font-semibold">${formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Restaurant delivery fee</span>
          <span className="font-semibold">${formatCurrency(deliveryFee)}</span>
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
  );
}
