import { normalizeStandaloneItem } from "../../menu/utils/standaloneCart.js";

function resolveProductId(item) {
  if (item.productId) {
    return `${item.productId}`;
  }

  const matched = `${item.id ?? ""}`.match(/^(\d+)/);
  return matched ? matched[1] : "";
}

function normalizeSelectedOptions(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, optionValue]) => [`${key ?? ""}`.trim(), `${optionValue ?? ""}`.trim()])
      .filter(([key, optionValue]) => key && optionValue),
  );
}

function normalizeSelectedAddons(items, parentProductId) {
  return items
    .filter(
      (item) =>
        item?.isAddOn &&
        `${item.parentMenuItemId ?? ""}` === `${parentProductId ?? ""}`,
    )
    .map((item) => {
      const quantity = Math.max(1, Number(item.quantity ?? 1));

      return {
        name: item.name || "Add-on",
        quantity,
      };
    })
    .filter((item) => item.name && Number.isFinite(item.quantity));
}

export function buildOrderItems(items, orderPersonCount, acceptedOffer = false) {
  return items
    .map(item => {
      // Offer snapshots may omit INDEPENDENT metadata. Per-person lines still
      // need their guest count on the server, not only on the order envelope.
      const needsGuests = item?.pricingType === 'per-person' || item?.addOnType === 'INDEPENDENT';
      if (!needsGuests || item?.isAddOn) return normalizeStandaloneItem(item);
      const count = !acceptedOffer && item.addOnType === 'INDEPENDENT' ? item.personCount ?? orderPersonCount : orderPersonCount ?? item.personCount;
      const personCount = Number(count);
      if (!Number.isSafeInteger(personCount) || personCount <= 0) throw new Error('A positive whole guest count is required for this item.');
      return normalizeStandaloneItem({ ...item, personCount });
    })
    .filter((item) => !item?.isAddOn)
    .map((item) => {
      const productId = resolveProductId(item);

      if (!productId) {
        throw new Error(
          `Cart item "${item.name || item.id}" is missing a valid product id.`,
        );
      }

      const selectedOptions = normalizeSelectedOptions(item.selectedOptions);
      const selectedAddons = normalizeSelectedAddons(items, productId);
      const specialInstructions = `${item.specialInstructions ?? ""}`.trim();

      return {
        product: productId,
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        ...((item.pricingType === "per-person" || item.addOnType === "INDEPENDENT") ? { personCount: Number(item.personCount) } : {}),
        ...(Object.keys(selectedOptions).length > 0
          ? { selectedOptions }
          : {}),
        ...(selectedAddons.length > 0 ? { selectedAddons } : {}),
        ...(specialInstructions ? { specialInstructions } : {}),
      };
    });
}

export function buildCheckoutPreviewItems(items, orderPersonCount, acceptedOffer = false) {
  return buildOrderItems(items, orderPersonCount, acceptedOffer).map((item) => ({
    productId: item.product,
    quantity: item.quantity,
    ...(item.personCount ? { personCount: item.personCount } : {}),
    ...(item.selectedAddons ? { selectedAddons: item.selectedAddons } : {}),
  }));
}
