import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFileText,
  FiSearch,
} from "react-icons/fi";
import {
  vendorInvoiceOverview,
  vendorInvoiceRecords,
  vendorInvoiceTotals,
} from "../data/vendorDashboardData";

const STATUS_OPTIONS = [
  { label: "Status: All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

const DATE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "This year", value: "year" },
  { label: "All time", value: "all" },
];

const PAGE_SIZE = 8;
const TODAY = new Date("2026-04-22T00:00:00");

function getStatusClasses(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "paid") {
    return "bg-[#dff6dd] text-[#2d9b42]";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#fff4d6] text-[#cf8b19]";
  }

  return "bg-[#fde2d9] text-[#d06036]";
}

function OverviewCard({ label, value }) {
  return (
    <article className="rounded-[18px] border border-[#ddd5cd] bg-white p-4 shadow-[0_8px_20px_rgba(30,30,30,0.04)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff3ec] text-[#cf5c2f]">
        <FiFileText className="text-[18px]" />
      </div>
      <p className="mt-4 text-[2rem] font-extrabold leading-none text-[#1f1f1f]">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold text-[#6d665f]">{label}</p>
    </article>
  );
}

function TotalCard({ label, value }) {
  return (
    <article className="rounded-[18px] border border-[#ece2d8] bg-[#fffdfa] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.04em] text-[#857c73]">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold text-[#1f1f1f]">{value}</p>
    </article>
  );
}

function isWithinDateRange(dateValue, selectedRange) {
  if (selectedRange === "all") {
    return true;
  }

  const candidate = new Date(`${dateValue}T00:00:00`);

  if (selectedRange === "year") {
    return candidate.getFullYear() === TODAY.getFullYear();
  }

  const rangeDays = Number(selectedRange);
  const diffInDays = Math.floor(
    (TODAY.getTime() - candidate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diffInDays >= 0 && diffInDays < rangeDays;
}

function FilterMenu({
  isOpen,
  label,
  onToggle,
  options,
  selectedValue,
  onSelect,
  menuRef,
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-3 text-sm font-semibold text-[#2d2d2d] transition hover:bg-[#faf7f3]"
      >
        <span>
          {options.find((option) => option.value === selectedValue)?.label ?? label}
        </span>
        <FiChevronDown
          className={[
            "text-[15px] transition",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[180px] rounded-2xl border border-[#e5ddd5] bg-white p-2 shadow-[0_18px_40px_rgba(31,24,19,0.12)]">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
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
        </div>
      ) : null}
    </div>
  );
}

export default function VendorInvoicesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("7");
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
      const matchesDate = isWithinDateRange(
        invoice.deliveredAt,
        selectedDateRange,
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
  }, [searchValue, selectedDateRange, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedStatus, selectedDateRange]);

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

  const paginationNumbers = Array.from(
    { length: Math.min(totalPages, 4) },
    (_, index) => index + 1,
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">Invoice</h1>
        <p className="mt-2 text-sm text-[#625a52]">
          Track all invoice and payment records.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {vendorInvoiceOverview.map((item) => (
          <OverviewCard key={item.label} {...item} />
        ))}
      </section>

      <section className="rounded-[28px] border border-[#ddd4cb] bg-white p-4 shadow-[0_16px_34px_rgba(28,28,28,0.06)] md:p-5">
        <div className="grid gap-3 border-b border-[#ece4dc] pb-4 md:grid-cols-2 xl:grid-cols-4">
          {vendorInvoiceTotals.map((item) => (
            <TotalCard key={item.label} {...item} />
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

          <div className="flex flex-wrap gap-3">
            <FilterMenu
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
              className="inline-flex items-center gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-3 text-sm font-semibold text-[#2d2d2d] transition hover:bg-[#faf7f3]"
            >
              <FiDownload className="text-[15px]" />
              <span>Export</span>
            </button>

            <FilterMenu
              isOpen={isDateMenuOpen}
              label="Last 7 days"
              onToggle={() => {
                setIsDateMenuOpen((open) => !open);
                setIsStatusMenuOpen(false);
              }}
              options={DATE_OPTIONS}
              selectedValue={selectedDateRange}
              onSelect={(value) => {
                setSelectedDateRange(value);
                setIsDateMenuOpen(false);
              }}
              menuRef={dateMenuRef}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2.5">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#80786f]">
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
              {visibleInvoices.map((invoice, index) => (
                <tr
                  key={`${invoice.id}-${invoice.dueOn}-${index}`}
                  className="rounded-2xl bg-[#fcfbf9] text-sm text-[#232323] shadow-[0_6px_16px_rgba(20,20,20,0.04)]"
                >
                  <td className="rounded-l-2xl px-3 py-3 font-semibold">
                    {invoice.id}
                  </td>
                  <td className="px-3 py-3">{invoice.vendor}</td>
                  <td className="px-3 py-3">{invoice.event}</td>
                  <td className="px-3 py-3">{invoice.deliveredOn}</td>
                  <td className="px-3 py-3">{invoice.dueOn}</td>
                  <td className="px-3 py-3 font-semibold">{invoice.amount}</td>
                  <td className="rounded-r-2xl px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleInvoices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-sm text-[#777777]">
              No invoices matched your current filter.
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#ece4dc] pt-4 text-sm text-[#666666] md:flex-row md:items-center md:justify-between">
          <p>
            Showing {startIndex} - {endIndex} of {filteredInvoices.length} invoices
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ddd4cb] text-[#6c6c6c] transition hover:bg-[#faf7f3] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <FiChevronLeft className="text-[14px]" />
            </button>

            {paginationNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={[
                  "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition",
                  pageNumber === safeCurrentPage
                    ? "bg-[#cf5c2f] text-white shadow-[0_8px_16px_rgba(207,92,47,0.18)]"
                    : "text-[#4d4d4d] hover:bg-[#faf7f3]",
                ].join(" ")}
              >
                {pageNumber}
              </button>
            ))}

            {totalPages > 4 ? <span className="px-1 text-xs">...</span> : null}

            {totalPages > 4 ? (
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                className={[
                  "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition",
                  totalPages === safeCurrentPage
                    ? "bg-[#cf5c2f] text-white shadow-[0_8px_16px_rgba(207,92,47,0.18)]"
                    : "text-[#4d4d4d] hover:bg-[#faf7f3]",
                ].join(" ")}
              >
                {totalPages}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ddd4cb] text-[#6c6c6c] transition hover:bg-[#faf7f3] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <FiChevronRight className="text-[14px]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
