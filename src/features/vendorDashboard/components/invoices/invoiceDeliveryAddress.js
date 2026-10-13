export function formatInvoiceDeliveryAddress(order = {}) {
  const clean = (value) => `${value || ""}`.trim();
  const street = clean(order.deliveryAddress);
  const suite = clean(order.deliverySuite);
  const location = [clean(order.deliveryPostalCode), clean(order.deliveryCity)].filter(Boolean).join(" ");
  if (!street) return clean(order.deliveryAddressStr);
  return [[street, suite].filter(Boolean).join(", "), location].filter(Boolean).join("\n");
}
