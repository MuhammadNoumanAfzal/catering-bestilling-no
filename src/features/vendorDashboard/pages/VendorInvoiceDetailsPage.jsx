import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { getInvoiceStatusClasses } from "../components/invoices/invoiceUtils";
import DashboardLoadingState from "../components/DashboardLoadingState";
import {
  translateInvoiceDetails,
  translateInvoiceStatus,
} from "../components/invoices/invoiceDetailsI18n";
import {
  clearSelectedInvoiceDetail,
  fetchInvoiceDetail,
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
    <div className="rounded-[12px] border border-[#eadfd7] bg-white px-3 py-2.5 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ab8f7f]">
        {label}
      </p>
      <p className={`mt-1.5 text-[15px] font-semibold leading-6 text-[#201815] sm:text-[17px] ${valueClassName}`.trim()}>
        {value}
      </p>
    </div>
  );
}

function DetailSection({ title, children, className = "" }) {
  return (
    <section className={`overflow-hidden rounded-[18px] border border-[#e6d9cf] bg-white ${className}`}>
      <div className="border-b border-[#efe4db] bg-[#fffaf6] px-4 py-3 sm:px-5">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#9c7b68]">
          {title}
        </h3>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function SummaryChip({ label, value, tone = "default" }) {
  const toneClasses =
    tone === "accent"
      ? "border-[#edc7b2] bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_100%)] text-[#bc6537]"
      : "border-[#eadfd5] bg-white/85 text-[#65574d]";

  return (
    <div className={`rounded-[12px] border px-3 py-2.5 ${toneClasses}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#1d1713]">{value}</p>
    </div>
  );
}

function InvoiceInlineDetail({ label, value, emphasis = false }) {
  return (
    <div
      className={`min-w-0 px-3 py-1 ${
        emphasis ? "sm:text-right" : ""
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ab8f7f]">
        {label}
      </p>
      <p
        className={`mt-1 whitespace-nowrap text-[15px] font-semibold leading-6 text-[#201815] ${
          emphasis ? "text-[#c75d2d]" : ""
        }`}
      >
        {value}
      </p>
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
  } = useSelector((state) => state.invoices);

  useEffect(() => {
    if (decodedInvoiceId) {
      dispatch(fetchInvoiceDetail(decodedInvoiceId));
    }

    return () => {
      dispatch(clearSelectedInvoiceDetail());
    };
  }, [decodedInvoiceId, dispatch]);

  if (selectedInvoiceDetailStatus === "loading") {
    return <DashboardLoadingState title="Loading invoice details" description="Preparing the invoice, order, and payment information." rows={4} columns={4} />;
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/vendor-dashboard/invoices"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#edd7c8] bg-white/90 px-4 py-2 text-sm font-semibold text-[#cf6e38] shadow-[0_8px_20px_rgba(50,30,18,0.05)] transition hover:-translate-y-[1px] hover:border-[#d8aa8d] hover:text-[#b85e2a]"
          >
            <FiArrowLeft className="text-[15px]" />
            {invoiceDetailsT("back")}
          </Link>
          <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#181311] sm:text-[42px]">
            {invoiceDetailsT("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#655a52] sm:text-[16px]">
            {invoiceDetailsT("description")}
          </p>
        </div>

      </div>

      {paymentStateMessage ? (
        <section className="relative overflow-hidden rounded-[32px] border border-[#ebbda1] bg-[linear-gradient(135deg,#fff4ea_0%,#ffe2ce_38%,#fff8f2_100%)] px-5 py-5 shadow-[0_24px_52px_rgba(201,95,48,0.18)] sm:px-7 sm:py-6">
          <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-[#fff0cc]/70 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#ffd7c2]/70 blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-0 right-20 h-20 w-20 rounded-full bg-[#ffe7d8]/60 blur-2xl" aria-hidden="true" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-[#efc3aa] bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#ba6537] shadow-[0_10px_22px_rgba(52,31,18,0.08)]">
                Payment Status Update
              </div>
              <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.04em] text-[#1f1713] sm:text-[30px]">
                {invoiceDetailsT("paymentStatusNoticeTitle")}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#6a5b51] sm:text-[16px]">
                {paymentStateMessage}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-full border border-[#efcfbc] bg-white/82 px-4 py-2 text-[12px] font-semibold text-[#7c6457] shadow-[0_8px_18px_rgba(42,26,15,0.05)]">
                  Invoice: <span className="text-[#1f1713]">{invoice.invoiceNumber}</span>
                </div>
                <div className="rounded-full border border-[#efcfbc] bg-white/82 px-4 py-2 text-[12px] font-semibold text-[#7c6457] shadow-[0_8px_18px_rgba(42,26,15,0.05)]">
                  Status: <span className="text-[#c35f31]">{localizedStatus}</span>
                </div>
                {invoice.dueOn ? (
                  <div className="rounded-full border border-[#efcfbc] bg-white/82 px-4 py-2 text-[12px] font-semibold text-[#7c6457] shadow-[0_8px_18px_rgba(42,26,15,0.05)]">
                    Due: <span className="text-[#1f1713]">{invoice.dueOn}</span>
                  </div>
                ) : null}
              </div>

              {isWaitingForVendorAcceptance && invoice.order.status ? (
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9c897d]">
                  {invoiceDetailsT("currentOrderStatus")}: {invoice.order.status}
                </p>
              ) : null}
            </div>

            <div className="grid min-w-[240px] grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[320px] lg:grid-cols-1">
              <div className="rounded-[22px] border border-[#efc7af] bg-white/88 px-5 py-4 shadow-[0_14px_30px_rgba(42,26,15,0.07)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b17859]">
                  Amount Due
                </p>
                <p className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[#1f1713]">
                  {invoice.dueAmount}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#efc7af] bg-[linear-gradient(135deg,#fff8f2_0%,#fff1e7_100%)] px-5 py-4 shadow-[0_14px_30px_rgba(42,26,15,0.07)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b17859]">
                  Payment Method
                </p>
                <p className="mt-2 text-[16px] font-semibold text-[#1f1713]">
                  {paymentTypeLabel}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden rounded-[20px] border border-[#e2d5ca] bg-[#fffdfa] p-4 shadow-[0_12px_28px_rgba(31,20,12,0.06)] md:p-5">

        <div className="relative flex flex-col gap-3 border-b border-[#ebded3] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#f0d1bc] bg-[#fff2e8] text-[#cf6e38]">
              <FiFileText className="text-[21px]" />
            </div>
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getInvoiceStatusClasses(invoice.status)}`}>
                {localizedStatus}
              </span>
              <h2 className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-[#1c1714] sm:text-[34px]">
                {invoice.invoiceNumber}
              </h2>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ab8f7f]">
              {invoiceDetailsT("summaryTitle")}
            </p>
            <p className="mt-1 text-[30px] font-semibold tracking-[-0.05em] text-[#c75d2d] sm:text-[36px]">
              {invoice.totalAmount}
            </p>
          </div>
        </div>

        <div className="relative mt-3 grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-3 xl:grid-cols-5">
          <InvoiceInlineDetail
            label={invoiceDetailsT("vendor")}
            value={invoice.vendor.name || invoiceDetailsT("vendorFallback")}
          />
          <InvoiceInlineDetail label={invoiceDetailsT("event")} value={eventNameLabel} />
          <InvoiceInlineDetail label={invoiceDetailsT("issuedOn")} value={invoice.issuedOn} />
          <InvoiceInlineDetail label={invoiceDetailsT("dueOn")} value={invoice.dueOn} />
          <InvoiceInlineDetail label={invoiceDetailsT("subtotal")} value={invoice.subtotal} />
          <InvoiceInlineDetail label={invoiceDetailsT("deliveryFee")} value={invoice.deliveryFee} />
          <InvoiceInlineDetail label={invoiceDetailsT("tax")} value={invoice.taxAmount} />
          <InvoiceInlineDetail label={invoiceDetailsT("tip")} value={invoice.tipAmount} />
          <InvoiceInlineDetail
            label={invoiceDetailsT("paymentType")}
            value={paymentTypeLabel}
          />
        </div>
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="contents">
          <DetailSection className="xl:order-3 xl:col-span-2" title="Order & billing">
            <div className="overflow-x-auto">
              <div className="min-w-[580px]">
              <div className="mb-1 grid grid-cols-[minmax(0,1fr)_74px_110px_120px] border-b border-[#eee3db] pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">
                <span>Menu name</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Unit price</span>
                <span className="text-right">Total</span>
              </div>
            {invoice.lineItems.length > 0 ? (
              <div>
                {invoice.lineItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_74px_110px_120px] items-start border-b border-[#eee3db] py-3 last:border-b-0"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-[17px] font-semibold text-[#1f1f1f]">
                        {item.label || "Menu"}
                      </p>
                      {item.description ? (
                        <p className="mt-1 text-sm leading-6 text-[#6f665f]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <p className="pt-1 text-center text-sm font-medium text-[#4b463f]">{item.quantity}</p>
                    <p className="pt-1 text-right text-sm font-medium text-[#4b463f]">{item.unitPrice}</p>
                    <p className="pt-1 text-right text-sm font-semibold text-[#1f1f1f]">{item.totalPrice}</p>
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
              </div>
            </div>

          <section className="mt-5 border-t border-[#e6d9cf] pt-4">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#9c7b68]">
              {invoiceDetailsT("eventAndBilling")}
            </h3>
            <div className="mt-3 grid md:grid-cols-2 md:divide-x md:divide-[#eee3db]">
              <div className="divide-y divide-[#eee3db] md:pr-6">
                <div className="flex items-start gap-3 py-3">
                  <FiCalendar className="mt-0.5 shrink-0 text-[#cf6e38]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">Event</p>
                    <p className="mt-1 font-semibold text-[#1f1f1f]">{eventNameLabel}</p>
                    {eventMetaLabel ? <p className="mt-1 leading-6 text-[#625a53]">{eventMetaLabel}</p> : null}
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <FiMapPin className="mt-0.5 shrink-0 text-[#cf6e38]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">{invoiceDetailsT("deliveryInfo")}</p>
                    <p className="mt-1 leading-6 text-[#4b463f]">{deliveryAddressLabel}</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#eee3db] md:pl-6">
                <div className="flex items-start gap-3 py-3">
                  <FiUser className="mt-0.5 shrink-0 text-[#cf6e38]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">{invoiceDetailsT("billingContact")}</p>
                    <p className="mt-1 leading-6 text-[#4b463f]">{invoice.customer.name || billingContactLabel}<br />{invoice.customer.phone || invoice.billingAddress.phone || invoiceDetailsT("noPhoneAdded")}<br />{invoice.customer.email || invoiceDetailsT("notProvided")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <FiCreditCard className="mt-0.5 shrink-0 text-[#cf6e38]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">{invoiceDetailsT("billingAddress")}</p>
                    <p className="mt-1 leading-6 text-[#4b463f]">{billingAddressLabel}</p>
                  </div>
                </div>
              </div>
            </div>
            {invoice.note ? (
              <div className="mt-1 border-t border-[#eee3db] pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78772]">{invoiceDetailsT("note")}</p>
                <p className="mt-1 text-sm leading-7 text-[#6d645c]">{invoice.note}</p>
              </div>
            ) : null}
          </section>
          </DetailSection>

          {invoice.paymentHistory?.length ? (
            <DetailSection className="xl:order-4" title={invoiceDetailsT("paymentHistory")}>
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

        </div>

        <div className="contents">
          {canReportPayment ? (
            <DetailSection className="h-full xl:order-2" title={invoiceDetailsT("reportBankTransferPayment")}>
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

          {isBankTransfer && (
            invoice.bankTransferInstructions ||
            invoice.bankAccountName ||
            invoice.bankAccountNumber ||
            invoice.bankName ||
            invoice.invoiceNumber
          ) ? (
            <DetailSection className="h-full xl:order-1" title={invoiceDetailsT("bankTransferDetails")}>
              <div className="space-y-4">
                {invoice.bankTransferInstructions ? (
                  <div className="rounded-[22px] border border-[#f0ddd1] bg-[linear-gradient(135deg,#fff8f2_0%,#fff1e6_100%)] px-5 py-4 shadow-[0_10px_24px_rgba(53,33,20,0.05)]">
                    <p className="text-sm leading-7 text-[#6d645c]">{invoice.bankTransferInstructions}</p>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {invoice.bankAccountName ? (
                    <DetailRow label={invoiceDetailsT("accountName")} value={invoice.bankAccountName} />
                  ) : null}
                  {invoice.bankAccountNumber ? (
                    <DetailRow label={invoiceDetailsT("accountNumber")} value={invoice.bankAccountNumber} />
                  ) : null}
                  {invoice.bankName ? (
                    <DetailRow label={invoiceDetailsT("bankName")} value={invoice.bankName} />
                  ) : null}
                  {invoice.invoiceNumber ? (
                    <DetailRow label={invoiceDetailsT("referenceKid")} value={invoice.invoiceNumber} />
                  ) : null}
                </div>
              </div>
            </DetailSection>
          ) : null}

          {invoice.paymentReport ? (
            <DetailSection className="xl:order-5" title={invoiceDetailsT("reportedPaymentDetails")}>
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
