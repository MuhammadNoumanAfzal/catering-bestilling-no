import { getInvoiceStatusClasses } from "./invoiceUtils";

export default function InvoiceTable({ invoices }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-[760px] border-separate border-spacing-y-2.5">
        <thead>
          <tr className="text-left type-h6 font-semibold uppercase tracking-[0.06em]">
            <th className="px-3 py-2">Invoice ID</th>
            <th className="px-3 py-2">Vendor</th>
            <th className="px-3 py-2">Event</th>
            <th className="px-3 py-2">Delivered</th>
            <th className="px-3 py-2">Due On</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr
              key={`${invoice.id}-${invoice.dueOn}-${index}`}
              className="rounded-2xl bg-[#fcfbf9] type-para shadow-[0_6px_16px_rgba(20,20,20,0.04)]"
            >
              <td className="rounded-l-2xl px-3 py-3 font-semibold">{invoice.id}</td>
              <td className="px-3 py-3">{invoice.vendor}</td>
              <td className="px-3 py-3">{invoice.event}</td>
              <td className="px-3 py-3">{invoice.deliveredOn}</td>
              <td className="px-3 py-3">{invoice.dueOn}</td>
              <td className="px-3 py-3 font-semibold">{invoice.amount}</td>
              <td className="rounded-r-2xl px-3 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getInvoiceStatusClasses(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-sm text-[#777777]">
          No invoices matched your current filter.
        </div>
      ) : null}
    </div>
  );
}
