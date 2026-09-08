import { FiArrowRight, FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderConfirmationActions({ canModify, orderId = "", modifyButtonLabel = "Modify Order", modifyDisabled = false, onModify }) {
  const { t } = useTranslation();
  return (
    <div className="mt-4">
      <div className={`grid grid-cols-2 gap-2 ${canModify ? "sm:grid-cols-3" : ""}`}>
        <Link
          to="/vendor-dashboard/orders"
          state={{ fromOrderConfirmation: true, orderId }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#cf6e38] px-3 py-2 text-[13px] font-semibold text-white hover:bg-[#bb602d]"
        >
          {t("orderConfirmed.viewOrders", { defaultValue: "View orders" })}<FiArrowRight aria-hidden="true" />
        </Link>
        <Link to="/vendor-dashboard/invoices" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e4d5c9] px-3 py-2 text-[13px] font-semibold text-[#5f4b3e] hover:bg-[#fff7f0]">
          {t("orderConfirmed.viewInvoices", { defaultValue: "View invoices" })}
        </Link>
      {canModify ? (
        <button type="button" onClick={onModify} disabled={modifyDisabled} className="col-span-2 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#e4d5c9] bg-white px-3 py-2 text-[13px] font-semibold text-[#5f4b3e] hover:bg-[#fff7f0] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1">
          <FiEdit3 aria-hidden="true" />{modifyButtonLabel}
        </button>
      ) : null}
      </div>
    </div>
  );
}
