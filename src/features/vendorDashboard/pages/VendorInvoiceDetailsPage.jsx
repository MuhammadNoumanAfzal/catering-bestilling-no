import { useEffect, useState } from "react";
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
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { getInvoiceStatusClasses } from "../components/invoices/invoiceUtils";
import {
  translateInvoiceDetails,
  translateInvoiceStatus,
} from "../components/invoices/invoiceDetailsI18n";
import {
  clearInvoiceDownloadState,
  clearSelectedInvoiceDetail,
  fetchInvoiceDetail,
  fetchInvoiceDownloadUrl,
  reportInvoicePayment,
} from "../invoicesSlice";

const MAX_RECEIPT_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

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
  const { t, i18n } = useTranslation();
  const invoiceDetailsT = (key, options = {}) =>
    translateInvoiceDetails(t, i18n, key, options);
  const { invoiceId } = useParams();
  const decodedInvoiceId = invoiceId ? decodeURIComponent(invoiceId) : "";
  const dispatch = useDispatch();
  const [paymentDate, setPaymentDate] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const {
    selectedInvoiceDetail,
    selectedInvoiceDetailStatus,
    selectedInvoiceDetailError,
    reportPaymentStatus,
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
  const normalizedInvoiceStatus = `${invoice.statusRaw || ""}`.trim().toUpperCase();
  const hasReportedPayment = Boolean(invoice.paymentReport);
  const localizedOrderLabel = invoice.order.eventName
    ? invoiceDetailsT("orderLabel", {
        orderNumber: invoice.order.eventName,
      })
    : invoiceDetailsT("untitledOrder");
  const localizedStatus = translateInvoiceStatus(
    t,
    invoice.statusKey,
    invoice.status,
  );
  const invoiceHeading = invoiceDetailsT("orderForVendor", {
    event: localizedOrderLabel,
    vendor: invoice.vendor.name || invoiceDetailsT("vendorFallback"),
  });
  const paymentTypeLabel =
    invoice.paymentType || invoiceDetailsT("notSpecified");
  const isBankTransfer = `${invoice.paymentMethod || invoice.paymentType || ""}`.trim().toUpperCase() === "BANK_TRANSFER";
  const isWaitingForVendorAcceptance =
    invoice.payableAfterVendorAcceptance &&
    !invoice.canPayInvoice &&
    !invoice.canReportPayment &&
    !invoice.order.acceptedAt &&
    ["PLACED", "PENDING", "NEW"].includes(
      `${invoice.order.status || ""}`.trim().toUpperCase(),
    );
  const canReportPayment = isBankTransfer && invoice.canReportPayment;
  const paymentStateMessage = !invoice.canViewInvoice
    ? invoiceDetailsT("invoiceAccessDeniedNotice")
    : !isBankTransfer
      ? invoiceDetailsT("bankTransferOnlyNotice")
      : isWaitingForVendorAcceptance
        ? invoiceDetailsT("waitingForVendorAcceptanceNotice")
        : normalizedInvoiceStatus === "PAID"
          ? invoiceDetailsT("alreadyPaidNotice")
          : normalizedInvoiceStatus === "PAYMENT_REPORTED" || hasReportedPayment
            ? invoiceDetailsT("awaitingAdminReviewNotice")
            : !invoice.canPayInvoice && invoice.payableAfterVendorAcceptance
              ? invoiceDetailsT("paymentLockedUntilAcceptanceNotice")
              : !canReportPayment
                ? invoiceDetailsT("paymentUnavailableNotice")
                : "";
  const transactionReferenceLabel =
    invoice.transactionReference || invoiceDetailsT("notAvailable");
  const eventNameLabel = localizedOrderLabel;
  const eventMetaLabel = [
    invoice.order.eventDate,
    invoiceDetailsT("guests", { count: invoice.order.personCount }),
  ]
    .filter(Boolean)
    .join(" | ");
  const deliveryAddressLabel =
    invoice.order.deliveryAddressStr || invoiceDetailsT("notProvided");
  const billingContactLabel =
    invoice.vendor.companyName ||
    invoice.vendor.name ||
    invoiceDetailsT("vendorFallback");
  const billingAddressLabel =
    [
      invoice.billingAddress.address,
      invoice.billingAddress.country,
    ]
      .filter(Boolean)
      .join(", ") || invoiceDetailsT("notProvided");

  async function handleSubmitPaymentReport(event) {
    event.preventDefault();

    if (!canReportPayment) {
      await showAuthErrorAlert(
        paymentStateMessage || invoiceDetailsT("paymentUnavailableNotice"),
        invoiceDetailsT("paymentReportingUnavailable"),
      );
      return;
    }

    if (receiptFile) {
      if (receiptFile.size > MAX_RECEIPT_FILE_SIZE) {
        await showAuthErrorAlert(
          invoiceDetailsT("receiptSizeError"),
          invoiceDetailsT("receiptValidationTitle"),
        );
        return;
      }

      if (
        receiptFile.type &&
        !ALLOWED_RECEIPT_TYPES.has(receiptFile.type.toLowerCase())
      ) {
        await showAuthErrorAlert(
          invoiceDetailsT("receiptTypeError"),
          invoiceDetailsT("receiptValidationTitle"),
        );
        return;
      }
    }

    const result = await dispatch(
      reportInvoicePayment({
        invoiceId: invoice.id,
        input: {
          paymentDate,
          transferReference,
          note: paymentNote,
        },
        receiptFile,
      }),
    );

    if (reportInvoicePayment.fulfilled.match(result)) {
      setReceiptFile(null);
      setPaymentDate("");
      setTransferReference("");
      setPaymentNote("");
      await showSuccessToast(result.payload.message);
      dispatch(fetchInvoiceDetail(decodedInvoiceId));
      return;
    }

    await showAuthErrorAlert(
      result.payload || "Unable to report this invoice payment.",
      invoiceDetailsT("paymentReportFailed"),
    );
  }

  if (!invoice.canViewInvoice) {
    return (
      <section className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-700">
          {invoiceDetailsT("loadErrorTitle")}
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {invoiceDetailsT("invoiceAccessDeniedNotice")}
        </p>
      </section>
    );
  }

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
              window.open(
                result.payload.downloadUrl,
                "_blank",
                "noopener,noreferrer",
              );
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
                {localizedStatus}
              </span>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#1f1f1f] sm:text-[28px]">
                {invoice.invoiceNumber}
              </h2>
              <p className="mt-2 text-[15px] text-[#685e56]">
                {invoiceHeading}
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
          <DetailRow
            label={invoiceDetailsT("vendor")}
            value={invoice.vendor.name || invoiceDetailsT("vendorFallback")}
          />
          <DetailRow label={invoiceDetailsT("event")} value={eventNameLabel} />
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
              <DetailRow
                label={invoiceDetailsT("paymentType")}
                value={paymentTypeLabel}
              />
              <DetailRow
                label={invoiceDetailsT("transactionReference")}
                value={transactionReferenceLabel}
              />
              <DetailRow label={invoiceDetailsT("paidAmount")} value={invoice.paidAmount} />
              <DetailRow label={invoiceDetailsT("dueAmount")} value={invoice.dueAmount} />
              <DetailRow label={invoiceDetailsT("verifiedAt")} value={invoice.verifiedAt || invoiceDetailsT("notAvailable")} />
              <DetailRow label={invoiceDetailsT("rejectedAt")} value={invoice.rejectedAt || invoiceDetailsT("notAvailable")} />
            </div>
          </DetailSection>

          {!canReportPayment && paymentStateMessage ? (
            <div className="rounded-[20px] border border-[#e6ddd3] bg-[#fff8f2] px-4 py-4 text-sm text-[#6d645c]">
              <p className="font-semibold text-[#1f1f1f]">
                {invoiceDetailsT("paymentStatusNoticeTitle")}
              </p>
              <p className="mt-1 leading-6">{paymentStateMessage}</p>
              {isWaitingForVendorAcceptance && invoice.order.status ? (
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-[#9c897d]">
                  {invoiceDetailsT("currentOrderStatus")}: {invoice.order.status}
                </p>
              ) : null}
            </div>
          ) : null}

          {canReportPayment ? (
            <DetailSection title={invoiceDetailsT("reportBankTransferPayment")}>
              <form className="space-y-4" onSubmit={handleSubmitPaymentReport}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm text-[#4b463f]">
                    <span className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("paymentDate")}</span>
                    <input
                      className="rounded-[14px] border border-[#e4d8cf] bg-white px-3 py-3 outline-none"
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(event) => setPaymentDate(event.target.value)}
                      required
                      type="date"
                      value={paymentDate}
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-[#4b463f]">
                    <span className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("transferReference")}</span>
                    <input
                      className="rounded-[14px] border border-[#e4d8cf] bg-white px-3 py-3 outline-none"
                      onChange={(event) => setTransferReference(event.target.value)}
                      placeholder={invoiceDetailsT("transferReferencePlaceholder")}
                      value={transferReference}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-sm text-[#4b463f]">
                  <span className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("note")}</span>
                  <textarea
                    className="min-h-[110px] rounded-[14px] border border-[#e4d8cf] bg-white px-3 py-3 outline-none"
                    onChange={(event) => setPaymentNote(event.target.value)}
                    placeholder={invoiceDetailsT("paymentNotePlaceholder")}
                    value={paymentNote}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm text-[#4b463f]">
                  <span className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("receiptFile")}</span>
                  <input
                    accept=".jpg,.jpeg,.png,.pdf,.webp"
                    onChange={(event) => setReceiptFile(event.target.files?.[0] || null)}
                    type="file"
                  />
                  <span className="text-xs text-[#7a7068]">
                    {invoiceDetailsT("receiptFileHelp")}
                  </span>
                  {receiptFile ? (
                    <span className="text-xs font-medium text-[#4b463f]">{receiptFile.name}</span>
                  ) : null}
                </label>

                <button
                  className="inline-flex items-center justify-center rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={reportPaymentStatus === "loading"}
                  type="submit"
                >
                  {reportPaymentStatus === "loading"
                    ? invoiceDetailsT("submittingPaymentReport")
                    : invoiceDetailsT("reportPayment")}
                </button>
              </form>
            </DetailSection>
          ) : null}

          {isBankTransfer ? (
            <DetailSection title={invoiceDetailsT("bankTransferDetails")}>
              <div className="space-y-4">
                {invoice.bankTransferInstructions ? (
                  <div className="rounded-[18px] border border-[#f1e3d6] bg-[#fff8f3] px-4 py-3">
                    <p className="text-sm leading-6 text-[#6d645c]">{invoice.bankTransferInstructions}</p>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailRow label={invoiceDetailsT("accountName")} value={invoice.bankAccountName || invoiceDetailsT("notProvided")} />
                  <DetailRow label={invoiceDetailsT("accountNumber")} value={invoice.bankAccountNumber || invoiceDetailsT("notProvided")} />
                  <DetailRow label={invoiceDetailsT("bankName")} value={invoice.bankName || invoiceDetailsT("notProvided")} />
                  <DetailRow label="IBAN" value={invoice.iban || invoiceDetailsT("notProvided")} />
                  <DetailRow label="SWIFT / BIC" value={invoice.swiftCode || invoiceDetailsT("notProvided")} />
                  <DetailRow label={invoiceDetailsT("referenceKid")} value={invoice.invoiceNumber || invoiceDetailsT("notAvailable")} />
                </div>
              </div>
            </DetailSection>
          ) : null}

          {invoice.paymentReport ? (
            <DetailSection title={invoiceDetailsT("reportedPaymentDetails")}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow label={invoiceDetailsT("paymentDate")} value={invoice.paymentReport.paymentDate || invoiceDetailsT("notAvailable")} />
                <DetailRow label={invoiceDetailsT("reportedAt")} value={invoice.paymentReport.reportedAtLabel || invoiceDetailsT("notAvailable")} />
                <DetailRow label={invoiceDetailsT("transferReference")} value={invoice.paymentReport.transferReference || invoiceDetailsT("notAvailable")} />
                <DetailRow label={invoiceDetailsT("receiptUrl")} value={invoice.paymentReport.receiptUrl || invoiceDetailsT("notAvailable")} />
              </div>
              {invoice.paymentReport.note ? (
                <div className="mt-4 rounded-[18px] border border-[#f1e3d6] bg-[#fff8f3] px-4 py-3">
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("customerNote")}</p>
                  <p className="mt-1 text-sm text-[#6d645c]">{invoice.paymentReport.note}</p>
                </div>
              ) : null}
            </DetailSection>
          ) : null}

          {invoice.paymentHistory?.length ? (
            <DetailSection title={invoiceDetailsT("paymentHistory")}>
              <div className="space-y-3">
                {invoice.paymentHistory.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[18px] border border-[#efe5dc] bg-white px-4 py-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#1f1f1f]">
                          {item.action || invoiceDetailsT("paymentActivity")}
                        </p>
                        <p className="mt-1 text-sm text-[#6f665f]">
                          {[item.actorName, item.actorType].filter(Boolean).join(" | ") || invoiceDetailsT("system")}
                        </p>
                        {(item.fromStatus || item.toStatus) ? (
                          <p className="mt-1 text-xs text-[#8b827b]">
                            {`${item.fromStatus || invoiceDetailsT("unknown")} -> ${item.toStatus || invoiceDetailsT("unknown")}`}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-xs font-medium text-[#8b827b]">
                        {item.createdAtLabel || invoiceDetailsT("notAvailable")}
                      </p>
                    </div>
                    {item.note ? (
                      <p className="mt-3 text-sm text-[#4b463f]">{item.note}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {invoice.settlement ? (
            <DetailSection title={invoiceDetailsT("settlementAndCommission")}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow
                  label={invoiceDetailsT("settlementNumber")}
                  value={invoice.settlement.settlementNumber || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("settlementStatus")}
                  value={invoice.settlement.status || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("vendorPayable")}
                  value={invoice.settlement.vendorPayable || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("fundedAt")}
                  value={invoice.settlement.fundedAt || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("readyForPayoutAt")}
                  value={invoice.settlement.readyForPayoutAt || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("settledAt")}
                  value={invoice.settlement.settledAt || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("commissionStatus")}
                  value={invoice.settlement.commission?.status || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("commissionModel")}
                  value={invoice.settlement.commission?.model || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("commissionRate")}
                  value={invoice.settlement.commission?.ratePercent || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("platformCommission")}
                  value={invoice.settlement.commission?.totalCommission || invoiceDetailsT("notAvailable")}
                />
                <DetailRow
                  label={invoiceDetailsT("commissionLockedAt")}
                  value={invoice.settlement.commission?.lockedAt || invoiceDetailsT("notAvailable")}
                />
              </div>
            </DetailSection>
          ) : null}

          <DetailSection title={invoiceDetailsT("eventAndBilling")}>
            <div className="space-y-4 text-sm text-[#4b463f]">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">
                    {eventNameLabel}
                  </p>
                  {eventMetaLabel ? <p className="mt-1">{eventMetaLabel}</p> : null}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("deliveryInfo")}</p>
                  <p className="mt-1">{deliveryAddressLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiUser className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("billingContact")}</p>
                  <p className="mt-1">{invoice.customer.name || billingContactLabel}</p>
                  <p>{invoice.customer.phone || invoice.billingAddress.phone || invoiceDetailsT("noPhoneAdded")}</p>
                  <p>{invoice.customer.email || invoiceDetailsT("notProvided")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiCreditCard className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("billingAddress")}</p>
                  <p className="mt-1">{billingAddressLabel}</p>
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
