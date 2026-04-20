import { vendorProfiles } from "../data/vendorData";

const STORAGE_PREFIX = "vendor-order-summary:";

export function createInitialOrderSummary(vendor) {
  return {
    ...vendor.orderSummary,
    items: [],
    deliveryDate: "2026-03-25",
    deliveryTime: "14:30",
    personCount: vendor.orderSummary.personCount,
    deliveryAddress: vendor.orderSummary.deliveryAddress,
    invoiceAddress: vendor.orderSummary.invoiceAddress,
    tipRate: 0,
  };
}

function getStorageKey(vendorSlug) {
  return `${STORAGE_PREFIX}${vendorSlug}`;
}

export function readOrderSummary(vendor) {
  const fallback = createInitialOrderSummary(vendor);

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.sessionStorage.getItem(getStorageKey(vendor.slug));

    if (!storedValue) {
      return fallback;
    }

    const parsedValue = JSON.parse(storedValue);

    return {
      ...fallback,
      ...parsedValue,
      items: Array.isArray(parsedValue?.items) ? parsedValue.items : [],
    };
  } catch {
    return fallback;
  }
}

export function writeOrderSummary(vendorSlug, orderSummary) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    getStorageKey(vendorSlug),
    JSON.stringify(orderSummary),
  );
}

export function readAllStoredOrderSummaries() {
  if (typeof window === "undefined") {
    return [];
  }

  return vendorProfiles
    .map((vendor) => {
      const orderSummary = readOrderSummary(vendor);

      return {
        vendor,
        orderSummary,
      };
    })
    .filter(({ orderSummary }) => orderSummary.items.length > 0);
}

export function clearStoredOrderSummary(vendorSlug) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(getStorageKey(vendorSlug));
}

export function clearAllStoredOrderSummaries() {
  if (typeof window === "undefined") {
    return;
  }

  vendorProfiles.forEach((vendor) => {
    window.sessionStorage.removeItem(getStorageKey(vendor.slug));
  });
}
