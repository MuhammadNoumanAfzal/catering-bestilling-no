export const ORDER_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Drafts", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
];

export const ORDER_DATE_OPTIONS = [
  { label: "Last Month", value: "last-month" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "Last 6 Months", value: "last-6-months" },
  { label: "This Year", value: "this-year" },
  { label: "Custom Date", value: "custom-date" },
];

export const PAGE_SIZE = 8;

export function parseOrderDate(dateLabel) {
  return new Date(`${dateLabel} 00:00:00`);
}

export function normalizeOrderStatus(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "delivered") {
    return "completed";
  }

  return normalizedStatus;
}

export function getOrderStatusClasses(status) {
  const normalizedStatus = normalizeOrderStatus(status);

  if (normalizedStatus === "completed") {
    return "bg-[#d9f5da] text-[#2ca44f]";
  }

  if (normalizedStatus === "scheduled") {
    return "bg-[#e0ebff] text-[#4477d7]";
  }

  return "bg-[#ececec] text-[#676767]";
}

export function getRangeDays(rangeValue) {
  if (rangeValue === "last-month") {
    return 30;
  }

  if (rangeValue === "last-3-months") {
    return 90;
  }

  if (rangeValue === "last-6-months") {
    return 180;
  }

  return null;
}

export function formatDateChip(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatInputDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");
  return `${day}-${month}-${year}`;
}

export function getDateFilterLabel(
  selectedRange,
  referenceDate,
  customDateRange = {},
) {
  if (selectedRange === "custom-date") {
    if (customDateRange.from && customDateRange.to) {
      return `From: ${formatInputDate(customDateRange.from)} To: ${formatInputDate(customDateRange.to)}`;
    }

    const fromDate = new Date(referenceDate);
    fromDate.setDate(referenceDate.getDate() - 28);
    return `From: ${formatDateChip(fromDate)} To: ${formatDateChip(referenceDate)}`;
  }

  return (
    ORDER_DATE_OPTIONS.find((option) => option.value === selectedRange)?.label ??
    "Last Month"
  );
}
