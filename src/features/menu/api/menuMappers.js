import { toCustomerVatInclusivePrice } from "../../pricing/customerPricing";
import { isIndependentAddOn } from "../utils/addOnTypes";

function cleanAddOnName(value) {
  return String(value || "")
    .replace(/\s*\((?:add[-\s]?on|addon|tillegg)\)\s*$/i, "")
    .trim();
}

export function attachAddOnsToMenuItem(menuItem, addOns) {
  if (isIndependentAddOn(menuItem)) return menuItem;
  addOns = Array.isArray(addOns) ? addOns.filter((item) => !isIndependentAddOn(item)) : [];
  if (!menuItem || !Array.isArray(addOns) || addOns.length === 0) {
    return menuItem;
  }

  return {
    ...menuItem,
    modal: {
      ...menuItem.modal,
      optionalSelections: [
        {
          title: "Select Add-ons",
          options: addOns.map((item) => ({
            id: item.id,
            productId: item.id,
            label: cleanAddOnName(item.name),
            price: toCustomerVatInclusivePrice(item.priceWithTax),
            image: item.coverImage?.fileUrl || "",
          })),
        },
      ],
    },
  };
}
