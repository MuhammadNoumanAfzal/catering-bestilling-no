function getNotificationLocale(i18n) {
  const language = `${i18n?.resolvedLanguage || i18n?.language || "en"}`
    .toLowerCase();

  return language.startsWith("no") ? "no-NO" : "en-US";
}

function normalizeStatusValue(value = "") {
  return `${value}`.trim().toLowerCase().replace(/\s+/g, "_");
}

function translateStatus(status, t) {
  const normalizedStatus = normalizeStatusValue(status);
  return t(`vendorPanel.notifications.statuses.${normalizedStatus}`, {
    defaultValue: status,
  });
}

function localizeRelativeTime(createdAt, i18n) {
  if (!createdAt) {
    return "";
  }

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) {
    return "";
  }

  const diffInSeconds = Math.round((createdDate.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat(getNotificationLocale(i18n), {
    numeric: "auto",
  });

  if (absSeconds < 60) {
    return formatter.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hour");
  }

  return formatter.format(Math.round(diffInHours / 24), "day");
}

function localizeDayLabel(createdAt, i18n) {
  if (!createdAt) {
    return "";
  }

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(getNotificationLocale(i18n), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(createdDate);
}

function localizeNotificationTitle(notification, t) {
  const rawTitle = `${notification?.title || ""}`.trim();
  const type = `${notification?.notificationType || ""}`.toLowerCase();

  if (type.includes("order") && rawTitle.toLowerCase() === "order placed") {
    return t("vendorPanel.notifications.messages.orderPlacedTitle");
  }

  if (
    type.includes("order") &&
    rawTitle.toLowerCase().includes("order status update")
  ) {
    return t("vendorPanel.notifications.messages.orderStatusUpdateTitle");
  }

  return rawTitle || t("vendorPanel.notifications.messages.defaultTitle");
}

function localizeNotificationMessage(notification, t) {
  const rawMessage = `${notification?.message || ""}`.trim();
  const type = `${notification?.notificationType || ""}`.toLowerCase();
  const orderId = notification?.orderId ? `#${notification.orderId}` : "";

  const placedMatch = rawMessage.match(/your order \(id:\s*#?(\d+)\) has been placed successfully\.?/i);
  if (
    placedMatch ||
    (type.includes("order") && rawMessage.toLowerCase().includes("placed successfully"))
  ) {
    return t("vendorPanel.notifications.messages.orderPlacedBody", {
      orderId: orderId || `#${placedMatch?.[1] || ""}`,
    });
  }

  const statusMatch = rawMessage.match(
    /your order \(id:\s*#?(\d+)\) status has been updated to ['"]?([^.'"]+)['"]?\.?/i,
  );

  if (statusMatch) {
    const [, matchedId, matchedStatus] = statusMatch;
    return t("vendorPanel.notifications.messages.orderStatusUpdatedBody", {
      orderId: orderId || `#${matchedId}`,
      status: translateStatus(matchedStatus, t),
    });
  }

  return rawMessage;
}

export function localizeNotification(notification, t, i18n) {
  return {
    ...notification,
    title: localizeNotificationTitle(notification, t),
    message: localizeNotificationMessage(notification, t),
    timeLabel: localizeRelativeTime(notification.createdOn, i18n),
    dayLabel: localizeDayLabel(notification.createdOn, i18n),
  };
}
