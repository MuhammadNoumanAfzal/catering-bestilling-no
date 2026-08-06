export function addressKey(key) {
  return `vendorPanel.addressPage.${key}`;
}

export function legacyAddressKey(key) {
  return `modifyOrder.addressPage.${key}`;
}

export function translateAddress(t, i18n, key, options = {}) {
  const isNorwegian = `${i18n?.resolvedLanguage || i18n?.language || ""}`
    .toLowerCase()
    .startsWith("no");

  if (isNorwegian) {
    return t(legacyAddressKey(key), {
      ...options,
      defaultValue: t(addressKey(key), options),
    });
  }

  return t(addressKey(key), options);
}
