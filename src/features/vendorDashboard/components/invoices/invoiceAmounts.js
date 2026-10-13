import { parseMoney } from "../../../pricing/formatMoney.js";

export function resolveInvoiceAmount(node, pricing = {}) {
  const candidates = [node.grandTotal, pricing.grandTotal, node.totalAmount,
    node.order?.pricing?.grandTotal, node.order?.finalPrice, node.order?.grandTotal];
  const value = candidates.find((amount) => amount !== null && amount !== undefined && amount !== "");
  return value === undefined ? 0 : parseMoney(value);
}

export function buildInvoiceRows(order = {}) {
  const rows = (order.items || []).flatMap((item, index) => {
    const id = item.id || `menu-${index}`;
    let quantity = Number(item.quantity ?? 1);
    const unitPrice = parseMoney(item.unitPrice);
    const guestCount = Number(order.personCount || 0);
    const lineTotal = parseMoney(item.lineTotal ?? item.totalPrice);
    const rawAddOnsTotal = (item.selectedAddons || []).reduce((sum, addon) => sum + parseMoney(addon.totalPrice), 0);
    const perPerson = ["per-person", "per_person", "PER_PERSON"].includes(item.pricingType);
    // Some API records store menu quantity as orders but price per guest.
    if (guestCount > 1 && ((perPerson && quantity === 1) || (unitPrice > 0 &&
        (Math.abs(lineTotal - unitPrice * quantity * guestCount) < 0.01 ||
         Math.abs(lineTotal - rawAddOnsTotal - unitPrice * quantity * guestCount) < 0.01)))) {
      quantity *= guestCount;
    }
    const description = [item.specialInstructions ? `Note: ${item.specialInstructions}` : "",
      ...Object.entries(item.selectedOptions || {}).map(([key, value]) => `${key}: ${value}`)].filter(Boolean).join("\n");
    const main = { id, label: item.productName || "", description, quantity, unitPrice,
      totalPrice: item.lineSubtotal != null ? parseMoney(item.lineSubtotal) : lineTotal - rawAddOnsTotal };
    return [main, ...(item.selectedAddons || []).map((addon, addonIndex) => {
      const quantity = Number(addon.quantity ?? 1);
      const unitPrice = parseMoney(addon.unitPrice);
      return { id: `${id}-addon-${addonIndex}`, isAddOn: true, label: addon.name || "", description: "", quantity, unitPrice,
        totalPrice: parseMoney(addon.totalPrice) };
    })];
  });
  return rows;
}

export function mapInvoiceApiRows(items = [], order = {}) {
  return items.map((item) => {
    const unitPrice = parseMoney(item.unitPrice);
    const totalPrice = parseMoney(item.totalPrice);
    const guestCount = Number(order.personCount || 0);
    let quantity = Number(item.quantity);
    // The API can label a per-person line as one order. Display billed units
    // only when the supplied unit price, guest count, and total agree exactly.
    if (quantity === 1 && guestCount > 1 && unitPrice > 0 &&
        Math.abs(unitPrice * guestCount - totalPrice) < 0.01) quantity = guestCount;
    return { ...item, quantity, unitPrice, totalPrice };
  });
}
