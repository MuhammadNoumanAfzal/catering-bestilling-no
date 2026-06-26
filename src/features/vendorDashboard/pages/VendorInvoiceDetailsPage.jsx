import { useEffect } from "react";
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
import DashboardPageHero from "../components/DashboardPageHero";
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
          Unable to load invoice
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {selectedInvoiceDetailError}
        </p>
        <button
          type="button"
          onClick={() => dispatch(fetchInvoiceDetail(decodedInvoiceId))}
          className="mt-5 rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
        >
          Try again
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
      <div className="flex flex-col gap-3">
        <Link
          to="/vendor-dashboard/invoices"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#cf6e38] transition hover:text-[#b85e2a]"
        >
          <FiArrowLeft className="text-[15px]" />
          Back to invoices
        </Link>

        <DashboardPageHero
          eyebrow="Finance detail"
          title="Invoice Details"
          description="Review billing details, payment meta, and line items before exporting or sharing this invoice."
          stats={[
            {
              label: "Status",
              value: invoice.status,
              note: "Current invoice payment state.",
            },
            {
              label: "Amount",
              value: invoice.totalAmount,
              note: "Final billed amount on this invoice.",
            },
            {
              label: "Due",
              value: invoice.dueOn || "N/A",
              note: "Scheduled due date from the API.",
            },
            {
              label: "Paid",
              value: invoice.paidAmount,
              note: "Amount recorded as settled so far.",
            },
          ]}
        />

        <div className="flex justify-start sm:justify-end">
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
            {downloadStatus === "loading" ? "Preparing PDF..." : "Export PDF"}
          </button>
        </div>
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
              Invoice Amount
            </p>
            <p className="mt-2 text-[24px] font-semibold text-[#cf6e38] sm:text-[28px]">
              {invoice.totalAmount}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <DetailRow label="Vendor" value={invoice.vendor.name} />
          <DetailRow label="Event" value={invoice.order.eventName} />
          <DetailRow label="Issued On" value={invoice.issuedOn} />
          <DetailRow label="Due On" value={invoice.dueOn} />
        </div>

        <div className="mt-6 border-t border-[#ece4dc] pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#9c897d]">
            Amount Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <DetailRow label="Subtotal" value={invoice.subtotal} />
            <DetailRow label="Delivery Fee" value={invoice.deliveryFee} />
            <DetailRow label="Tax" value={invoice.taxAmount} />
            <DetailRow label="Tip" value={invoice.tipAmount} />
          </div>
        </div>
      </section>

      {downloadError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {downloadError}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <DetailSection title="Line Items">
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
            <p className="text-sm text-[#706760]">No line items available.</p>
          )}
        </DetailSection>

        <div className="space-y-6">
          <DetailSection title="Invoice Meta">
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Paid On" value={invoice.paidOn || "Not paid yet"} />
              <DetailRow label="Payment Type" value={invoice.paymentType} />
              <DetailRow
                label="Transaction Reference"
                value={invoice.transactionReference}
              />
              <DetailRow label="Paid Amount" value={invoice.paidAmount} />
              <DetailRow label="Due Amount" value={invoice.dueAmount} />
            </div>
          </DetailSection>

          <DetailSection title="Event & Billing">
            <div className="space-y-4 text-sm text-[#4b463f]">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">
                    {invoice.order.eventName}
                  </p>
                  <p className="mt-1">
                    {invoice.order.eventDate} | {invoice.order.personCount} guests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">Delivery Info</p>
                  <p className="mt-1">{invoice.order.deliveryAddressStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiUser className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">Billing Contact</p>
                  <p className="mt-1">
                    {invoice.vendor.companyName || invoice.vendor.name}
                  </p>
                  <p>{invoice.billingAddress.phone || "No phone added"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiCreditCard className="mt-0.5 text-[#cf6e38]" />
                <div>
                  <p className="font-semibold text-[#1f1f1f]">Billing Address</p>
                  <p className="mt-1">
                    {[
                      invoice.billingAddress.address,
                      invoice.billingAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </p>
                </div>
              </div>

              {invoice.note ? (
                <div className="rounded-[18px] border border-[#f1e3d6] bg-[#fff8f3] px-4 py-3">
                  <p className="font-semibold text-[#1f1f1f]">Note</p>
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
