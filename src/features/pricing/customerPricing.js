export const CUSTOMER_MENU_VAT_RATE = 0.15;

export function toCustomerVatInclusivePrice(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Number(amount.toFixed(2));
}

export function getIncludedVatAmount(value, vatRate = CUSTOMER_MENU_VAT_RATE) {
  const amount = Number(value ?? 0);
  const rate = Number(vatRate ?? 0);

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(rate) || rate <= 0) {
    return 0;
  }

  return Number((amount - amount / (1 + rate)).toFixed(2));
}
