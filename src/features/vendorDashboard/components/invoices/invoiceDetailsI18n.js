export function invoiceDetailsKey(key) {
  return `vendorPanel.invoices.detailsPage.${key}`;
}

export function legacyInvoiceDetailsKey(key) {
  return `modifyOrder.invoices.detailsPage.${key}`;
}

export function translateInvoiceDetails(t, i18n, key, options = {}) {
  const isNorwegian = `${i18n?.resolvedLanguage || i18n?.language || ""}`
    .toLowerCase()
    .startsWith("no");

  if (isNorwegian) {
    return t(legacyInvoiceDetailsKey(key), {
      ...options,
      defaultValue: t(invoiceDetailsKey(key), options),
    });
  }

  return t(invoiceDetailsKey(key), options);
}

export function translateInvoiceStatus(t, key, fallback) {
  if (!key) {
    return fallback;
  }

  return t(`vendorPanel.invoices.${key}`, {
    defaultValue: fallback,
  });
}
