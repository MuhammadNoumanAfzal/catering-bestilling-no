export function settingsKey(key) {
  return `vendorPanel.settingsPage.${key}`;
}

export function vendorSettingsKey(key) {
  return `vendor.settingsPage.${key}`;
}

export function legacySettingsKey(key) {
  return `modifyOrder.settingsPage.${key}`;
}

export function sharedSettingsKey(key) {
  return `settings.${key}`;
}

export function translateSettings(t, i18n, key, options = {}) {
  const isNorwegian = `${i18n?.resolvedLanguage || i18n?.language || ""}`
    .toLowerCase()
    .startsWith("no");

  if (isNorwegian) {
    return t(legacySettingsKey(key), {
      ...options,
      defaultValue: t(vendorSettingsKey(key), {
        ...options,
        defaultValue: t(settingsKey(key), {
          ...options,
          defaultValue: t(sharedSettingsKey(key), options),
        }),
      }),
    });
  }

  return t(settingsKey(key), {
    ...options,
    defaultValue: t(vendorSettingsKey(key), {
      ...options,
      defaultValue: t(sharedSettingsKey(key), options),
    }),
  });
}
