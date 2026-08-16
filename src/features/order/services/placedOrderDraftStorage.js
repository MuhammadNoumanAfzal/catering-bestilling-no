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
        orderNumber: order.orderNumber || "",
        orderStatus: order.orderStatus || "",
        message: order.message,
        invoiceId: order.invoiceId || "",
        invoiceNumber: order.invoiceNumber || "",
        invoiceStatus: order.invoiceStatus || "",
        invoiceIssueDate: order.invoiceIssueDate || "",
        invoiceDueDate: order.invoiceDueDate || "",
        paymentMethod: order.paymentMethod || "",
        paymentReference: order.paymentReference || "",
        invoicePdfUrl: order.invoicePdfUrl || "",
        bankDetails: {
          accountName: order.bankDetails?.accountName || "",
          accountNumber: order.bankDetails?.accountNumber || "",
          iban: order.bankDetails?.iban || "",
          swiftCode: order.bankDetails?.swiftCode || "",
          bankName: order.bankDetails?.bankName || "",
          instructions: order.bankDetails?.instructions || "",
        },
        pricing: {
          subtotal: order.pricing?.subtotal ?? null,
          taxAmount: order.pricing?.taxAmount ?? null,
          deliveryFee: order.pricing?.deliveryFee ?? null,
          grandTotal: order.pricing?.grandTotal ?? null,
          amountPaid: order.pricing?.amountPaid ?? null,
          amountDue: order.pricing?.amountDue ?? null,
          currency: order.pricing?.currency || "NOK",
          formattedTotal: order.pricing?.formattedTotal || "",
        },
        customer: {
          id: order.customer?.id || "",
          fullName: order.customer?.fullName || "",
          email: order.customer?.email || "",
        },
        promisedDeliveryWindow: order.promisedDeliveryWindow
          ? {
              minMinutes: order.promisedDeliveryWindow.minMinutes ?? null,
              maxMinutes: order.promisedDeliveryWindow.maxMinutes ?? null,
              label: order.promisedDeliveryWindow.label || "",
            }
          : null,
      }))
    : [];
}

function normalizeModificationRequest(request) {
  if (!request || typeof request !== "object") {
    return null;
  }

  return {
    id: request.id || "",
    status: request.status || "",
    createdOn: request.createdOn || "",
    resolvedOn: request.resolvedOn || "",
    requestedChanges: request.requestedChanges
      ? {
          eventDate: request.requestedChanges.eventDate || "",
          eventTime: request.requestedChanges.eventTime || "",
          personCount: Number(request.requestedChanges.personCount ?? 1) || 1,
          deliveryAddress: request.requestedChanges.deliveryAddress || "",
          deliverySuite: request.requestedChanges.deliverySuite || "",
          deliveryCity: request.requestedChanges.deliveryCity || "",
          deliveryPostalCode: request.requestedChanges.deliveryPostalCode || "",
          orderNotes: request.requestedChanges.orderNotes || "",
        }
      : null,
    currentSnapshot: request.currentSnapshot
      ? {
          eventDate: request.currentSnapshot.eventDate || "",
          eventTime: request.currentSnapshot.eventTime || "",
          personCount: Number(request.currentSnapshot.personCount ?? 1) || 1,
        }
      : null,
  };
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
    modificationRequest: normalizeModificationRequest(value?.modificationRequest),
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
      modificationRequest: normalizeModificationRequest(parsedValue?.modificationRequest),
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
