function wholeNumber(value, fallback) {
  const number = Math.trunc(Number(value));
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

export function normalizeStandaloneItem(item) {
  if (item?.addOnType !== "INDEPENDENT") return item;
  const minimumGuests = wholeNumber(item.minimumGuests ?? item.serves, 1);
  const personCount = Math.max(minimumGuests, wholeNumber(item.personCount, minimumGuests));
  const quantity = item.pricingType === "per-person" ? 1 : wholeNumber(item.quantity, 1);
  return { ...item, minimumGuests, personCount, quantity, totalServes: personCount,
    price: item.pricingType === "per-person" ? 0 : Number(item.unitPrice || 0) * quantity };
}

export function updateStandaloneItem(summary, id, changes) {
  if (!summary?.items?.some((item) => item.id === id && item.addOnType === "INDEPENDENT")) return summary;
  return { ...summary, pricing: null, previewItems: [], availability: null,
    items: summary.items.map((item) => item.id === id ? normalizeStandaloneItem({ ...item, ...changes }) : item) };
}
