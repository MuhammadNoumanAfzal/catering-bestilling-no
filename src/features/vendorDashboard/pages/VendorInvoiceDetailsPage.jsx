import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceStatusClasses } from "../components/invoices/invoiceUtils";
import {
  clearInvoiceDownloadState,
  clearSelectedInvoiceDetail,
  fetchInvoiceDetail,
  fetchInvoiceDownloadUrl,
} from "../invoicesSlice";

function DetailRow({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#eadfd5] bg-[#fffdfa] px-3 py-3 sm:px-4 sm:py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b8b7f]">
        {label}
      </p>
      <p className="mt-2 text-[15px] font-semibold text-[#1f1f1f] sm:text-[16px]">
        {value}
      </p>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="rounded-[24px] border border-[#ece1d7] bg-[#fffdfa] p-4 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9c897d]">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function VendorInvoiceDetailsPage() {
  const { t } = useTranslation();
  const invoiceDetailsT = (key, options = {}) =>
    t(`vendorPanel.invoices.detailsPage.${key}`, {
      ...options,
      defaultValue: t(`modifyOrder.invoices.detailsPage.${key}`, options),
    });
  const { invoiceId } = useParams();
  const decodedInvoiceId = invoiceId ? decodeURIComponent(invoiceId) : "";
  const dispatch = useDispatch();
  const {
    selectedInvoiceDetail,
    selectedInvoiceDetailStatus,
    selectedInvoiceDetailError,
    downloadStatus,
    downloadError,
  } = useSelector((state) => state.invoices);

  useEffect(() => {
    if (decodedInvoiceId) {
      dispatch(fetchInvoiceDetail(decodedInvoiceId));
    }

    return () => {
      dispatch(clearSelectedInvoiceDetail());
      dispatch(clearInvoiceDownloadState());
    };
  }, [decodedInvoiceId, dispatch]);

  if (selectedInvoiceDetailStatus === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  if (selectedInvoiceDetailStatus === "failed") {
    return (
      <section className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">
          {invoiceDetailsT("loadErrorTitle")}
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {selectedInvoiceDetailError}
        </p>
        <button
          type="button"
          onClick={() => dispatch(fetchInvoiceDetail(decodedInvoiceId))}
          className="mt-5 rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
        >
          {invoiceDetailsT("retry")}
        </button>
      </section>
    );
  }

  if (!selectedInvoiceDetail) {
    return null;
  }

  const invoice = selectedInvoiceDetail;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/vendor-dashboard/invoices"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#cf6e38] transition hover:text-[#b85e2a]"
          >
            <FiArrowLeft className="text-[15px]" />
            {invoiceDetailsT("back")}
          </Link>
          <h1 className="mt-3 type-h2 text-[#191919]">{invoiceDetailsT("title")}</h1>
          <p className="mt-2 type-para text-[#635b53]">
            {invoiceDetailsT("description")}
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            const result = await dispatch(fetchInvoiceDownloadUrl(invoice.id));

            if (
              fetchInvoiceDownloadUrl.fulfilled.match(result) &&
              typeof window !== "undefined"
            ) {
              window.open(result.payload.url, "_blank", "noopener,noreferrer");
            }
          }}
          disabled={downloadStatus === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiDownload className="text-[15px]" />
          {downloadStatus === "loading"
            ? invoiceDetailsT("preparingPdf")
            : invoiceDetailsT("exportPdf")}
        </button>
      </div>

      <section className="rounded-[28px] border border-[#ddd4cb] bg-white p-4 shadow-[0_16px_34px_rgba(28,28,28,0.06)] md:p-6">
        <div className="flex flex-col gap-4 border-b border-[#ece4dc] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#fff1e8] text-[#cf6e38]">
              <FiFileText className="text-[24px]" />
            </div>

            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getInvoiceStatusClasses(invoice.status)}`}
              >
                {invoice.status}
              </span>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#1f1f1f] sm:text-[28px]">
                {invoice.invoiceNumber}
              </h2>
              <p className="mt-2 text-[15px] text-[#685e56]">
                {invoice.order.eventName} for {invoice.vendor.name}
              </p>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#f0ddd1] bg-[#fff7f2] px-4 py-4 text-left sm:min-w-[220px] sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aa775a]">
              {invoiceDetailsT("summaryTitle")}
            </p>
            <p className="mt-2 text-[24px] font-semibold text-[#cf6e38] sm:text-[28px]">
              {invoice.totalAmount}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <DetailRow label={invoiceDetailsT("vendor")} value={invoice.vendor.name} />
          <DetailRow label={invoiceDetailsT("event")} value={invoice.order.eventName} />
          <DetailRow label={invoiceDetailsT("issuedOn")} value={invoice.issuedOn} />
          <DetailRow label={invoiceDetailsT("dueOn")} value={invoice.dueOn} />
        </div>

        <div className="mt-6 border-t border-[#ece4dc] pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#9c897d]">
            {invoiceDetailsT("amountBreakdown")}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <DetailRow label={invoiceDetailsT("subtotal")} value={invoice.subtotal} />
            <DetailRow label={invoiceDetailsT("deliveryFee")} value={invoice.deliveryFee} />
            <DetailRow label={invoiceDetailsT("tax")} value={invoice.taxAmount} />
            <DetailRow label={invoiceDetailsT("tip")} value={invoice.tipAmount} />
          </div>
        </div>
      </section>

      {downloadError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {downloadError}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <DetailSection title={invoiceDetailsT("lineItems")}>
          {invoice.lineItems.length > 0 ? (
            <div className="space-y-3">
              {invoice.lineItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[20px] border border-[#efe5dc] bg-white px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-[#1f1f1f]">
                        {item.label}
                      </p>
                      {item.description ? (
                        <p className="mt-1 text-sm text-[#6f665f]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-[#1f1f1f]">
                        {item.totalPrice}
                      </p>
                      <p className="mt-1 text-xs text-[#8b827b]">
                        {item.quantity} x {item.unitPrice}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#706760]">{invoiceDetailsT("noLineItems")}</p>
          )}
        </DetailSection>

        <div className="space-y-6">
          <DetailSection title={invoiceDetailsT("invoiceMeta")}>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label={invoiceDetailsT("paidOn")} value={invoice.paidOn || invoiceDetailsT("notPaidYet")} />
              <DetailRow label={invoiceDetailsT("paymentType")} value={invoice.paymentType} />
              <DetailRow
                label={invoiceDetailsT("transactionReference")}
                value={invoice.transactionReference}
              />
              <DetailRow label={invoiceDetailsT("paidAmount")} value={invoice.paidAmount} />
              <DetailRow label={invoiceDetailsT("dueAmount")} value={invoice.dueAmount} />
            </div>
          </DetailSection>

          <DetailSection title={invoiceDetailsT("eventAndBilling")}>
            <div className="space-y-4 text-sm text-[#4b463f]">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">
                    {invoice.order.eventName}
                  </p>
                  <p className="mt-1">
                    {invoice.order.eventDate} | {invoiceDetailsT("guests", { count: invoice.order.personCount })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("deliveryInfo")}</p>
                  <p className="mt-1">{invoice.order.deliveryAddressStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiUser className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("billingContact")}</p>
                  <p className="mt-1">
                    {invoice.vendor.companyName || invoice.vendor.name}
                  </p>
                  <p>{invoice.billingAddress.phone || invoiceDetailsT("noPhoneAdded")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiCreditCard className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("billingAddress")}</p>
                  <p className="mt-1">
                    {[
                      invoice.billingAddress.address,
                      invoice.billingAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || invoiceDetailsT("notProvided")}
                  </p>
                </div>
              </div>

              {invoice.note ? (
                <div className="rounded-[18px] border border-[#f1e3d6] bg-[#fff8f3] px-4 py-3">
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("note")}</p>
                  <p className="mt-1 text-sm text-[#6d645c]">{invoice.note}</p>
                </div>
              ) : null}
            </div>
          </DetailSection>
        </div>
      </section>
    </div>
  );
}
