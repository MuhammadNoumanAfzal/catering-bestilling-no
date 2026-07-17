export const STATUS_OPTIONS = [
  { label: "Status: All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

export const DATE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "This year", value: "year" },
  { label: "All time", value: "all" },
  { label: "Custom Date", value: "custom-date" },
];

export const PAGE_SIZE = 8;

export function formatFilterDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");
  return `${day}-${month}-${year}`;
}

export function getInvoiceDateFilterLabel(selectedRange, customDateRange) {
  if (
    selectedRange === "custom-date" &&
    customDateRange.from &&
    customDateRange.to
  ) {
    return `From: ${formatFilterDate(customDateRange.from)} To: ${formatFilterDate(customDateRange.to)}`;
  }

  return (
    DATE_OPTIONS.find((option) => option.value === selectedRange)?.label ??
    "Last 7 days"
  );
}

export function getInvoiceStatusClasses(status) {
  const normalizedStatus = `${status ?? ""}`.toLowerCase();

  if (normalizedStatus === "paid") {
    return "bg-[#dff6dd] text-[#2d9b42]";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#fff4d6] text-[#cf8b19]";
  }

  if (normalizedStatus === "overdue") {
    return "bg-[#fde2d9] text-[#d06036]";
  }

  return "bg-[#eef3fc] text-[#2c76ff]";
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
