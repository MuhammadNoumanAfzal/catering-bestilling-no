const CUSTOMER_PAYMENT_ACTIONS = new Set([
  "INVOICE_PAYMENT_REPORTED",
  "CUSTOMER_PAYMENT_REPORTED",
  "CUSTOMER_PAYMENT_RECEIVED",
  "INVOICE_PAYMENT_APPROVED",
  "INVOICE_PAYMENT_REJECTED",
  "INVOICE_MARKED_PAID",
  "INVOICE_PAID",
  "PAYMENT_RECEIVED",
  "PAYMENT_REPORTED",
  "PAYMENT_APPROVED",
  "PAYMENT_REJECTED",
]);

// Unknown audit events are internal by default, not customer-facing history.
export function customerInvoiceHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.filter((item) => CUSTOMER_PAYMENT_ACTIONS.has(
    String(item?.action || "").trim().toUpperCase().replace(/[\s-]+/g, "_"),
  )).map((item) => ({
    ...item,
    // Staff audit notes can contain private finance instructions.
    note: String(item.actorType || "").toUpperCase() === "CUSTOMER" ? item.note || "" : "",
  }));
}
