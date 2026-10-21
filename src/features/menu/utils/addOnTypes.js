export const independentAddOnsEnabled = import.meta.env?.VITE_INDEPENDENT_ADDONS_ENABLED === "true";
export const standaloneProductFields = independentAddOnsEnabled ? "addOnType minimumQuantity" : "";
export const orderableProductFilter = independentAddOnsEnabled ? "orderableOnly: true" : 'productType: "menu"';

export function isIndependentAddOn(item) {
  return String(item?.addOnType || "").toUpperCase() === "INDEPENDENT";
}

export function isAddOnProduct(item) {
  return ["add-on", "addon", "add_on"].includes(String(item?.productType || "").toLowerCase());
}

export function isDirectlyOrderableProduct(item, enabled = independentAddOnsEnabled) {
  return !isAddOnProduct(item) || (enabled && isIndependentAddOn(item));
}

export function getLineGuestCount(item, fallback) {
  return Math.max(1, Number(isIndependentAddOn(item) ? item.personCount : fallback) || 1);
}
