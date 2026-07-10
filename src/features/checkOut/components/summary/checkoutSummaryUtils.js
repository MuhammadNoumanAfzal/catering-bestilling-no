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

export function parseBackendAmount(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = `${value ?? ""}`.replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getTipValue(summary, subtotal) {
  if (summary.tipRate === "other") {
    return Number(summary.customTipAmount ?? 0);
  }
  return typeof summary.tipRate === "number" ? subtotal * summary.tipRate : 0;
}

export function getLocalMerchandiseTotal(orderSummary) {
  const items = Array.isArray(orderSummary?.items) ? orderSummary.items : [];
  const personCount = orderSummary?.personCount;

  return items.reduce(
    (sum, item) => sum + getItemPrice(item, personCount),
    0,
  );
}

export function getItemServes(item, personCount) {
  const baseServes = Number(item.totalServes ?? item.serves ?? 0);
  const normalizedPersonCount = Math.max(1, Number(personCount ?? 0) || 1);

  if (baseServes > 0) {
    return baseServes;
  }

  return normalizedPersonCount;
}

export function getItemPrice(item, personCount) {
  const pricingType = item.pricingType === "fixed" ? "fixed" : "per-person";
  const storedPrice = Number(item.price ?? 0);
  const unitPrice = Number(item.unitPrice ?? 0);
  const quantity = Math.max(1, Number(item.quantity ?? 1));
  const normalizedPersonCount = Math.max(1, Number(personCount ?? 0) || 1);

  if (pricingType === "fixed") {
    if (storedPrice > 0) {
      return storedPrice;
    }

    if (unitPrice > 0) {
      return unitPrice * quantity;
    }

    return Number(item.price ?? 0);
  }

  if (unitPrice > 0) {
    return unitPrice * quantity * normalizedPersonCount;
  }

  return storedPrice;
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
  const backendPricing = cart?.orderSummary?.pricing;

  if (backendPricing) {
    return {
      subtotal: parseBackendAmount(backendPricing.subtotal),
      deliveryFee: parseBackendAmount(backendPricing.deliveryFee),
      salesTax: parseBackendAmount(backendPricing.taxAmount),
      addOnsTotal: parseBackendAmount(backendPricing.addOnsTotal),
      tipValue: parseBackendAmount(backendPricing.tipAmount),
      discountAmount: parseBackendAmount(backendPricing.discountAmount),
      serviceFee: parseBackendAmount(backendPricing.serviceFee),
      grandTotal: parseBackendAmount(backendPricing.grandTotal),
    };
  }

  const subtotal = cart.orderSummary.items.reduce(
    (sum, item) => sum + getItemPrice(item, cart.orderSummary.personCount),
    0,
  );
  const mainItemsGrossTotal = cart.orderSummary.items
    .filter((item) => !item?.isAddOn)
    .reduce((sum, item) => sum + getItemPrice(item, cart.orderSummary.personCount), 0);
  const addOnsGrossTotal = cart.orderSummary.items
    .filter((item) => item?.isAddOn)
    .reduce((sum, item) => sum + getItemPrice(item, cart.orderSummary.personCount), 0);
  const deliveryFee = extractAmount(cart.vendor.deliveryFee);
  const subtotalExVat = mainItemsGrossTotal / (1 + SALES_TAX_RATE);
  const addOnsExVat = addOnsGrossTotal / (1 + SALES_TAX_RATE);
  const salesTax = subtotal - subtotalExVat - addOnsExVat;
  const tipValue = getTipValue(cart.orderSummary, subtotal);
  const grandTotal = subtotalExVat + addOnsExVat + salesTax + deliveryFee + tipValue;

  return {
    subtotal: subtotalExVat,
    deliveryFee,
    salesTax,
    addOnsTotal: addOnsExVat,
    tipValue,
    discountAmount: 0,
    serviceFee: 0,
    grandTotal,
  };
}

export function getCheckoutTotals(carts) {
  return carts.reduce(
    (accumulator, cart) => {
      const totals = getVendorTotals(cart);

      return {
        subtotal: accumulator.subtotal + totals.subtotal,
        deliveryFee: accumulator.deliveryFee + totals.deliveryFee,
        salesTax: accumulator.salesTax + totals.salesTax,
        addOnsTotal: accumulator.addOnsTotal + totals.addOnsTotal,
        tip: accumulator.tip + totals.tipValue,
        discountAmount: accumulator.discountAmount + totals.discountAmount,
        serviceFee: accumulator.serviceFee + totals.serviceFee,
        grandTotal: accumulator.grandTotal + totals.grandTotal,
      };
    },
    {
      subtotal: 0,
      deliveryFee: 0,
      salesTax: 0,
      addOnsTotal: 0,
      tip: 0,
      discountAmount: 0,
      serviceFee: 0,
      grandTotal: 0,
    },
  );
}
