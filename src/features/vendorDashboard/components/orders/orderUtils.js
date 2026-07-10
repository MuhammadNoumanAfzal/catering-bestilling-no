export const ORDER_VIEW_TABS = [
  { label: "Active Orders", value: "active" },
  { label: "Recent Orders", value: "recent" },
];

export const ORDER_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Drafts", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
];

export const ORDER_DATE_OPTIONS = [
  { label: "All Time", value: "all-time" },
  { label: "Last Month", value: "last-month" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "Last 6 Months", value: "last-6-months" },
  { label: "This Year", value: "this-year" },
  { label: "Custom Date", value: "custom-date" },
];

export const PAGE_SIZE = 8;

export function parseOrderDate(dateValue) {
  if (!dateValue) {
    return new Date(Number.NaN);
  }

  const parsedDate = new Date(dateValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return new Date(`${dateValue} 00:00:00`);
}

export function normalizeOrderStatus(status) {
  const normalizedStatus = `${status ?? ""}`.toLowerCase();

  if (normalizedStatus === "modified" || normalizedStatus === "change requested") {
    return "modified";
  }

  if (normalizedStatus === "delivered") {
    return "completed";
  }

  return normalizedStatus;
}

export function isActiveOrder(status) {
  const normalizedStatus = normalizeOrderStatus(status);

  return (
    normalizedStatus !== "completed" &&
    normalizedStatus !== "delivered" &&
    normalizedStatus !== "canceled" &&
    normalizedStatus !== "cancelled"
  );
}

export function getOrderStatusClasses(status) {
  const normalizedStatus = normalizeOrderStatus(status);

  if (normalizedStatus === "modified") {
    return "bg-[#fff2e9] text-[#cf6e38]";
  }

  if (normalizedStatus === "completed") {
    return "bg-[#d9f5da] text-[#2ca44f]";
  }

  if (normalizedStatus === "scheduled") {
    return "bg-[#e0ebff] text-[#4477d7]";
  }

  return "bg-[#ececec] text-[#676767]";
}

export function isOrderDateValid(dateValue) {
  return !Number.isNaN(parseOrderDate(dateValue).getTime());
}

export function getRangeDays(rangeValue) {
  if (rangeValue === "all-time") {
    return null;
  }

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
    "All Time"
  );
}
