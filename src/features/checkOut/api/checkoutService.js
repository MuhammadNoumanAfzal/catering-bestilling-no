import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { buildPlaceOrderPayload, mapCurrentUserToCheckoutProfile } from "./checkoutMappers";
import { buildPlaceClientOrderMutation } from "./checkoutMutations";
import { GET_CURRENT_USER_DETAILS_QUERY } from "./checkoutQueries";

export async function fetchCheckoutAutofillProfile() {
  const response = await graphqlRequest({ query: GET_CURRENT_USER_DETAILS_QUERY });

  if (!response?.me) {
    throw new Error("Unable to load account details.");
  }

  return mapCurrentUserToCheckoutProfile(response.me);
}

async function placeSingleOrder({ cart, checkoutType, formState }) {
  const payload = buildPlaceOrderPayload({ cart, checkoutType, formState });
  const query = buildPlaceClientOrderMutation(payload);
  const response = await graphqlRequest({ query });
  const result = response?.placeClientOrder;

  if (!result?.success) {
    throw new Error(result?.message || `Failed to place order for ${cart.vendor.name}.`);
  }

  return {
    vendorSlug: cart.vendor.slug,
    vendorName: cart.vendor.name,
    orderId: result.orderId,
    message: result.message || "Order placed successfully.",
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
