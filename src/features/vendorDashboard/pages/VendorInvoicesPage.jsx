import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import InvoiceFilterMenu from "../components/invoices/InvoiceFilterMenu";
import InvoiceOverviewCard from "../components/invoices/InvoiceOverviewCard";
import InvoicePagination from "../components/invoices/InvoicePagination";
import InvoiceTable from "../components/invoices/InvoiceTable";
import InvoiceTotalCard from "../components/invoices/InvoiceTotalCard";
import DashboardLoadingState from "../components/DashboardLoadingState";
import { fetchInvoices } from "../invoicesSlice";
import {
  DATE_OPTIONS,
  getInvoiceDateFilterLabel,
  getInvoiceQueryDateRange,
  PAGE_SIZE,
} from "../components/invoices/invoiceUtils";

function parseMoneyValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = `${value ?? ""}`
    .replace(/NOK/gi, "")
    .replace(/\s/g, "")
    .replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoneyValue(value, currency = "NOK") {
  return `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function isInvoicePaid(invoice) {
  const status = `${invoice.statusKey || invoice.status || ""}`.toLowerCase();
  return status === "paid" || status === "completed" || status === "delivered";
}

function isInvoiceOverdue(invoice) {
  const status = `${invoice.statusKey || invoice.status || ""}`.toLowerCase();
  return status === "overdue";
}

function isInvoicePending(invoice) {
  const status = `${invoice.statusKey || invoice.status || ""}`.toLowerCase();
  return status === "pending" || status === "unpaid" || status === "reported" || status === "overdue";
}

function isCurrentMonth(dateValue) {
  if (!dateValue) {
    return false;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const today = new Date();
  return parsedDate.getFullYear() === today.getFullYear() && parsedDate.getMonth() === today.getMonth();
}
export default function VendorInvoicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { records, isLoading, error } =
    useSelector((state) => state.invoices);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    from: "",
    to: "",
  });
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
        status: null,
        search: debouncedSearchValue || null,
        dateFrom,
        dateTo,
        first: 25,
        after: null,
      }),
    );
  }, [
    customDateRange,
    debouncedSearchValue,
    dispatch,
    selectedDateRange,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, selectedDateRange, customDateRange]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setIsDateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredRecords = records;

  const filteredTotalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, filteredTotalPages);
  const visibleInvoices = filteredRecords.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );
  const startIndex =
    filteredRecords.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, filteredRecords.length);

  const filteredOverview = useMemo(
    () => [
      {
        labelKey: "vendorPanel.invoices.overview.totalInvoices",
        value: filteredRecords.length,
      },
      {
        labelKey: "vendorPanel.invoices.overview.paidInvoices",
        value: filteredRecords.filter(isInvoicePaid).length,
      },
      {
        labelKey: "vendorPanel.invoices.overview.unpaidInvoices",
        value: filteredRecords.filter((invoice) => !isInvoicePaid(invoice)).length,
      },
      {
        labelKey: "vendorPanel.invoices.overview.overdueInvoices",
        value: filteredRecords.filter(isInvoiceOverdue).length,
      },
    ],
    [filteredRecords],
  );
  const filteredTotals = useMemo(() => {
    const getAmount = (invoice) => parseMoneyValue(invoice.amountRaw ?? invoice.amount);
    const getDueAmount = (invoice) => parseMoneyValue(invoice.dueAmountRaw ?? invoice.dueAmount ?? invoice.amountRaw ?? invoice.amount);
    const currency = filteredRecords.find((invoice) => invoice.currency)?.currency || "NOK";
    const totalSpent = filteredRecords.reduce((sum, invoice) => sum + getAmount(invoice), 0);
    const thisMonthSpent = filteredRecords
      .filter((invoice) => isCurrentMonth(invoice.issuedOnRaw || invoice.dueDateRaw || invoice.eventDateRaw))
      .reduce((sum, invoice) => sum + getAmount(invoice), 0);
    const pendingAmount = filteredRecords
      .filter(isInvoicePending)
      .reduce((sum, invoice) => sum + getDueAmount(invoice), 0);
    const overdueAmount = filteredRecords
      .filter(isInvoiceOverdue)
      .reduce((sum, invoice) => sum + getDueAmount(invoice), 0);

    return [
      {
        labelKey: "vendorPanel.invoices.overview.totalSpent",
        value: formatMoneyValue(totalSpent, currency),
      },
      {
        labelKey: "vendorPanel.invoices.overview.thisMonth",
        value: formatMoneyValue(thisMonthSpent, currency),
      },
      {
        labelKey: "vendorPanel.invoices.overview.pendingAmount",
        value: formatMoneyValue(pendingAmount, currency),
      },
      {
        labelKey: "vendorPanel.invoices.overview.overdueAmount",
        value: formatMoneyValue(overdueAmount, currency),
      },
    ];
  }, [filteredRecords]);

  if (isLoading && records.length === 0) {
    return <DashboardLoadingState title="Loading invoice activity" description="Gathering your invoice, payment, and due-date records." rows={5} columns={7} />;
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {isLoading ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden rounded-full bg-[#f5e6dc]">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-[#cf6e38]" />
        </div>
      ) : null}
      <section>
        <h1 className="type-h2">{t("vendorPanel.invoices.title")}</h1>
        <p className="mt-2 type-para">{t("vendorPanel.invoices.description")}</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {filteredOverview.map((item) => (
          <InvoiceOverviewCard key={item.label} {...item} />
        ))}
      </section>

      <section className="overflow-hidden rounded-[30px] border border-[#ddd4cb] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] shadow-[0_20px_40px_rgba(28,28,28,0.08)]">
        <div className="border-b border-[#ece4dc] px-4 py-4 md:px-5 md:py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c46a35]">
                {t("vendorPanel.invoices.financeSnapshot")}
              </p>
              <h2 className="mt-2 text-[22px] font-semibold text-[#1f1914]">
                {t("vendorPanel.invoices.activityTitle")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#75685f]">
                {t("vendorPanel.invoices.activityDescription")}
              </p>
            </div>

            <div className="rounded-full border border-[#f0dfd3] bg-white/85 px-4 py-2 text-sm font-semibold text-[#8b796d]">
              {t("vendorPanel.invoices.visibleCount", { count: filteredRecords.length })}
            </div>
          </div>
        </div>

        <div className="px-4 py-4 md:px-5">
        <div className="grid grid-cols-2 gap-3 border-b border-[#ece4dc] pb-4 xl:grid-cols-4">
          {filteredTotals.map((item) => (
            <InvoiceTotalCard key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-b border-[#ece4dc] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex w-full items-center gap-2 rounded-full border border-[#e3d8ce] bg-white px-4 py-3 text-sm text-[#7a7a7a] shadow-[0_6px_16px_rgba(32,22,16,0.04)] lg:max-w-[340px]">
            <FiSearch className="text-[16px]" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t("vendorPanel.invoices.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-[#242424] outline-none placeholder:text-[#aaaaaa]"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <InvoiceFilterMenu
              defaultValue="all"
              isOpen={isDateMenuOpen}
              label={getInvoiceDateFilterLabel(
                selectedDateRange,
                customDateRange,
                t,
              )}
              onToggle={() => {
                setIsDateMenuOpen((open) => !open);
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
                        <span>{option.labelKey ? t(option.labelKey) : option.label}</span>
                        {isSelected ? (
                          <span className="text-xs font-semibold">{t("vendorPanel.invoices.active")}</span>
                        ) : null}
                      </button>
                    );
                  })}

                  {selectedDateRange === "custom-date" ? (
                    <div className="mt-2 rounded-xl border border-[#f0e2d7] bg-[#fff8f3] p-3">
                      <div className="grid gap-3">
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#9a6d53]">
                            {t("vendorPanel.invoices.from")}
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
                            {t("vendorPanel.invoices.to")}
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
                          {t("vendorPanel.invoices.apply")}
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
          totalItems={filteredRecords.length}
          totalPages={filteredTotalPages}
        />
        </div>
      </section>
    </div>
  );
}
