import { writeOrderSummary } from "../../vendor/utils/orderSummaryStorage";
import { writePlacedOrderDraft } from "./placedOrderDraftStorage";

function resetDerivedOrderSummaryState(orderSummary) {
  if (!orderSummary) {
    return orderSummary;
  }

  return {
    ...orderSummary,
    pricing: null,
    previewItems: [],
    pricingCurrency: "NOK",
    availability: null,
  };
}

export function buildUpdatedPlacedOrderDraft(placedOrderDraft, nextValues) {
  const nextFormState = {
    ...placedOrderDraft.formState,
    deliveryAddress: nextValues.address,
    deliveryAddressLine2: nextValues.addressLine2,
    deliveryCity: nextValues.city,
    deliveryPostalCode: nextValues.postalCode,
    date: nextValues.date,
    time: nextValues.time,
    personCount: nextValues.personCount,
    additionalInfo: nextValues.additionalDetails,
  };

  const nextCarts = placedOrderDraft.carts.map((cart) => {
    const nextOrderSummary = resetDerivedOrderSummaryState({
      ...cart.orderSummary,
      deliveryAddress: nextValues.address,
      deliveryDate: nextValues.date,
      deliveryTime: nextValues.time,
      personCount: nextValues.personCount,
    });

    writeOrderSummary(cart.vendor, nextOrderSummary);

    return {
      ...cart,
      orderSummary: nextOrderSummary,
    };
  });

  const nextPlacedOrders = Array.isArray(placedOrderDraft.placedOrders)
    ? placedOrderDraft.placedOrders.map((order) => ({
        ...order,
        orderStatus: nextValues.orderStatus || order.orderStatus || "",
      }))
    : [];

  return {
    ...placedOrderDraft,
    carts: nextCarts,
    formState: nextFormState,
    placedOrders: nextPlacedOrders,
  };
}

export async function savePlacedOrderDraftChanges(placedOrderDraft, nextValues) {
  const nextPlacedOrderDraft = buildUpdatedPlacedOrderDraft(
    placedOrderDraft,
    nextValues,
  );

  writePlacedOrderDraft(nextPlacedOrderDraft);

  return nextPlacedOrderDraft;
}

export async function savePlacedOrderDraftModificationRequest(
  placedOrderDraft,
  request,
) {
  const nextPlacedOrderDraft = {
    ...placedOrderDraft,
    modificationRequest: request || null,
  };

  writePlacedOrderDraft(nextPlacedOrderDraft);

  return nextPlacedOrderDraft;
}

export async function savePlacedOrderDraftDirectUpdate(
  placedOrderDraft,
  nextValues,
) {
  const nextPlacedOrderDraft = {
    ...buildUpdatedPlacedOrderDraft(placedOrderDraft, nextValues),
    modificationRequest: null,
  };

  writePlacedOrderDraft(nextPlacedOrderDraft);

  return nextPlacedOrderDraft;
}
