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

// Included dishes are descriptive menu contents, not additional billed quantities.
export function uniqueIncludedDishNames(items) {
 const seen = new Set();
 return (Array.isArray(items) ? items : []).flatMap(value => {
  const name = String(value ?? "").trim().replace(/\s+/g, " ");
  const key = name.normalize("NFC").toLocaleLowerCase("nb");
  if (!name || seen.has(key)) return [];
  seen.add(key);
  return [name];
 });
}
