const PLACED_ORDER_STORAGE_KEY = "placed-order-draft";

function normalizeCarts(carts) {
  return Array.isArray(carts)
    ? carts.map((cart) => ({
        vendor: cart.vendor,
        orderSummary: {
          ...cart.orderSummary,
          items: Array.isArray(cart.orderSummary?.items)
            ? cart.orderSummary.items
            : [],
        },
      }))
    : [];
}

function normalizePlacedOrders(placedOrders) {
  return Array.isArray(placedOrders)
    ? placedOrders.map((order) => ({
        vendorSlug: order.vendorSlug,
        vendorName: order.vendorName,
        orderId: order.orderId,
        message: order.message,
      }))
    : [];
}

export function writePlacedOrderDraft(value) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    checkoutType: value?.checkoutType ?? "corporate",
    formState: value?.formState ?? {},
    carts: normalizeCarts(value?.carts),
    placedOrders: normalizePlacedOrders(value?.placedOrders),
    createdAt: value?.createdAt ?? new Date().toISOString(),
  };

  window.sessionStorage.setItem(
    PLACED_ORDER_STORAGE_KEY,
    JSON.stringify(payload),
  );
}

export function readPlacedOrderDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.sessionStorage.getItem(PLACED_ORDER_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue);

    return {
      checkoutType: parsedValue?.checkoutType ?? "corporate",
      formState: parsedValue?.formState ?? {},
      carts: normalizeCarts(parsedValue?.carts),
      placedOrders: normalizePlacedOrders(parsedValue?.placedOrders),
      createdAt: parsedValue?.createdAt ?? null,
    };
  } catch {
    return null;
  }
}

export function clearPlacedOrderDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PLACED_ORDER_STORAGE_KEY);
}
