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

function DetailRow({ label, value, valueClassName = "" }) {
  return (
    <div className="group rounded-[22px] border border-[#eadccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f2_100%)] px-4 py-4 shadow-[0_10px_24px_rgba(53,33,20,0.04)] transition duration-200 hover:-translate-y-[1px] hover:border-[#e5c9b5] hover:shadow-[0_16px_32px_rgba(53,33,20,0.08)] sm:px-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ab8f7f]">
        {label}
      </p>
      <p className={`mt-2 text-[15px] font-semibold leading-6 text-[#201815] sm:text-[17px] ${valueClassName}`.trim()}>
        {value}
      </p>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[#eadccf] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f0_100%)] shadow-[0_18px_40px_rgba(52,31,18,0.06)]">
      <div className="border-b border-[#efe4db] bg-[linear-gradient(90deg,rgba(207,110,56,0.09)_0%,rgba(255,255,255,0.92)_55%)] px-5 py-4 sm:px-6">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#9c7b68]">
          {title}
        </h3>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SummaryChip({ label, value, tone = "default" }) {
  const toneClasses =
    tone === "accent"
      ? "border-[#edc7b2] bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)] text-[#bc6537]"
      : "border-[#eadfd5] bg-white/85 text-[#65574d]";

  return (
    <div className={`rounded-[20px] border px-4 py-3 shadow-[0_10px_24px_rgba(46,28,17,0.04)] ${toneClasses}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-2 text-[15px] font-semibold leading-6 text-[#1d1713]">{value}</p>
    </div>
  );
}

function ReceiptPreview({ url }) {
  const normalizedUrl = `${url || ""}`.trim();

  if (!normalizedUrl) {
    return null;
  }

  const isPdf = /\.pdf($|\?)/i.test(normalizedUrl);
  const isImage = /\.(png|jpe?g|webp|gif)($|\?)/i.test(normalizedUrl);

  return (
    <div className="mt-4 rounded-[18px] border border-[#f1e3d6] bg-white px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#1f1f1f]">{isPdf ? "Uploaded receipt PDF" : "Uploaded receipt"}</p>
        <a
          className="text-sm font-semibold text-[#cf6e38] transition hover:text-[#b85e2a]"
          href={normalizedUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open file
        </a>
      </div>
      {isImage ? (
        <img
          alt="Uploaded payment receipt"
          className="mt-3 max-h-[320px] w-full rounded-[14px] border border-[#eadfd5] object-contain"
          src={normalizedUrl}
        />
      ) : null}
      {!isImage ? (
        <p className="mt-3 text-sm text-[#6d645c] break-all">{normalizedUrl}</p>
      ) : null}
    </div>
  );
}

function formatHistoryActionLabel(action) {
  return String(action || "Payment activity")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatHistoryActorLabel(item, fallbackLabel) {
  const actorName = String(item?.actorName || "").trim();
  const actorType = String(item?.actorType || "").trim();

  if (actorName && actorType) {
    return `${actorName} · ${actorType}`;
  }

  return actorName || actorType || fallbackLabel;
}

function parsePaymentHistoryNote(note) {
  const rawNote = String(note || "").trim();

  if (!rawNote) {
    return {
      summary: "",
      reference: "",
      note: "",
    };
  }

  const referenceMatch = rawNote.match(/reference:\s*(.*?)(?=(?:\s+note:)|$)/i);
  const noteMatch = rawNote.match(/note:\s*(.*)$/i);
  const summary = rawNote
    .replace(/reference:\s*.*?(?=(?:\s+note:)|$)/i, "")
    .replace(/note:\s*.*$/i, "")
    .trim()
    .replace(/\s{2,}/g, " ");

  return {
    summary,
    reference: referenceMatch?.[1]?.trim() || "",
    note: noteMatch?.[1]?.trim() || "",
  };
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
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#edd7c8] bg-white/90 px-4 py-2 text-sm font-semibold text-[#cf6e38] shadow-[0_8px_20px_rgba(50,30,18,0.05)] transition hover:-translate-y-[1px] hover:border-[#d8aa8d] hover:text-[#b85e2a]"
          >
            <FiArrowLeft className="text-[15px]" />
            {invoiceDetailsT("back")}
          </Link>
          <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-[#181311] sm:text-[42px]">
            {invoiceDetailsT("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#655a52] sm:text-[16px]">
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
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#d77542_0%,#c95f30_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(201,95,48,0.24)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_38px_rgba(201,95,48,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiDownload className="text-[15px]" />
          {downloadStatus === "loading"
            ? invoiceDetailsT("preparingPdf")
            : invoiceDetailsT("exportPdf")}
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[34px] border border-[#e2d5ca] bg-[linear-gradient(135deg,#fffdfa_0%,#fff7f0_52%,#fff2e6_100%)] p-5 shadow-[0_22px_48px_rgba(31,20,12,0.08)] md:p-7">
        <div className="absolute -right-14 top-0 h-40 w-40 rounded-full bg-[#ffd9c6]/55 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#fff2d6]/55 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-5 border-b border-[#ebded3] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-[#f0d1bc] bg-[linear-gradient(135deg,#fff2e8_0%,#ffe6d7_100%)] text-[#cf6e38] shadow-[0_12px_24px_rgba(207,110,56,0.16)]">
              <FiFileText className="text-[24px]" />
            </div>

            <div>
              <span className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm ${getInvoiceStatusClasses(invoice.status)}`}>
                {localizedStatus}
              </span>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-[#1c1714] sm:text-[34px]">
                {invoice.invoiceNumber}
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[#675b53]">
                {invoiceHeading}
              </p>
            </div>
          </div>

          <div className="min-w-[240px] rounded-[24px] border border-[#efcdbb] bg-[linear-gradient(135deg,#fff6ef_0%,#ffe7d8_100%)] px-5 py-5 text-left shadow-[0_16px_34px_rgba(207,110,56,0.12)] sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b17859]">
              {invoiceDetailsT("summaryTitle")}
            </p>
            <p className="mt-3 text-[30px] font-semibold tracking-[-0.05em] text-[#c75d2d] sm:text-[36px]">
              {invoice.totalAmount}
            </p>
            <p className="mt-2 text-[13px] font-medium text-[#876b5b]">
              {invoiceDetailsT("paymentType")}: {paymentTypeLabel}
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DetailRow
            label={invoiceDetailsT("vendor")}
            value={invoice.vendor.name || invoiceDetailsT("vendorFallback")}
          />
          <DetailRow label={invoiceDetailsT("event")} value={eventNameLabel} />
          <DetailRow label={invoiceDetailsT("issuedOn")} value={invoice.issuedOn} />
          <DetailRow label={invoiceDetailsT("dueOn")} value={invoice.dueOn} />
        </div>

        <div className="relative mt-7 border-t border-[#ebded3] pt-6">
          <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-[#9c7b68]">
            {invoiceDetailsT("amountBreakdown")}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryChip label={invoiceDetailsT("subtotal")} value={invoice.subtotal} />
            <SummaryChip label={invoiceDetailsT("deliveryFee")} value={invoice.deliveryFee} />
            <SummaryChip label={invoiceDetailsT("tax")} value={invoice.taxAmount} />
            <SummaryChip label={invoiceDetailsT("tip")} value={invoice.tipAmount} tone="accent" />
          </div>
        </div>
      </section>

      {downloadError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {downloadError}
        </div>
      ) : null}

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <DetailSection title={invoiceDetailsT("lineItems")}>
            {invoice.lineItems.length > 0 ? (
              <div className="space-y-3">
                {invoice.lineItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[24px] border border-[#ede0d5] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] px-5 py-5 shadow-[0_12px_28px_rgba(42,26,15,0.05)] transition duration-200 hover:-translate-y-[1px] hover:border-[#e0c2ad]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[17px] font-semibold text-[#1f1f1f]">
                          {item.label}
                        </p>
                        {item.description ? (
                          <p className="mt-1 text-sm leading-6 text-[#6f665f]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-[18px] border border-[#f0e5dd] bg-[#fff8f3] px-4 py-3 text-left sm:min-w-[160px] sm:text-right">
                        <p className="text-sm font-semibold text-[#1f1f1f]">
                          {item.totalPrice}
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#8b827b]">
                          {item.quantity} x {item.unitPrice}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#e4d6cb] bg-white/70 px-5 py-10 text-center shadow-[0_10px_24px_rgba(42,26,15,0.03)]">
                <p className="text-[15px] font-semibold text-[#2b211c]">
                  {invoiceDetailsT("noLineItems")}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#7b6d63]">
                  This invoice does not include item-level details yet, but the payment, billing, and order summary are still available below.
                </p>
              </div>
            )}
          </DetailSection>

          <DetailSection title={invoiceDetailsT("eventAndBilling")}>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-[#4b463f]">
              <div className="rounded-[20px] border border-[#eee1d6] bg-white/80 px-4 py-4 shadow-[0_10px_22px_rgba(45,27,16,0.04)]">
                <div className="flex items-start gap-3">
                  <FiCalendar className="mt-0.5 text-[#cf6e38]" />
                  <div>
                    <p className="font-semibold text-[#1f1f1f]">
                      {eventNameLabel}
                    </p>
                    {eventMetaLabel ? <p className="mt-1">{eventMetaLabel}</p> : null}
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#eee1d6] bg-white/80 px-4 py-4 shadow-[0_10px_22px_rgba(45,27,16,0.04)]">
                <div className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5 text-[#cf6e38]" />
                  <div>
                    <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("deliveryInfo")}</p>
                    <p className="mt-1">{deliveryAddressLabel}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#eee1d6] bg-white/80 px-4 py-4 shadow-[0_10px_22px_rgba(45,27,16,0.04)]">
                <div className="flex items-start gap-3">
                  <FiUser className="mt-0.5 text-[#cf6e38]" />
                  <div>
                    <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("billingContact")}</p>
                    <p className="mt-1">{invoice.customer.name || billingContactLabel}</p>
                    <p>{invoice.customer.phone || invoice.billingAddress.phone || invoiceDetailsT("noPhoneAdded")}</p>
                    <p>{invoice.customer.email || invoiceDetailsT("notProvided")}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#eee1d6] bg-white/80 px-4 py-4 shadow-[0_10px_22px_rgba(45,27,16,0.04)]">
                <div className="flex items-start gap-3">
                  <FiCreditCard className="mt-0.5 text-[#cf6e38]" />
                  <div>
                    <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("billingAddress")}</p>
                    <p className="mt-1">{billingAddressLabel}</p>
                  </div>
                </div>
              </div>

              {invoice.note ? (
                <div className="md:col-span-2 rounded-[20px] border border-[#f1dfd2] bg-[linear-gradient(135deg,#fff9f4_0%,#fff1e5_100%)] px-5 py-4 shadow-[0_10px_24px_rgba(52,31,18,0.05)]">
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("note")}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6d645c]">{invoice.note}</p>
                </div>
              ) : null}
            </div>
          </DetailSection>

          {invoice.paymentHistory?.length ? (
            <DetailSection title={invoiceDetailsT("paymentHistory")}>
              <div className="space-y-3">
                {invoice.paymentHistory.map((item) => (
                  (() => {
                    const parsedHistoryNote = parsePaymentHistoryNote(item.note);

                    return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[24px] border border-[#ede0d5] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] shadow-[0_10px_24px_rgba(42,26,15,0.05)]"
                  >
                    <div className="flex flex-col gap-4 px-5 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-[#f2d7c7] bg-[linear-gradient(135deg,#fff4ec_0%,#ffe9dc_100%)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#bf6737]">
                              {formatHistoryActionLabel(item.action || invoiceDetailsT("paymentActivity"))}
                            </span>
                            {(item.fromStatus || item.toStatus) ? (
                              <span className="inline-flex items-center rounded-full bg-[#f6f1ec] px-3 py-1 text-[11px] font-semibold text-[#74675f]">
                                {(item.fromStatus || invoiceDetailsT("unknown"))} to {(item.toStatus || invoiceDetailsT("unknown"))}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-3 text-sm font-semibold text-[#1f1f1f]">
                            {formatHistoryActorLabel(item, invoiceDetailsT("system"))}
                          </p>
                        </div>

                        <div className="rounded-full bg-[#fbf5ef] px-3 py-1.5 text-[11px] font-semibold text-[#8f8177]">
                          {item.createdAtLabel || invoiceDetailsT("notAvailable")}
                        </div>
                      </div>

                      {item.note ? (
                        <div className="rounded-[16px] border border-[#f1e4da] bg-white/85 px-4 py-3">
                          {parsedHistoryNote.summary ? (
                            <p className="text-sm font-medium leading-7 text-[#4b463f]">
                              {parsedHistoryNote.summary}
                            </p>
                          ) : null}

                          {(parsedHistoryNote.reference || parsedHistoryNote.note) ? (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {parsedHistoryNote.reference ? (
                                <div className="rounded-[14px] border border-[#efe3d8] bg-[#fff9f4] px-3 py-2.5">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">
                                    Transfer Reference
                                  </p>
                                  <p className="mt-1 text-[13px] font-semibold text-[#201815] break-words">
                                    {parsedHistoryNote.reference}
                                  </p>
                                </div>
                              ) : null}
                              {parsedHistoryNote.note ? (
                                <div className="rounded-[14px] border border-[#efe3d8] bg-[#fff9f4] px-3 py-2.5 sm:col-span-1">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">
                                    Verification Note
                                  </p>
                                  <p className="mt-1 text-[13px] font-semibold leading-6 text-[#201815] break-words">
                                    {parsedHistoryNote.note}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                        {(item.fromStatus || item.toStatus) ? (
                          <p className="mt-1 text-xs text-[#8b827b]">
                            {`${item.fromStatus || invoiceDetailsT("unknown")} -> ${item.toStatus || invoiceDetailsT("unknown")}`}
                          </p>
                        ) : null}
                    </div>
                  </article>
                    );
                  })()
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
        </div>

        <div className="space-y-6 xl:sticky xl:top-6">
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
            <div className="rounded-[24px] border border-[#efdccc] bg-[linear-gradient(135deg,#fff9f4_0%,#fff0e4_100%)] px-5 py-5 text-sm text-[#6d645c] shadow-[0_12px_28px_rgba(50,30,18,0.05)]">
              <p className="text-[15px] font-semibold text-[#1f1f1f]">
                {invoiceDetailsT("paymentStatusNoticeTitle")}
              </p>
              <p className="mt-2 leading-7">{paymentStateMessage}</p>
              {isWaitingForVendorAcceptance && invoice.order.status ? (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9c897d]">
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
                      className="rounded-[16px] border border-[#e4d8cf] bg-white px-4 py-3.5 outline-none transition hover:border-[#d8b59e] focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
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
                      className="rounded-[16px] border border-[#e4d8cf] bg-white px-4 py-3.5 outline-none transition hover:border-[#d8b59e] focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                      onChange={(event) => setTransferReference(event.target.value)}
                      placeholder={invoiceDetailsT("transferReferencePlaceholder")}
                      value={transferReference}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-sm text-[#4b463f]">
                  <span className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("note")}</span>
                  <textarea
                    className="min-h-[120px] rounded-[16px] border border-[#e4d8cf] bg-white px-4 py-3.5 outline-none transition hover:border-[#d8b59e] focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                    onChange={(event) => setPaymentNote(event.target.value)}
                    placeholder={invoiceDetailsT("paymentNotePlaceholder")}
                    value={paymentNote}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm text-[#4b463f]">
                  <span className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("receiptFile")}</span>
                  <input
                    accept=".jpg,.jpeg,.png,.pdf,.webp"
                    className="cursor-pointer rounded-[16px] border border-dashed border-[#dcc7b8] bg-[#fffaf6] px-4 py-3 text-sm text-[#5f554d] transition hover:border-[#cf6e38]"
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
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#d77542_0%,#c95f30_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(201,95,48,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_38px_rgba(201,95,48,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
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
                  <div className="rounded-[22px] border border-[#f0ddd1] bg-[linear-gradient(135deg,#fff8f2_0%,#fff1e6_100%)] px-5 py-4 shadow-[0_10px_24px_rgba(53,33,20,0.05)]">
                    <p className="text-sm leading-7 text-[#6d645c]">{invoice.bankTransferInstructions}</p>
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
                <DetailRow
                  label="Receipt file"
                  value={
                    invoice.paymentReport.receiptUrl ? (
                      <a
                        className="inline-flex items-center rounded-full border border-[#edc7b2] bg-[#fff4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c45f2f] transition hover:border-[#d7a98d] hover:text-[#ab5228]"
                        href={invoice.paymentReport.receiptUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open uploaded receipt
                      </a>
                    ) : (
                      invoiceDetailsT("notAvailable")
                    )
                  }
                  valueClassName="break-words"
                />
              </div>
              {invoice.paymentReport.note ? (
                <div className="mt-4 rounded-[20px] border border-[#f1dfd2] bg-[linear-gradient(135deg,#fff9f4_0%,#fff1e5_100%)] px-5 py-4">
                  <p className="font-semibold text-[#1f1f1f]">{invoiceDetailsT("customerNote")}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6d645c]">{invoice.paymentReport.note}</p>
                </div>
              ) : null}
              <ReceiptPreview url={invoice.paymentReport.receiptUrl} />
            </DetailSection>
          ) : null}
        </div>
      </section>
    </div>
  );
}
