import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  buildCheckoutPreviewPayload,
  buildPlaceOrderPayload,
  mapCurrentUserToCheckoutProfile,
} from "./checkoutMappers";
import {
  buildPlaceClientOrderVariables,
  PLACE_CLIENT_ORDER_MUTATION,
} from "./checkoutMutations";
import {
  GET_CHECKOUT_PREVIEW_QUERY,
  GET_CURRENT_USER_DETAILS_QUERY,
  GET_AVAILABLE_DELIVERY_SLOTS_QUERY,
} from "./checkoutQueries";

function isAuthAvailabilityError(error) {
  const message = `${error?.message ?? ""}`.toLowerCase();

  return [
    "sign in",
    "signin",
    "log in",
    "login",
    "authentication",
    "authenticated",
    "credentials",
    "permission",
    "unauthorized",
    "forbidden",
  ].some((fragment) => message.includes(fragment));
}

export async function fetchCheckoutAutofillProfile() {
  const response = await graphqlRequest({ query: GET_CURRENT_USER_DETAILS_QUERY });

  if (!response?.me) {
    throw new Error("Unable to load account details.");
  }

  return mapCurrentUserToCheckoutProfile(response.me);
}

export async function fetchAvailableDeliverySlots({ vendorId, date }) {
  if (!vendorId || !date) return [];

  try {
    const response = await graphqlRequest({
      query: GET_AVAILABLE_DELIVERY_SLOTS_QUERY,
      variables: { vendorId, date },
    });

    const slots = response?.availableDeliverySlots;
    if (!Array.isArray(slots)) return [];

    return slots.map((slot) => ({
      start: slot.start || "",
      end: slot.end || "",
      label: `${slot.start} – ${slot.end}`,
      isFullyBooked: Boolean(slot.isFullyBooked),
      remainingCapacity: Number(slot.remainingCapacity ?? 9999),
    }));
  } catch (error) {
    if (isAuthAvailabilityError(error)) {
      const authError = new Error(
        "Sign in to view live delivery availability for the selected date.",
      );
      authError.code = "AUTH_REQUIRED";
      throw authError;
    }

    return [];
  }
}

export async function fetchCheckoutPreview({ cart, checkoutType, formState }) {
  const payload = buildCheckoutPreviewPayload({ cart, checkoutType, formState });
  const response = await graphqlRequest({
    query: GET_CHECKOUT_PREVIEW_QUERY,
    variables: { input: payload },
  });

  if (!response?.checkoutPreview) {
    throw new Error(`Unable to calculate checkout totals for ${cart.vendor.name}.`);
  }

  return response.checkoutPreview;
}


async function placeSingleOrder({ cart, checkoutType, formState }) {
  const payload = buildPlaceOrderPayload({ cart, checkoutType, formState });
  const variables = buildPlaceClientOrderVariables(payload);
  const response = await graphqlRequest({
    query: PLACE_CLIENT_ORDER_MUTATION,
    variables,
  });
  const result = response?.placeClientOrder;

  if (!result?.success) {
    const availabilityErrors = Array.isArray(result?.availability?.errors)
      ? result.availability.errors
      : [];
    const firstAvailabilityMessage = availabilityErrors
      .map((issue) => `${issue?.message ?? ""}`.trim())
      .find(Boolean);
    throw new Error(
      firstAvailabilityMessage ||
        result?.message ||
        `Failed to place order for ${cart.vendor.name}.`,
    );
  }

  return {
    vendorSlug: cart.vendor.slug,
    vendorName: cart.vendor.name,
    orderId: result.orderId,
    message: result.message || "Order placed successfully.",
    promisedDeliveryWindow: result.promisedDeliveryWindow || null,
  };
}

export async function placeCheckoutOrders({ carts, checkoutType, formState }) {
  const successfulOrders = [];

  for (const cart of carts) {
    try {
      const result = await placeSingleOrder({ cart, checkoutType, formState });
      successfulOrders.push(result);
    } catch (error) {
      const successfulOrderIds = successfulOrders
        .map((order) => order.orderId)
        .filter(Boolean);

      const message =
        successfulOrders.length > 0
          ? `Placed ${successfulOrders.length} order(s) successfully (${successfulOrderIds.join(", ")}), but failed on ${cart.vendor.name}: ${error.message}`
          : error.message;

      const partialError = new Error(message);
      partialError.successfulOrders = successfulOrders;
      throw partialError;
    }
  }

  return successfulOrders;
}
