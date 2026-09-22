import VendorSummaryCard from "./summary/VendorSummaryCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatCurrency,
  getCheckoutTotals,
} from "./summary/checkoutSummaryUtils";

export default function CheckoutSummaryPanel({
  carts,
  canPlaceOrder = true,
  buttonLabel = "Place Order",
  buttonHelpText = "",
  isSubmitting = false,
  isLoadingPricing = false,
  onTipChange,
  onRemoveItem,
  onPlaceOrder,
}) {
  const { t } = useTranslation();
  const totals = getCheckoutTotals(carts);
  const grandTotal = totals.grandTotal;
  const includedVat = totals.salesTax;

  return (
    <aside className="min-w-0 bg-[#fcfaf7] lg:border-l lg:border-[#eee7e0]">
      <div className="sticky top-4 p-3 sm:p-4">
        <div className="rounded-[18px] bg-white p-3 shadow-[0_12px_28px_rgba(31,21,13,0.06)]">
          <div className="mb-3 rounded-[14px] bg-[#cf6e38] px-3 py-2.5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
              {t("checkout.summary")}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium text-[#5b6f58]">
                {t("checkout.currentTotal")}
              </span>
              <span className="text-[21px] font-semibold leading-none text-white">
                {formatCurrency(grandTotal)}
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
              />
            ))}
          </div>
          <div className="mt-3 rounded-[10px] border border-[#d9ead7] bg-[#f6fff5] px-3 py-2.5 text-[#1d1d1d]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f7a3e]">
                  {t("checkout.totalToPay")}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-[#5b6f58]">
                  {t("checkout.finalAmountShown")}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[22px] font-semibold leading-none">
                  {formatCurrency(grandTotal)}
                </span>
                <p className="mt-1 text-[10px] font-semibold leading-4 text-[#2f7a3e]">
                  {t("checkout.vatIncluded", { defaultValue: "VAT included" })}: {formatCurrency(includedVat)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 border-t border-[#eee7e0] pt-3">
            <p className="text-[11px] leading-4 text-[#8b8580]">
              {t("checkout.agreePrefix")}{" "}
              <Link
                to="/terms-and-conditions"
                className="font-semibold text-[#c85f33]"
              >
                {t("footer.terms")}
              </Link>{" "}
              {t("checkout.and")}{" "}
              <Link
                to="/privacy-policy"
                className="font-semibold text-[#c85f33]"
              >
                {t("footer.privacy")}
              </Link>{" "}
              {t("checkout.agreeSuffix")}
            </p>
            <button
              type="button"
              onClick={onPlaceOrder}
              disabled={isSubmitting || !canPlaceOrder}
              className="mt-3 w-full rounded-[10px] bg-[#cf6e38] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#bb602d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buttonLabel}
            </button>
            {buttonHelpText ? (
              <p className="mt-2 text-center text-[12px] text-[#8b8580]">
                {buttonHelpText}
              </p>
            ) : null}
            {isLoadingPricing ? (
              <p className="mt-2 text-center text-[12px] text-[#8b8580]">
                {t("checkout.updatingTotals")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
