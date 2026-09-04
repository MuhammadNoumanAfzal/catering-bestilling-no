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

  return (
    <aside className="min-w-0 bg-[#fcfaf7] lg:border-l lg:border-[#eee7e0]">
      <div className="sticky top-4 p-3 sm:p-4">
        <div className="rounded-[18px] bg-white p-3 shadow-[0_12px_28px_rgba(31,21,13,0.06)]">
          <div className="mb-3 rounded-[14px] bg-[#cf6e38] px-3 py-2.5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
              {t("checkout.summary")}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium text-white/85">
                {t("checkout.currentTotal")}
              </span>
              <span className="text-[21px] font-semibold leading-none text-white">
                NOK {formatCurrency(grandTotal)}
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

          <div className="mt-3 rounded-[14px] bg-[#cf6e38] px-3 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  {t("checkout.totalToPay")}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-white/85">
                  {t("checkout.finalAmountShown")}
                </p>
              </div>

              <span className="text-[22px] font-semibold leading-none">
                NOK {formatCurrency(grandTotal)}
              </span>
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
