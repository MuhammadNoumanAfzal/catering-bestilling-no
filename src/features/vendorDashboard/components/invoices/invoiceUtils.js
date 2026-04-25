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
const TODAY = new Date("2026-04-22T00:00:00");

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
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "paid") {
    return "bg-[#dff6dd] text-[#2d9b42]";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#fff4d6] text-[#cf8b19]";
  }

  return "bg-[#fde2d9] text-[#d06036]";
}

export function isInvoiceWithinDateRange(
  dateValue,
  selectedRange,
  customDateRange = {},
) {
  if (selectedRange === "all") {
    return true;
  }

  const candidate = new Date(`${dateValue}T00:00:00`);

  if (selectedRange === "custom-date") {
    if (!customDateRange.from || !customDateRange.to) {
      return true;
    }

    const fromDate = new Date(`${customDateRange.from}T00:00:00`);
    const toDate = new Date(`${customDateRange.to}T23:59:59`);

    return candidate >= fromDate && candidate <= toDate;
  }

  if (selectedRange === "year") {
    return candidate.getFullYear() === TODAY.getFullYear();
  }

  const rangeDays = Number(selectedRange);
  const diffInDays = Math.floor(
    (TODAY.getTime() - candidate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diffInDays >= 0 && diffInDays < rangeDays;
}
