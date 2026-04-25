import { vendorProfiles } from "../data/vendorData";
import { getDefaultTableware } from "../../../components/shared/TablewareModal";

const STORAGE_PREFIX = "vendor-order-summary:";
const ORDER_SUMMARY_UPDATED_EVENT = "vendor-order-summary-updated";

function emitOrderSummaryUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(ORDER_SUMMARY_UPDATED_EVENT));
}

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
    tableware: getDefaultTableware(),
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
      tableware: {
        ...fallback.tableware,
        ...(parsedValue?.tableware ?? {}),
      },
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
  emitOrderSummaryUpdated();
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
  emitOrderSummaryUpdated();
}

export function clearOtherStoredOrderSummaries(activeVendorSlug) {
  if (typeof window === "undefined") {
    return;
  }

  vendorProfiles.forEach((vendor) => {
    if (vendor.slug === activeVendorSlug) {
      return;
    }

    window.sessionStorage.removeItem(getStorageKey(vendor.slug));
  });

  emitOrderSummaryUpdated();
}

export function clearAllStoredOrderSummaries() {
  if (typeof window === "undefined") {
    return;
  }

  vendorProfiles.forEach((vendor) => {
    window.sessionStorage.removeItem(getStorageKey(vendor.slug));
  });
  emitOrderSummaryUpdated();
}

export function subscribeToOrderSummaryUpdates(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(ORDER_SUMMARY_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ORDER_SUMMARY_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
