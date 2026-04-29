import { FiArrowLeft, FiDownload, FiFileText } from "react-icons/fi";
import { Link, Navigate, useParams } from "react-router-dom";
import { getVendorInvoiceById } from "../data/vendorDashboardData";

function buildInvoiceExportContent(invoice) {
  return [
    "Invoice Details",
    "",
    `Invoice ID: ${invoice.id}`,
    `Vendor: ${invoice.vendor}`,
    `Event: ${invoice.event}`,
    `Delivered On: ${invoice.deliveredOn}`,
    `Due On: ${invoice.dueOn}`,
    `Amount: ${invoice.amount}`,
    `Status: ${invoice.status}`,
  ].join("\n");
}

function exportInvoice(invoice) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([buildInvoiceExportContent(invoice)], {
    type: "text/plain;charset=utf-8",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${invoice.id.replace(/#/g, "")}-invoice.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#eadfd5] bg-[#fffdfa] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b8b7f]">
        {label}
      </p>
      <p className="mt-2 text-[16px] font-semibold text-[#1f1f1f]">{value}</p>
    </div>
  );
}

export default function VendorInvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const decodedInvoiceId = invoiceId ? decodeURIComponent(invoiceId) : "";
  const invoice = getVendorInvoiceById(decodedInvoiceId);

  if (!invoice) {
    return <Navigate to="/vendor-dashboard/invoices" replace />;
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
            Back to invoices
          </Link>
          <h1 className="mt-3 type-h2 text-[#191919]">Invoice Details</h1>
          <p className="mt-2 type-para text-[#635b53]">
            Review the invoice information and export a copy when needed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportInvoice(invoice)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
        >
          <FiDownload className="text-[15px]" />
          Export Invoice
        </button>
      </div>

      <section className="rounded-[28px] border border-[#ddd4cb] bg-white p-4 shadow-[0_16px_34px_rgba(28,28,28,0.06)] md:p-6">
        <div className="flex flex-col gap-4 border-b border-[#ece4dc] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#fff1e8] text-[#cf6e38]">
              <FiFileText className="text-[24px]" />
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9c897d]">
                {invoice.status}
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1f1f1f]">
                {invoice.id}
              </h2>
              <p className="mt-2 text-[15px] text-[#685e56]">
                {invoice.event} for {invoice.vendor}
              </p>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#f0ddd1] bg-[#fff7f2] px-4 py-4 text-left sm:min-w-[220px] sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aa775a]">
              Invoice Amount
            </p>
            <p className="mt-2 text-[28px] font-semibold text-[#cf6e38]">
              {invoice.amount}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailRow label="Vendor" value={invoice.vendor} />
          <DetailRow label="Event" value={invoice.event} />
          <DetailRow label="Delivered On" value={invoice.deliveredOn} />
          <DetailRow label="Due On" value={invoice.dueOn} />
        </div>
      </section>
    </div>
  );
}
