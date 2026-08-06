export function supportKey(key) {
  return `vendorPanel.supportPage.${key}`;
}

export function legacySupportKey(key) {
  return `modifyOrder.supportPage.${key}`;
}

export function translateSupport(t, i18n, key, options = {}) {
  const isNorwegian = `${i18n?.resolvedLanguage || i18n?.language || ""}`
    .toLowerCase()
    .startsWith("no");

  if (isNorwegian) {
    return t(legacySupportKey(key), {
      ...options,
      defaultValue: t(supportKey(key), options),
    });
  }

  return t(supportKey(key), options);
}
