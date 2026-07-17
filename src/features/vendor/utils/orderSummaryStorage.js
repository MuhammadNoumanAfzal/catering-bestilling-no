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
    deliveryDate: vendor.orderSummary.deliveryDate || "",
    deliveryTime: vendor.orderSummary.deliveryTime || "",
    personCount: vendor.orderSummary.personCount,
    deliveryAddress: vendor.orderSummary.deliveryAddress,
    invoiceAddress: vendor.orderSummary.invoiceAddress,
    vendorNote: vendor.orderSummary.vendorNote || "",
    tipRate: 0,
  };
}

function getStorageKey(vendorSlug) {
  return `${STORAGE_PREFIX}${vendorSlug}`;
}

function listStorageKeys() {
  if (typeof window === "undefined") {
    return [];
  }

  return Object.keys(window.sessionStorage).filter((key) =>
    key.startsWith(STORAGE_PREFIX),
  );
}

function buildStoredPayload(orderSummary, vendorSnapshot) {
  return {
    orderSummary,
    vendor: vendorSnapshot ?? null,
  };
}

function parseStoredPayload(storedValue) {
  const parsedValue = JSON.parse(storedValue);

  if (
    parsedValue &&
    typeof parsedValue === "object" &&
    "orderSummary" in parsedValue
  ) {
    return {
      orderSummary: parsedValue.orderSummary ?? {},
      vendor: parsedValue.vendor ?? null,
    };
  }

  return {
    orderSummary: parsedValue ?? {},
    vendor: null,
  };
}

function toVendorSnapshot(vendor) {
  if (!vendor) {
    return null;
  }

  return {
    id: vendor.id || "",
    slug: vendor.slug || "",
    name: vendor.name || "",
    image: vendor.image || vendor.banner || vendor.logo || "",
    logo: vendor.logo || "",
    banner: vendor.banner || vendor.image || "",
    heroSideImage: vendor.heroSideImage || vendor.banner || vendor.image || "",
    rating: vendor.rating || "0.0",
    reviewCount: vendor.reviewCount || 0,
    cuisine: vendor.cuisine || "",
    addressLine: vendor.addressLine || "",
    city: vendor.city || "",
    servicePostalCodes: Array.isArray(vendor.servicePostalCodes)
      ? vendor.servicePostalCodes
      : [],
    deliveryFee: vendor.deliveryFee || "",
    leadTime: vendor.leadTime || "",
    availability: vendor.availability || null,
    categories: Array.isArray(vendor.categories) ? vendor.categories : [],
    categoryTags: Array.isArray(vendor.categoryTags) ? vendor.categoryTags : [],
    orderSummary: vendor.orderSummary || {
      items: [],
      deliveryDate: "",
      deliveryTime: "",
      personCount: 1,
      deliveryAddress: "",
      invoiceAddress: "",
      vendorNote: "",
      total: "0.00",
    },
  };
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

    const { orderSummary } = parseStoredPayload(storedValue);

    return {
      ...fallback,
      ...orderSummary,
      items: Array.isArray(orderSummary?.items) ? orderSummary.items : [],
    };
  } catch {
    return fallback;
  }
}

export function writeOrderSummary(vendorOrSlug, orderSummary, vendorSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  const vendorSlug =
    typeof vendorOrSlug === "string" ? vendorOrSlug : vendorOrSlug?.slug;

  if (!vendorSlug) {
    return;
  }

  const existingValue = window.sessionStorage.getItem(getStorageKey(vendorSlug));
  let existingVendor = null;

  if (existingValue) {
    try {
      existingVendor = parseStoredPayload(existingValue).vendor;
    } catch {
      existingVendor = null;
    }
  }

  window.sessionStorage.setItem(
    getStorageKey(vendorSlug),
    JSON.stringify(
      buildStoredPayload(
        orderSummary,
        vendorSnapshot ??
          (typeof vendorOrSlug === "string"
            ? existingVendor
            : toVendorSnapshot(vendorOrSlug)),
      ),
    ),
  );
  emitOrderSummaryUpdated();
}

export function readAllStoredOrderSummaries() {
  if (typeof window === "undefined") {
    return [];
  }

  return listStorageKeys()
    .map((key) => {
      try {
        const storedValue = window.sessionStorage.getItem(key);

        if (!storedValue) {
          return null;
        }

        const { orderSummary, vendor } = parseStoredPayload(storedValue);

        if (!vendor) {
          return null;
        }

        return {
          vendor,
          orderSummary: {
            ...createInitialOrderSummary(vendor),
            ...orderSummary,
            items: Array.isArray(orderSummary?.items) ? orderSummary.items : [],
          },
        };
      } catch {
        return null;
      }
    })
    .filter(
      (entry) => entry && Array.isArray(entry.orderSummary.items) && entry.orderSummary.items.length > 0,
    );
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

  listStorageKeys().forEach((key) => {
    if (key === getStorageKey(activeVendorSlug)) {
      return;
    }

    window.sessionStorage.removeItem(key);
  });

  emitOrderSummaryUpdated();
}

export function clearAllStoredOrderSummaries() {
  if (typeof window === "undefined") {
    return;
  }

  listStorageKeys().forEach((key) => {
    window.sessionStorage.removeItem(key);
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
