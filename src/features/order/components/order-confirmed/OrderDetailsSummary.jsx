import { useTranslation } from "react-i18next";

export default function OrderDetailsSummary({ orderPreview }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto mt-5 grid max-w-3xl gap-4 rounded-[20px] border border-[#f0e5db] bg-white p-5 text-left sm:grid-cols-2 xl:grid-cols-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.address")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.address || t("orderConfirmed.notSpecified")}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.date")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {[orderPreview.date, orderPreview.time].filter(Boolean).join(` ${t("orderConfirmed.at")} `) ||
            t("orderConfirmed.notSpecified")}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.personCount")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.personCount}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.deliveryWindow")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.deliveryEstimate || t("orderConfirmed.confirmedByVendor")}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Amount due
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.amountDue || t("orderConfirmed.notSpecified")}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Payment reference
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.paymentReference || orderPreview.invoiceNumber || t("orderConfirmed.notSpecified")}
        </p>
      </div>
      <div className="sm:col-span-2 xl:col-span-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Bank transfer
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.bankDetails?.accountName || "Account details available in Invoices"}
        </p>
        <p className="mt-1 text-sm text-[#6f665f]">
          {orderPreview.bankDetails?.instructions || "Open your invoice to see account number, IBAN, SWIFT, and transfer instructions."}
        </p>
      </div>
    </div>
  );
}
