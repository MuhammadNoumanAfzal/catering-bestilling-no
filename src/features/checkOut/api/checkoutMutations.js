export const PLACE_CLIENT_ORDER_MUTATION = `
  mutation PlaceClientOrder($input: PlaceClientOrderInput!) {
    placeClientOrder(input: $input) {
      success
      message
      orderId
      availability {
        isValid
        errors {
          code
          message
          field
          meta
        }
        warnings {
          code
          message
          field
          meta
        }
      }
      promisedDeliveryWindow {
        minMinutes
        maxMinutes
        label
      }
    }
  }
`;

export function buildPlaceClientOrderVariables(payload) {
  const input = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === "string") {
        return value !== "";
      }

      return true;
    }),
  );

  return { input };
}
