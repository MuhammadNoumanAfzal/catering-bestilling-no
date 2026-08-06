export function notificationKey(key) {
  return `vendorPanel.notifications.${key}`;
}

export function legacyNotificationKey(key) {
  return `modifyOrder.notifications.${key}`;
}

export function translateNotification(t, i18n, key, options = {}) {
  const isNorwegian = `${i18n?.resolvedLanguage || i18n?.language || ""}`
    .toLowerCase()
    .startsWith("no");

  if (isNorwegian) {
    return t(legacyNotificationKey(key), {
      ...options,
      defaultValue: t(notificationKey(key), options),
    });
  }

  return t(notificationKey(key), options);
}
