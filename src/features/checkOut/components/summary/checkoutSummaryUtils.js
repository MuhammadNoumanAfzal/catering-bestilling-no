export const TIP_OPTIONS = [
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
  { label: "Other", value: "other" },
];

export const SALES_TAX_RATE = 0.15;

export function formatCurrency(value) {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

export function extractAmount(value) {
  const matched = `${value ?? ""}`.match(/(\d+(?:\.\d+)?)/);
  return matched ? Number(matched[1]) : 0;
}

export function getTipValue(summary, subtotal) {
  return typeof summary.tipRate === "number" ? subtotal * summary.tipRate : 0;
}

export function getItemServes(item, personCount) {
  const baseServes = Number(item.totalServes ?? item.serves ?? 0);
  return Math.max(baseServes, Number(personCount ?? 0) || 0);
}

export function getItemPrice(item, personCount) {
  const unitPrice = Number(item.unitPrice ?? 0);

  if (unitPrice > 0) {
    return unitPrice * getItemServes(item, personCount);
  }

  return Number(item.price ?? 0);
}

export function sortSummaryItems(items) {
  return [...items].sort((left, right) => {
    if (left.isAddOn === right.isAddOn) {
      return 0;
    }

    return left.isAddOn ? 1 : -1;
  });
}

export function getVendorTotals(cart) {
  const subtotal = cart.orderSummary.items.reduce(
    (sum, item) => sum + getItemPrice(item, cart.orderSummary.personCount),
    0,
  );
  const deliveryFee = extractAmount(cart.vendor.deliveryFee);
  const salesTax = subtotal * SALES_TAX_RATE;
  const tipValue = getTipValue(cart.orderSummary, subtotal);

  return { subtotal, deliveryFee, salesTax, tipValue };
}

export function getCheckoutTotals(carts) {
  return carts.reduce(
    (accumulator, cart) => {
      const totals = getVendorTotals(cart);

      return {
        subtotal: accumulator.subtotal + totals.subtotal,
        deliveryFee: accumulator.deliveryFee + totals.deliveryFee,
        salesTax: accumulator.salesTax + totals.salesTax,
        tip: accumulator.tip + totals.tipValue,
      };
    },
    { subtotal: 0, deliveryFee: 0, salesTax: 0, tip: 0 },
  );
}
