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
];

export const PAGE_SIZE = 8;
const TODAY = new Date("2026-04-22T00:00:00");

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

export function isInvoiceWithinDateRange(dateValue, selectedRange) {
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
