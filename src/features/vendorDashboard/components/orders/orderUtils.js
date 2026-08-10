export const ORDER_VIEW_TABS = [
  { labelKey: "vendorPanel.orders.activeOrders", value: "active" },
  { labelKey: "vendorPanel.orders.recentOrders", value: "recent" },
];

export const ORDER_TABS = [
  { labelKey: "vendorPanel.orders.allOrders", value: "all" },
  { labelKey: "vendorPanel.orders.completed", value: "completed" },
  { labelKey: "vendorPanel.orders.drafts", value: "draft" },
  { labelKey: "vendorPanel.orders.scheduled", value: "scheduled" },
];

export const ORDER_DATE_OPTIONS = [
  { labelKey: "vendorPanel.notifications.date.allTime", value: "all-time" },
  { labelKey: "vendorPanel.notifications.date.lastMonth", value: "last-month" },
  { labelKey: "vendorPanel.notifications.date.last3Months", value: "last-3-months" },
  { labelKey: "vendorPanel.notifications.date.last6Months", value: "last-6-months" },
  { labelKey: "vendorPanel.notifications.date.thisYear", value: "this-year" },
  { labelKey: "vendorPanel.notifications.date.customDate", value: "custom-date" },
];

export const PAGE_SIZE = 8;
const ORDER_CLASSIFICATION_TODAY = new Date("2026-07-17T00:00:00");

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

function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function normalizeOrderStatus(status) {
  const normalizedStatus = `${status ?? ""}`
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (normalizedStatus === "modified" || normalizedStatus === "change requested") {
    return "modified";
  }

  if (normalizedStatus === "confirmed") {
    return "confirmed";
  }

  if (normalizedStatus === "placed") {
    return "placed";
  }

  if (normalizedStatus === "out for delivery") {
    return "out for delivery";
  }

  if (normalizedStatus === "delivered") {
    return "completed";
  }

  return normalizedStatus;
}

export function getOrderLifecycle(status, eventDate) {
  const normalizedStatus = normalizeOrderStatus(status);

  if (normalizedStatus === "draft") {
    return "draft";
  }

  if (normalizedStatus === "completed") {
    return "completed";
  }

  if (normalizedStatus === "canceled" || normalizedStatus === "cancelled") {
    return "cancelled";
  }

  const parsedEventDate = parseOrderDate(eventDate);
  if (!Number.isNaN(parsedEventDate.getTime())) {
    const today = getStartOfDay(ORDER_CLASSIFICATION_TODAY);
    const orderDay = getStartOfDay(parsedEventDate);

    if (orderDay.getTime() > today.getTime()) {
      return "scheduled";
    }
  }

  return "active";
}

export function isActiveOrder(status, eventDate) {
  return getOrderLifecycle(status, eventDate) === "active";
}

export function getOrderStatusClasses(status) {
  const normalizedStatus = normalizeOrderStatus(status);

  if (normalizedStatus === "modified") {
    return "border border-[#f5cfb6] bg-[#fff4ea] text-[#cb6b2f]";
  }

  if (normalizedStatus === "completed") {
    return "border border-[#bfe7c8] bg-[#edf9f0] text-[#227a43]";
  }

  if (normalizedStatus === "scheduled") {
    return "border border-[#c7d9fd] bg-[#eef4ff] text-[#315fbc]";
  }

  if (normalizedStatus === "confirmed") {
    return "border border-[#bfd6ff] bg-[#edf3ff] text-[#315fc2]";
  }

  if (normalizedStatus === "placed") {
    return "border border-[#d8ccff] bg-[#f5f0ff] text-[#6b46c1]";
  }

  if (normalizedStatus === "out for delivery") {
    return "border border-[#f6d0b6] bg-[#fff3ea] text-[#cb6b2f]";
  }

  if (normalizedStatus === "draft") {
    return "border border-[#e6ddd4] bg-[#f7f3ef] text-[#7a6f66]";
  }

  if (normalizedStatus === "pending" || normalizedStatus === "new") {
    return "border border-[#f2d7a8] bg-[#fff7e8] text-[#b57612]";
  }

  if (normalizedStatus === "preparing" || normalizedStatus === "accepted") {
    return "border border-[#b7e6da] bg-[#ecfbf6] text-[#177c71]";
  }

  if (normalizedStatus === "canceled" || normalizedStatus === "cancelled") {
    return "border border-[#efc4bc] bg-[#fff1ee] text-[#c05445]";
  }

  return "border border-[#ddd9d4] bg-[#f5f4f2] text-[#6c655f]";
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
  t,
) {
  if (selectedRange === "custom-date") {
    if (customDateRange.from && customDateRange.to) {
      return t("vendorPanel.notifications.date.customRange", {
        from: formatInputDate(customDateRange.from),
        to: formatInputDate(customDateRange.to),
      });
    }

    const fromDate = new Date(referenceDate);
    fromDate.setDate(referenceDate.getDate() - 28);
    return t("vendorPanel.notifications.date.customRange", {
      from: formatDateChip(fromDate),
      to: formatDateChip(referenceDate),
    });
  }

  return (
    t(
      ORDER_DATE_OPTIONS.find((option) => option.value === selectedRange)
        ?.labelKey ?? "vendorPanel.notifications.date.allTime",
    )
  );
}
