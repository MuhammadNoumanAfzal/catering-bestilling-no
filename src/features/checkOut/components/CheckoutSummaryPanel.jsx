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
    <aside className="min-w-0 border-l border-[#d8d2ca] bg-[#f7f5f2]">
      <div className="sticky top-4">
        <div className="rounded-[22px] border border-[#e1d8cf] bg-[#f8f5f1] p-3 shadow-[0_18px_40px_rgba(31,21,13,0.08)]">
          <div className="mb-3 rounded-[16px] bg-[#cf6e38] px-4 py-3 text-white">
            <p className="type-para font-semibold uppercase tracking-[0.16em] text-white/80">
              {t("checkout.summary")}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="type-para font-medium text-white/85">
                {t("checkout.currentTotal")}
              </span>
              <span className="text-[24px] font-semibold leading-none text-white">
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

          <div className="mt-3 rounded-[16px] bg-[#cf6e38] px-4 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="type-para font-semibold uppercase tracking-[0.12em] text-white/70">
                  {t("checkout.totalToPay")}
                </p>
                <p className="mt-1 type-subpara text-white/85">
                  {t("checkout.finalAmountShown")}
                </p>
              </div>

              <span className="text-[26px] font-semibold leading-none">
                NOK {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-[16px] border border-[#ead6ca] bg-white px-4 py-4">
            <p className="type-subpara text-[#8b8580]">
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
              className="type-h5 mt-3 w-full rounded-[6px] bg-[#cf6e38] px-4 py-3 text-white transition hover:bg-[#bb602d] disabled:cursor-not-allowed disabled:opacity-60"
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
