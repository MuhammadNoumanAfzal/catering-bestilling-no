export function formatOrderPreview(orderDraft) {
  const primaryCart = orderDraft?.carts?.[0];
  const formState = orderDraft?.formState ?? {};
  const placedOrders = orderDraft?.placedOrders ?? [];
  const primaryPlacedOrder = placedOrders[0] ?? null;
  const modificationRequest = orderDraft?.modificationRequest ?? null;
  const promisedDeliveryWindowLabel =
    `${primaryPlacedOrder?.promisedDeliveryWindow?.label ?? ""}`.trim();
  const orderIds = placedOrders
    .map((order) => `${order.orderNumber || order.orderId || ""}`.trim())
    .filter(Boolean)
    .map((orderId) => (orderId.startsWith("#") ? orderId : `#${orderId}`));

  return {
    orderIds,
    invoiceId: primaryPlacedOrder?.invoiceId || "",
    invoiceNumber: primaryPlacedOrder?.invoiceNumber || "",
    invoiceStatus: primaryPlacedOrder?.invoiceStatus || "",
    invoiceDueDate: primaryPlacedOrder?.invoiceDueDate || "",
    paymentMethod: primaryPlacedOrder?.paymentMethod || "",
    paymentReference: primaryPlacedOrder?.paymentReference || "",
    invoicePdfUrl: primaryPlacedOrder?.invoicePdfUrl || "",
    bankDetails: primaryPlacedOrder?.bankDetails || null,
    amountDue: primaryPlacedOrder?.pricing?.formattedTotal || "",
    address:
      formState.deliveryAddress ||
      primaryCart?.orderSummary?.deliveryAddress ||
      "",
    addressLine2: formState.deliveryAddressLine2 || "",
    city: formState.deliveryCity || "",
    postalCode: formState.deliveryPostalCode || "",
    date: formState.date || primaryCart?.orderSummary?.deliveryDate || "",
    time: formState.time || primaryCart?.orderSummary?.deliveryTime || "",
    deliveryEstimate: promisedDeliveryWindowLabel,
    personCount:
      formState.personCount || primaryCart?.orderSummary?.personCount || 20,
    additionalDetails: formState.additionalInfo || "",
    modificationRequest,
  };
}
