export function getIncludedOrderDishes(product) {
  if (product?.addOnType === "INDEPENDENT") return [];
  const items = product?.menuItems;
  return Array.isArray(items) ? items : (items?.edges || []).map((edge) => edge?.node).filter(Boolean);
}

export function getOrderDisplayGuestCount(order, fallback = 1) {
  const items = Array.isArray(order?.items) ? order.items : [];
  if (items.length && items.every((item) => item.addOnType === "INDEPENDENT")) {
    return Math.max(1, ...items.map((item) => Number(item.personCount) || 1));
  }
  return Number(order?.personCount) || Number(fallback) || 1;
}
