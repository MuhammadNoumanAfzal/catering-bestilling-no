import { FiTruck } from "react-icons/fi";
import { formatCurrency } from "./checkoutSummaryUtils";
import { useTranslation } from "react-i18next";

export default function PriceDetailsCard({
  subtotal,
  deliveryFee,
  salesTax,
  pricesIncludeVat = true,
  addOnsTotal,
  tipValue,
  discountAmount,
  serviceFee,
}) {
  const { t } = useTranslation();
  return (
    <div className="mt-3 border-t border-[#eee7e0] pt-3">
      <div className="flex items-center gap-2 text-[#2c2c2c]">
        <FiTruck className="text-[15px] text-[#d46331]" />
        <p className="text-[14px] font-semibold">{t("checkout.priceDetails")}</p>
      </div>

      <div className="mt-2 space-y-1.5 text-[12px] text-[#2c2c2c]">
        <div className="flex items-center justify-between gap-3">
          <span>{pricesIncludeVat ? t("checkout.subtotalVatIncluded", { defaultValue: "Subtotal (VAT included)" }) : t("checkout.subtotal")}</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>{t("checkout.deliveryFee")}</span>
          <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
        </div>
        {addOnsTotal > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span>{t("checkout.addOns")}</span>
            <span className="font-semibold">{formatCurrency(addOnsTotal)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span>{t("checkout.tip")}</span>
          <span className="font-semibold">{formatCurrency(tipValue)}</span>
        </div>
        {serviceFee > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span>{t("checkout.serviceFee")}</span>
            <span className="font-semibold">{formatCurrency(serviceFee)}</span>
          </div>
        ) : null}
        {discountAmount > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span>{t("checkout.discount")}</span>
            <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
