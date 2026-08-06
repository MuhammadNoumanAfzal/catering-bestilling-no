export const NOTIFICATION_TABS = [
  { labelKey: "vendorPanel.notifications.tabs.all", value: "all" },
  { labelKey: "vendorPanel.notifications.tabs.unread", value: "unread" },
  { labelKey: "vendorPanel.notifications.tabs.read", value: "read" },
];

export const NOTIFICATION_DATE_OPTIONS = [
  { labelKey: "vendorPanel.notifications.date.allTime", value: "all-time" },
  { labelKey: "vendorPanel.notifications.date.lastMonth", value: "last-month" },
  { labelKey: "vendorPanel.notifications.date.last3Months", value: "last-3-months" },
  { labelKey: "vendorPanel.notifications.date.last6Months", value: "last-6-months" },
  { labelKey: "vendorPanel.notifications.date.thisYear", value: "this-year" },
  { labelKey: "vendorPanel.notifications.date.customDate", value: "custom-date" },
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

export function getNotificationDateFilterLabel(selectedRange, customDateRange, t) {
  if (selectedRange === "custom-date") {
    const fromLabel = formatDateForLabel(customDateRange.from);
    const toLabel = formatDateForLabel(customDateRange.to);

    if (fromLabel && toLabel) {
      return t("date.customRange", {
        from: fromLabel,
        to: toLabel,
      });
    }

    return t("date.customDate");
  }

  if (selectedRange === "last-month") {
    return t("date.lastMonth");
  }

  if (selectedRange === "last-3-months") {
    return t("date.last3Months");
  }

  if (selectedRange === "last-6-months") {
    return t("date.last6Months");
  }

  if (selectedRange === "this-year") {
    return t("date.thisYear");
  }

  if (selectedRange === "custom-date") {
    return t("date.customDate");
  }

  return t("date.allTime");
}

export function isNotificationWithinDateRange(
  notificationDate,
  selectedRange,
  customDateRange,
  referenceDate,
) {
  const date = new Date(`${notificationDate}T00:00:00`);
  const reference = new Date(referenceDate);

  if (Number.isNaN(date.getTime()) || Number.isNaN(reference.getTime())) {
    return true;
  }

  if (selectedRange === "all-time") {
    return true;
  }

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
