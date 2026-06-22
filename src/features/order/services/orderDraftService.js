import { showSuccessToast } from "../../../utils/alerts";
import { writeOrderSummary } from "../../vendor/utils/orderSummaryStorage";
import { writePlacedOrderDraft } from "./placedOrderDraftStorage";

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
    const nextOrderSummary = {
      ...cart.orderSummary,
      deliveryAddress: nextValues.address,
      deliveryDate: nextValues.date,
      deliveryTime: nextValues.time,
      personCount: nextValues.personCount,
    };

    writeOrderSummary(cart.vendor, nextOrderSummary);

    return {
      ...cart,
      orderSummary: nextOrderSummary,
    };
  });

  return {
    ...placedOrderDraft,
    carts: nextCarts,
    formState: nextFormState,
  };
}

export async function savePlacedOrderDraftChanges(placedOrderDraft, nextValues) {
  const nextPlacedOrderDraft = buildUpdatedPlacedOrderDraft(
    placedOrderDraft,
    nextValues,
  );

  writePlacedOrderDraft(nextPlacedOrderDraft);
  await showSuccessToast("Modification request sent successfully");

  return nextPlacedOrderDraft;
}
