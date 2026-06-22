export function formatOrderPreview(orderDraft) {
  const primaryCart = orderDraft?.carts?.[0];
  const formState = orderDraft?.formState ?? {};
  const placedOrders = orderDraft?.placedOrders ?? [];
  const orderIds = placedOrders
    .map((order) => `${order.orderId ?? ""}`.trim())
    .filter(Boolean)
    .map((orderId) => (orderId.startsWith("#") ? orderId : `#${orderId}`));

  return {
    orderIds,
    address:
      formState.deliveryAddress ||
      primaryCart?.orderSummary?.deliveryAddress ||
      "",
    addressLine2: formState.deliveryAddressLine2 || "",
    city: formState.deliveryCity || "",
    postalCode: formState.deliveryPostalCode || "",
    date: formState.date || primaryCart?.orderSummary?.deliveryDate || "",
    time: formState.time || primaryCart?.orderSummary?.deliveryTime || "",
    personCount:
      formState.personCount || primaryCart?.orderSummary?.personCount || 20,
    additionalDetails: formState.additionalInfo || "",
  };
}
