export const NOTIFICATION_TABS = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

export const NOTIFICATION_DATE_OPTIONS = [
  { label: "Last Month", value: "last-month" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "Last 6 Months", value: "last-6-months" },
  { label: "This Year", value: "this-year" },
  { label: "Custom Date", value: "custom-date" },
];

export function groupNotificationsByDay(notifications) {
  return notifications.reduce((groups, notification) => {
    const existingGroup = groups.find(
      (group) => group.dayLabel === notification.dayLabel,
    );

    if (existingGroup) {
      existingGroup.items.push(notification);
      return groups;
    }

    groups.push({
      dayLabel: notification.dayLabel,
      items: [notification],
    });

    return groups;
  }, []);
}

function formatDateForLabel(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

export function getNotificationDateFilterLabel(selectedRange, customDateRange) {
  if (selectedRange === "custom-date") {
    const fromLabel = formatDateForLabel(customDateRange.from);
    const toLabel = formatDateForLabel(customDateRange.to);

    if (fromLabel && toLabel) {
      return `From: ${fromLabel} To: ${toLabel}`;
    }

    return "Custom Date";
  }

  return (
    NOTIFICATION_DATE_OPTIONS.find((option) => option.value === selectedRange)
      ?.label ?? "Last Month"
  );
}

export function isNotificationWithinDateRange(
  notificationDate,
  selectedRange,
  customDateRange,
  referenceDate,
) {
  const date = new Date(`${notificationDate}T00:00:00`);
  const reference = new Date(`${referenceDate}T23:59:59`);

  if (selectedRange === "custom-date") {
    if (!customDateRange.from || !customDateRange.to) {
      return true;
    }

    const fromDate = new Date(`${customDateRange.from}T00:00:00`);
    const toDate = new Date(`${customDateRange.to}T23:59:59`);
    return date >= fromDate && date <= toDate;
  }

  if (selectedRange === "this-year") {
    return date.getFullYear() === reference.getFullYear();
  }

  const diffInDays = Math.floor(
    (reference.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (selectedRange === "last-3-months") {
    return diffInDays >= 0 && diffInDays <= 90;
  }

  if (selectedRange === "last-6-months") {
    return diffInDays >= 0 && diffInDays <= 180;
  }

  return diffInDays >= 0 && diffInDays <= 30;
}
