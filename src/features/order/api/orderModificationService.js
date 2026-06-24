import { graphqlRequest } from "../../../lib/api/graphqlClient";

const GET_CLIENT_ORDER_MODIFY_QUERY = `
  query GetClientOrderDetail($orderId: ID!) {
    clientOrder(id: $orderId) {
      id
      status
      deliveryAddress
      deliverySuite
      deliveryCity
      deliveryPostalCode
      deliveryAddressStr
      eventDate
      eventTime
      personCount
      orderNotes
      canModify
    }
  }
`;

const MODIFY_CLIENT_ORDER_MUTATION = `
  mutation ModifyClientOrder($input: ModifyClientOrderInput!) {
    modifyClientOrder(input: $input) {
      success
      message
      order {
        id
        status
        deliveryAddress
        deliverySuite
        deliveryCity
        deliveryPostalCode
        deliveryAddressStr
        eventDate
        eventTime
        personCount
        orderNotes
        totalAmount
        taxAmount
        deliveryFee
        grandTotal
      }
    }
  }
`;

function buildErrorMessage(result, fallbackMessage) {
  return result?.message || fallbackMessage;
}

export function mapOrderToModifyForm(order) {
  if (!order) {
    return null;
  }

  return {
    orderId: order.rawId || order.orderId || order.id || "",
    address: order.deliveryAddress || "",
    addressLine2: order.deliverySuite || "",
    city: order.deliveryCity || "",
    postalCode: order.deliveryPostalCode || "",
    date: order.eventDateRaw || order.date || "",
    time: order.eventTime || "",
    personCount: Number(order.personCount ?? order.person ?? 1) || 1,
    additionalDetails: order.orderNotes || "",
    canModify: order.canModify !== false,
  };
}

export async function fetchOrderModificationDetails(orderId) {
  const response = await graphqlRequest({
    query: GET_CLIENT_ORDER_MODIFY_QUERY,
    variables: { orderId },
  });
  const order = response?.clientOrder;

  if (!order?.id) {
    throw new Error("Unable to load order modification details.");
  }

  return {
    orderId: order.id,
    address: order.deliveryAddress || "",
    addressLine2: order.deliverySuite || "",
    city: order.deliveryCity || "",
    postalCode: order.deliveryPostalCode || "",
    date: order.eventDate || "",
    time: order.eventTime || "",
    personCount: Math.max(1, Number(order.personCount ?? 1) || 1),
    additionalDetails: order.orderNotes || "",
    canModify: order.canModify !== false,
  };
}

export async function submitOrderModification(input) {
  const variables = {
    input: {
      orderId: input.orderId,
      deliveryAddress: `${input.address ?? ""}`.trim(),
      deliverySuite: `${input.addressLine2 ?? ""}`.trim(),
      deliveryCity: `${input.city ?? ""}`.trim(),
      deliveryPostalCode: `${input.postalCode ?? ""}`.trim(),
      eventDate: input.date || null,
      eventTime: input.time || null,
      personCount: Math.max(1, Number(input.personCount ?? 1) || 1),
      orderNotes: `${input.additionalDetails ?? ""}`.trim(),
    },
  };

  const response = await graphqlRequest({
    query: MODIFY_CLIENT_ORDER_MUTATION,
    variables,
  });
  const result = response?.modifyClientOrder;

  if (!result?.success) {
    throw new Error(buildErrorMessage(result, "Unable to modify this order."));
  }

  return {
    message: result.message || "Order modified successfully.",
    order: result.order || null,
  };
}
