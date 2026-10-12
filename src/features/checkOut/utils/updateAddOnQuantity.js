export function updateAddOnQuantity(summary, itemId, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 0) return summary;
  const target = summary.items.find((item) => item.id === itemId && item.isAddOn);
  if (!target || target.quantity === quantity) return summary;
  const unitPrice = Number(target.unitPrice ?? 0) || Number(target.price ?? 0) / Math.max(1, Number(target.quantity));
  return {
    ...summary, pricing: null, previewItems: [], availability: null,
    items: summary.items.flatMap((item) => item.id !== itemId ? [item] : quantity === 0 ? [] : [{
      ...item, quantity, serves: quantity, totalServes: quantity,
      unitPrice, price: unitPrice * quantity,
      details: (item.details || []).filter((detail) => !/^Qty:/i.test(detail)),
    }]),
  };
}
