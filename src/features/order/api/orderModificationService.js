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
      pendingModificationRequest {
        id
        status
        requestedChanges {
          eventDate
          eventTime
          personCount
          deliveryAddress
          deliverySuite
          deliveryCity
          deliveryPostalCode
          orderNotes
        }
        currentSnapshot {
          eventDate
          eventTime
          personCount
        }
        createdOn
      }
      latestModificationRequest {
        id
        status
        resolvedOn
      }
    }
  }
`;

const REQUEST_CLIENT_ORDER_MODIFICATION_MUTATION = `
  mutation RequestClientOrderModification($input: RequestClientOrderModificationInput!) {
    requestClientOrderModification(input: $input) {
      success
      message
      request {
        id
        status
        requestedChanges {
          eventDate
          eventTime
          personCount
          deliveryAddress
          deliverySuite
          deliveryCity
          deliveryPostalCode
          orderNotes
        }
        currentSnapshot {
          eventDate
          eventTime
          personCount
        }
        createdOn
      }
    }
  }
`;

function buildErrorMessage(result, fallbackMessage) {
  return result?.message || fallbackMessage;
}

function mapModificationRequest(request) {
  if (!request?.id) {
    return null;
  }

  return {
    id: request.id,
    status: request.status || "",
    createdOn: request.createdOn || "",
    resolvedOn: request.resolvedOn || "",
    requestedChanges: {
      eventDate: request.requestedChanges?.eventDate || "",
      eventTime: request.requestedChanges?.eventTime || "",
      personCount: Math.max(1, Number(request.requestedChanges?.personCount ?? 1) || 1),
      deliveryAddress: request.requestedChanges?.deliveryAddress || "",
      deliverySuite: request.requestedChanges?.deliverySuite || "",
      deliveryCity: request.requestedChanges?.deliveryCity || "",
      deliveryPostalCode: request.requestedChanges?.deliveryPostalCode || "",
      orderNotes: request.requestedChanges?.orderNotes || "",
    },
    currentSnapshot: {
      eventDate: request.currentSnapshot?.eventDate || "",
      eventTime: request.currentSnapshot?.eventTime || "",
      personCount: Math.max(1, Number(request.currentSnapshot?.personCount ?? 1) || 1),
    },
  };
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
    pendingModificationRequest: mapModificationRequest(order.pendingModificationRequest),
    latestModificationRequest: mapModificationRequest(order.latestModificationRequest),
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
    query: REQUEST_CLIENT_ORDER_MODIFICATION_MUTATION,
    variables,
  });
  const result = response?.requestClientOrderModification;

  if (!result?.success) {
    throw new Error(buildErrorMessage(result, "Unable to submit this change request."));
  }

  return {
    message: result.message || "Change request submitted successfully.",
    request: mapModificationRequest(result.request),
  };
}
