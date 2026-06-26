import { useEffect, useRef, useState } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardPageHero from "../components/DashboardPageHero";
import InvoiceFilterMenu from "../components/invoices/InvoiceFilterMenu";
import InvoiceOverviewCard from "../components/invoices/InvoiceOverviewCard";
import InvoicePagination from "../components/invoices/InvoicePagination";
import InvoiceTable from "../components/invoices/InvoiceTable";
import InvoiceTotalCard from "../components/invoices/InvoiceTotalCard";
import { fetchInvoices } from "../invoicesSlice";
import {
  DATE_OPTIONS,
  getInvoiceDateFilterLabel,
  getInvoiceQueryDateRange,
  PAGE_SIZE,
  STATUS_OPTIONS,
} from "../components/invoices/invoiceUtils";

function buildInvoiceCsv(invoices) {
  const rows = [
    ["Invoice", "Vendor", "Event", "Issued On", "Due On", "Amount", "Status"],
    ...invoices.map((invoice) => [
      invoice.invoiceNumberShort,
      invoice.vendor,
      invoice.event,
      invoice.issuedOn,
      invoice.dueOn,
      invoice.amount,
      invoice.status,
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((value) => `"${`${value ?? ""}`.replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

export default function VendorInvoicesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { records, overview, totals, totalCount, isLoading, error } =
    useSelector((state) => state.invoices);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    from: "",
    to: "",
  });
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const statusMenuRef = useRef(null);
  const dateMenuRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const { dateFrom, dateTo } = getInvoiceQueryDateRange(
      selectedDateRange,
      customDateRange,
    );

    dispatch(
      fetchInvoices({
        status: selectedStatus === "all" ? null : selectedStatus,
        search: debouncedSearchValue || null,
        dateFrom,
        dateTo,
        first: 100,
        after: null,
      }),
    );
  }, [
    customDateRange,
    debouncedSearchValue,
    dispatch,
    selectedDateRange,
    selectedStatus,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, selectedDateRange, selectedStatus, customDateRange]);

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

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleInvoices = records.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );
  const startIndex =
    records.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, records.length);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf5c2f] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  const paidInvoicesCount =
    overview.find((item) => item.label === "Paid Invoices")?.value ?? 0;
  const unpaidInvoicesCount =
    overview.find((item) => item.label === "Unpaid Invoices")?.value ?? 0;
  const overdueInvoicesCount =
    overview.find((item) => item.label === "Overdue Invoices")?.value ?? 0;

  return (
    <div className="space-y-6">
      <DashboardPageHero
        eyebrow="Finance"
        title="Invoices"
        description="Monitor payment health, export records, and keep a clean view of what has been billed, paid, and still outstanding."
        stats={[
          {
            label: "Loaded",
            value: records.length,
            note: "Invoices returned for the current dataset.",
          },
          {
            label: "Paid",
            value: paidInvoicesCount,
            note: "Invoices already settled successfully.",
          },
          {
            label: "Unpaid",
            value: unpaidInvoicesCount,
            note: "Invoices still awaiting payment.",
          },
          {
            label: "Overdue",
            value: overdueInvoicesCount,
            note: "Past due invoices needing a follow-up.",
          },
        ]}
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {overview.map((item) => (
          <InvoiceOverviewCard key={item.label} {...item} />
        ))}
      </section>

      <section className="rounded-[28px] border border-[#e6d9cd] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f3_100%)] p-4 shadow-[0_22px_44px_rgba(28,28,28,0.08)] md:p-5">
        <div className="grid grid-cols-2 gap-3 border-b border-[#ece4dc] pb-4 xl:grid-cols-4">
          {totals.map((item) => (
            <InvoiceTotalCard key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-b border-[#ece4dc] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex w-full items-center gap-2 rounded-full border border-[#ded6ce] bg-[#fcfaf8] px-4 py-3 text-sm text-[#7a7a7a] lg:max-w-[320px]">
            <FiSearch className="text-[16px]" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search invoice, vendor, event..."
              className="w-full bg-transparent text-sm text-[#242424] outline-none placeholder:text-[#aaaaaa]"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <InvoiceFilterMenu
              defaultValue="all"
              isOpen={isStatusMenuOpen}
              label={
                STATUS_OPTIONS.find((option) => option.value === selectedStatus)
                  ?.label ?? "Status: All"
              }
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
              onClick={() => {
                if (typeof window === "undefined" || records.length === 0) {
                  return;
                }

                const blob = new Blob([buildInvoiceCsv(records)], {
                  type: "text/csv;charset=utf-8",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "invoices.csv";
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                window.URL.revokeObjectURL(url);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-3 text-sm font-semibold text-[#2d2d2d] transition hover:bg-[#faf7f3] sm:w-auto"
            >
              <FiDownload className="text-[15px]" />
              <span>Export</span>
            </button>

            <InvoiceFilterMenu
              defaultValue="all"
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
                          const nextValue =
                            option.value === selectedDateRange ? "all" : option.value;

                          setSelectedDateRange(nextValue);
                          if (nextValue !== "custom-date") {
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
            navigate(
              `/vendor-dashboard/invoices/${encodeURIComponent(invoice.orderId)}`,
            )
          }
        />

        <InvoicePagination
          currentPage={safeCurrentPage}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          totalItems={records.length}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
