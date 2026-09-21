export const CUSTOMER_MENU_VAT_RATE = 0.15;

export function toCustomerVatInclusivePrice(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Number((amount * (1 + CUSTOMER_MENU_VAT_RATE)).toFixed(2));
}