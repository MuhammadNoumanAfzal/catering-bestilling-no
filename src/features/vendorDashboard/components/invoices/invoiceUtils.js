export const STATUS_OPTIONS = [
  { labelKey: "vendorPanel.invoices.allStatus", value: "all" },
  { labelKey: "vendorPanel.invoices.paid", value: "paid" },
  { labelKey: "vendorPanel.invoices.pending", value: "pending" },
  { labelKey: "vendorPanel.invoices.reported", value: "reported" },
  { labelKey: "vendorPanel.invoices.rejected", value: "rejected" },
  { labelKey: "vendorPanel.invoices.overdue", value: "overdue" },
];

export const DATE_OPTIONS = [
  { labelKey: "vendorPanel.invoices.last7Days", value: "7" },
  { labelKey: "vendorPanel.invoices.last30Days", value: "30" },
  { labelKey: "vendorPanel.invoices.thisYear", value: "year" },
  { labelKey: "vendorPanel.invoices.allTime", value: "all" },
  { labelKey: "vendorPanel.invoices.customDate", value: "custom-date" },
];

export const PAGE_SIZE = 8;

export function formatFilterDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");
  return `${day}-${month}-${year}`;
}

export function getInvoiceDateFilterLabel(selectedRange, customDateRange, t) {
  if (
    selectedRange === "custom-date" &&
    customDateRange.from &&
    customDateRange.to
  ) {
    return t("vendorPanel.invoices.customDateRange", {
      from: formatFilterDate(customDateRange.from),
      to: formatFilterDate(customDateRange.to),
    });
  }

  return (
    t(DATE_OPTIONS.find((option) => option.value === selectedRange)?.labelKey) ??
    t("vendorPanel.invoices.fallbackDateFilter")
  );
}

export function getInvoiceStatusClasses(status) {
  const normalizedStatus = `${status ?? ""}`
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (
    normalizedStatus === "paid" ||
    normalizedStatus === "delivered" ||
    normalizedStatus === "completed"
  ) {
    return "border border-[#bfe7c8] bg-[#edf9f0] text-[#227a43]";
  }

  if (normalizedStatus === "pending" || normalizedStatus === "unpaid") {
    return "border border-[#f2d7a8] bg-[#fff7e8] text-[#b57612]";
  }

  if (normalizedStatus === "reported") {
    return "border border-[#c7d9fd] bg-[#eef4ff] text-[#315fbc]";
  }

  if (normalizedStatus === "confirmed") {
    return "border border-[#bfd6ff] bg-[#edf3ff] text-[#315fc2]";
  }

  if (normalizedStatus === "accepted") {
    return "border border-[#f2d7a8] bg-[#fff7e8] text-[#b57612]";
  }

  if (normalizedStatus === "preparing" || normalizedStatus === "modified") {
    return "border border-[#f5cfb6] bg-[#fff4ea] text-[#cb6b2f]";
  }

  if (normalizedStatus === "ready" || normalizedStatus === "ready to deliver") {
    return "border border-[#b7e6da] bg-[#ecfbf6] text-[#177c71]";
  }

  if (normalizedStatus === "overdue") {
    return "border border-[#f5cfb6] bg-[#fff4ea] text-[#cb6b2f]";
  }

  if (
    normalizedStatus === "rejected" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "failed"
  ) {
    return "border border-[#efc4bc] bg-[#fff1ee] text-[#c05445]";
  }

  return "border border-[#ddd9d4] bg-[#f5f4f2] text-[#6c655f]";
}

export function getInvoiceQueryDateRange(selectedRange, customDateRange = {}) {
  const today = new Date();
  const toDate = today.toISOString().slice(0, 10);

  if (selectedRange === "all") {
    return { dateFrom: null, dateTo: null };
  }

  if (selectedRange === "custom-date") {
    return {
      dateFrom: customDateRange.from || null,
      dateTo: customDateRange.to || null,
    };
  }

  if (selectedRange === "year") {
    return {
      dateFrom: `${today.getFullYear()}-01-01`,
      dateTo: toDate,
    };
  }

  const rangeDays = Number(selectedRange);

  if (!Number.isFinite(rangeDays) || rangeDays <= 0) {
    return { dateFrom: null, dateTo: null };
  }

  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - (rangeDays - 1));

  return {
    dateFrom: fromDate.toISOString().slice(0, 10),
    dateTo: toDate,
  };
}
