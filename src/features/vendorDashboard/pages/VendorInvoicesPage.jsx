import { useEffect, useMemo, useRef, useState } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import InvoiceFilterMenu from "../components/invoices/InvoiceFilterMenu";
import InvoiceOverviewCard from "../components/invoices/InvoiceOverviewCard";
import InvoicePagination from "../components/invoices/InvoicePagination";
import InvoiceTable from "../components/invoices/InvoiceTable";
import InvoiceTotalCard from "../components/invoices/InvoiceTotalCard";
import {
  vendorInvoiceOverview,
  vendorInvoiceRecords,
  vendorInvoiceTotals,
} from "../data/vendorDashboardData";
import {
  DATE_OPTIONS,
  getInvoiceDateFilterLabel,
  isInvoiceWithinDateRange,
  PAGE_SIZE,
  STATUS_OPTIONS,
} from "../components/invoices/invoiceUtils";

export default function VendorInvoicesPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("7");
  const [customDateRange, setCustomDateRange] = useState({
    from: "2025-02-05",
    to: "2025-03-05",
  });
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const statusMenuRef = useRef(null);
  const dateMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }

      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setIsDateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredInvoices = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return vendorInvoiceRecords.filter((invoice) => {
      const matchesStatus =
        selectedStatus === "all"
          ? true
          : invoice.status.toLowerCase() === selectedStatus;
      const matchesDate = isInvoiceWithinDateRange(
        invoice.deliveredAt,
        selectedDateRange,
        customDateRange,
      );

      if (!matchesStatus || !matchesDate) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        invoice.id,
        invoice.vendor,
        invoice.event,
        invoice.deliveredOn,
        invoice.dueOn,
        invoice.amount,
        invoice.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [customDateRange, searchValue, selectedDateRange, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [customDateRange, searchValue, selectedStatus, selectedDateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleInvoices = filteredInvoices.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );
  const startIndex =
    filteredInvoices.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(
    safeCurrentPage * PAGE_SIZE,
    filteredInvoices.length,
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 ">Invoice</h1>
        <p className="mt-2 type-para ">
          Track all invoice and payment records.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {vendorInvoiceOverview.map((item) => (
          <InvoiceOverviewCard key={item.label} {...item} />
        ))}
      </section>

      <section className="rounded-[28px] border border-[#ddd4cb] bg-white p-4 shadow-[0_16px_34px_rgba(28,28,28,0.06)] md:p-5">
        <div className="grid gap-3 border-b border-[#ece4dc] pb-4 md:grid-cols-2 xl:grid-cols-4">
          {vendorInvoiceTotals.map((item) => (
            <InvoiceTotalCard key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-b border-[#ece4dc] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex w-full items-center gap-2 rounded-full border border-[#ded6ce] bg-[#fcfaf8] px-4 py-3 text-sm text-[#7a7a7a] lg:max-w-[320px]">
            <FiSearch className="text-[16px]" />
            <input
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-[#242424] outline-none placeholder:text-[#aaaaaa]"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <InvoiceFilterMenu
              isOpen={isStatusMenuOpen}
              label="Status: All"
              onToggle={() => {
                setIsStatusMenuOpen((open) => !open);
                setIsDateMenuOpen(false);
              }}
              options={STATUS_OPTIONS}
              selectedValue={selectedStatus}
              onSelect={(value) => {
                setSelectedStatus(value);
                setIsStatusMenuOpen(false);
              }}
              menuRef={statusMenuRef}
            />

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-3 text-sm font-semibold text-[#2d2d2d] transition hover:bg-[#faf7f3] sm:w-auto"
            >
              <FiDownload className="text-[15px]" />
              <span>Export</span>
            </button>

            <InvoiceFilterMenu
              isOpen={isDateMenuOpen}
              label={getInvoiceDateFilterLabel(
                selectedDateRange,
                customDateRange,
              )}
              onToggle={() => {
                setIsDateMenuOpen((open) => !open);
                setIsStatusMenuOpen(false);
              }}
              options={DATE_OPTIONS}
              selectedValue={selectedDateRange}
              onSelect={(value) => {
                setSelectedDateRange(value);
                if (value !== "custom-date") {
                  setIsDateMenuOpen(false);
                }
              }}
              menuRef={dateMenuRef}
              renderContent={() => (
                <div className="sm:min-w-[260px]">
                  {DATE_OPTIONS.map((option) => {
                    const isSelected = option.value === selectedDateRange;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedDateRange(option.value);
                          if (option.value !== "custom-date") {
                            setIsDateMenuOpen(false);
                          }
                        }}
                        className={[
                          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition",
                          isSelected
                            ? "bg-[#fff1e8] font-semibold text-[#c85f33]"
                            : "text-[#2f2f2f] hover:bg-[#faf7f3]",
                        ].join(" ")}
                      >
                        <span>{option.label}</span>
                        {isSelected ? (
                          <span className="text-xs font-semibold">Active</span>
                        ) : null}
                      </button>
                    );
                  })}

                  {selectedDateRange === "custom-date" ? (
                    <div className="mt-2 rounded-xl border border-[#f0e2d7] bg-[#fff8f3] p-3">
                      <div className="grid gap-3">
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#9a6d53]">
                            From
                          </span>
                          <input
                            type="date"
                            value={customDateRange.from}
                            max={customDateRange.to || undefined}
                            onChange={(event) =>
                              setCustomDateRange((current) => ({
                                ...current,
                                from: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-[#e7d8cb] bg-white px-3 py-2 text-sm text-[#2d2d2d] outline-none"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#9a6d53]">
                            To
                          </span>
                          <input
                            type="date"
                            value={customDateRange.to}
                            min={customDateRange.from || undefined}
                            onChange={(event) =>
                              setCustomDateRange((current) => ({
                                ...current,
                                to: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-[#e7d8cb] bg-white px-3 py-2 text-sm text-[#2d2d2d] outline-none"
                          />
                        </label>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsDateMenuOpen(false)}
                          className="rounded-full bg-[#cf6e38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bc602d]"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            />
          </div>
        </div>

        <InvoiceTable
          invoices={visibleInvoices}
          onOpenDetails={(invoice) =>
            navigate(`/vendor-dashboard/invoices/${encodeURIComponent(invoice.id)}`)
          }
        />

        <InvoicePagination
          currentPage={safeCurrentPage}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          totalItems={filteredInvoices.length}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
