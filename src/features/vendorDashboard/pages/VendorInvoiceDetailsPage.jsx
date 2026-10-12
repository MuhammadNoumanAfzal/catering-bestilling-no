import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLoadingState from "../components/DashboardLoadingState";
import { getInvoiceStatusClasses } from "../components/invoices/invoiceUtils";
import { clearSelectedInvoiceDetail, fetchInvoiceDetail } from "../invoicesSlice";

export default function VendorInvoiceDetailsPage() {
  const { t } = useTranslation();
  const { invoiceId } = useParams();
  const id = invoiceId ? decodeURIComponent(invoiceId) : "";
  const dispatch = useDispatch();
  const { selectedInvoiceDetail: invoice, selectedInvoiceDetailStatus: status } =
    useSelector((state) => state.invoices);
  const label = (key) => t(`clientInvoice.${key}`);

  useEffect(() => {
    if (id) dispatch(fetchInvoiceDetail(id));
    return () => { dispatch(clearSelectedInvoiceDetail()); };
  }, [id, dispatch]);

  if (status === "loading") {
    return <DashboardLoadingState title={label("loading")} description="" rows={4} columns={4} />;
  }
  if (status === "failed" || (invoice && !invoice.canViewInvoice)) {
    return (
      <section className="py-8 text-center">
        <h2 className="text-lg font-semibold">{label("loadError")}</h2>
        <button type="button" onClick={() => dispatch(fetchInvoiceDetail(id))}
          className="mt-4 rounded-[8px] bg-[#cf6e38] px-4 py-2 text-sm font-semibold text-white">
          {label("retry")}
        </button>
      </section>
    );
  }
  if (!invoice) return null;
  const statusLabel = t(`vendorPanel.dashboard.statuses.${invoice.statusKey}`, {
    defaultValue: t(`vendorPanel.invoices.${invoice.statusKey}`, { defaultValue: invoice.status }),
  });
  const description = (value) => `${value || ""}`
    .replace(/Note:/gi, `${label("note")}:`)
    .replace(/Add-on:/gi, `${label("addOn")}:`);

  return (
    <div className="mx-auto w-full max-w-[1000px] text-[#24272b]">
      <Link to="/client-dashboard/invoices" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#62676e] transition hover:text-[#b75729]">
        <FiArrowLeft />{label("back")}
      </Link>
      <article className="border border-[#e2e5e8] bg-white px-5 py-7 shadow-[0_4px_24px_rgba(20,25,30,0.04)] sm:px-10 sm:py-10">
      <header className="grid gap-6 border-b-2 border-[#252a30] pb-7 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <img src="/home/logo (2).png" alt="Go Catering" className="h-14 w-36 object-contain object-left" />
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getInvoiceStatusClasses(invoice.status)}`}>
            {statusLabel}
          </span>
        </div>
        <div className="min-w-0 sm:text-right">
          <h1 className="text-[24px] font-semibold leading-tight">{label("title")}</h1>
          <p className="mt-2 break-words text-[18px] font-medium text-[#62676e]">{invoice.invoiceNumber}</p>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex gap-6 sm:justify-end"><dt className="text-[#62676e]">{label("issued")}</dt><dd className="font-medium tabular-nums">{invoice.issuedOn || label("notProvided")}</dd></div>
            <div className="flex gap-6 sm:justify-end"><dt className="text-[#62676e]">{label("due")}</dt><dd className="font-medium tabular-nums">{invoice.dueOn || label("notProvided")}</dd></div>
          </dl>
        </div>
      </header>

      <div className="grid gap-6 border-b border-[#e5e7eb] py-7 sm:grid-cols-2">
        <section className="min-w-0">
          <h2 className="text-xs font-semibold uppercase text-[#62676e]">{label("customer")}</h2>
          <p className="mt-2 break-words text-[15px] font-semibold">{invoice.customer.name || label("notProvided")}</p>
          {invoice.customer.email ? <p className="mt-1 break-all text-sm leading-6 text-[#62676e]">{invoice.customer.email}</p> : null}
          {invoice.customer.phone ? <p className="text-sm leading-6 text-[#62676e]">{invoice.customer.phone}</p> : null}
        </section>
        <section className="min-w-0">
          <h2 className="text-xs font-semibold uppercase text-[#62676e]">{label("vendor")}</h2>
          <p className="mt-2 break-words text-[15px] font-semibold">{invoice.vendor.name || label("notProvided")}</p>
          <p className="mt-1 break-words text-sm leading-6 text-[#62676e]">{invoice.order.eventName || label("notProvided")}</p>
        </section>
      </div>

      <section className="min-w-0 py-7">
        <h2 className="mb-4 text-[16px] font-semibold">{label("items")}</h2>
        {invoice.lineItems.length ? (
          <>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[520px] text-sm">
              <colgroup><col className="w-[45%]" /><col className="w-[15%]" /><col className="w-[20%]" /><col className="w-[20%]" /></colgroup>
              <thead className="border-b border-[#e5e7eb] bg-[#f5f6f7] text-left text-[#62676e]">
                <tr>
                  <th className="py-3 pl-3 pr-4 font-medium">{label("item")}</th>
                  <th className="px-3 py-2 text-center font-medium">{label("quantity")}</th>
                  <th className="px-3 py-2 text-right font-medium">{label("unitPrice")}</th>
                  <th className="py-3 pl-3 pr-3 text-right font-medium">{label("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#e5e7eb] align-top transition hover:bg-[#fafbfc]">
                    <td className="py-4 pl-3 pr-4">
                      <p className="font-semibold">{item.label || label("item")}</p>
                      {item.description ? <p className="mt-1 whitespace-pre-line leading-6 text-[#6f665f]">{description(item.description)}</p> : null}
                    </td>
                    <td className="px-3 py-4 text-center"><span className="inline-flex min-w-8 justify-center rounded-[4px] bg-[#f0f2f4] px-2 py-0.5 font-medium">{item.quantity}</span></td>
                    <td className="px-3 py-4 text-right whitespace-nowrap tabular-nums">{item.unitPrice}</td>
                    <td className="py-4 pl-3 pr-3 text-right whitespace-nowrap font-semibold tabular-nums">{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#e5e7eb] border-y border-[#e5e7eb] sm:hidden">
            {invoice.lineItems.map((item) => (
              <article key={item.id} className="py-4">
                <h3 className="break-words text-[15px] font-semibold leading-6">{item.label || label("item")}</h3>
                {item.description ? <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#62676e]">{description(item.description)}</p> : null}
                <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div><dt className="text-xs text-[#62676e]">{label("quantity")}</dt><dd className="mt-1 font-medium">{item.quantity}</dd></div>
                  <div><dt className="text-xs text-[#62676e]">{label("unitPrice")}</dt><dd className="mt-1 break-words tabular-nums">{item.unitPrice}</dd></div>
                  <div className="text-right"><dt className="text-xs text-[#62676e]">{label("amount")}</dt><dd className="mt-1 break-words font-semibold tabular-nums">{item.totalPrice}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          </>
        ) : <p className="py-4 text-sm text-[#74675f]">{label("noItems")}</p>}
        <dl className="ml-auto mt-5 w-full max-w-[280px] space-y-3 border-t border-[#e5e7eb] pt-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-[#62676e]">{label("deliveryFee")}</dt><dd className="font-medium tabular-nums">{invoice.deliveryFee}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[#62676e]">{label("tip")}</dt><dd className="font-medium tabular-nums">{invoice.tipAmount}</dd></div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-[#252a30] pt-4"><dt className="font-semibold">{label("total")}</dt><dd className="text-[24px] font-semibold tabular-nums">{invoice.totalAmount}</dd></div>
        </dl>
      </section>

      <section className="border-t border-[#e5e7eb] pt-6">
        <h2 className="text-[16px] font-semibold">{label("delivery")}</h2>
        <dl className="mt-4 grid gap-5 sm:grid-cols-[1fr_1fr_2fr] [&_dt]:text-[13px] [&_dt]:text-[#62676e] [&_dd]:text-sm [&_dd]:font-medium [&_dd]:leading-6">
          <div><dt>{label("date")}</dt><dd className="mt-1">{invoice.order.eventDate || label("notProvided")}</dd></div>
          <div><dt>{label("guests")}</dt><dd className="mt-1">{invoice.order.personCount || label("notProvided")}</dd></div>
          <div><dt>{label("address")}</dt><dd className="mt-1 break-words">{invoice.order.deliveryAddressStr || label("notProvided")}</dd></div>
        </dl>
        {invoice.note ? <p className="mt-4 whitespace-pre-line text-sm leading-6"><span className="font-semibold">{label("note")}: </span>{invoice.note}</p> : null}
      </section>
      </article>
    </div>
  );
}
