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
        createdOn
      }
      pendingVendorAdjustment {
        id
        status
        vendorNote
        reason
        proposedEventDate
        proposedDeliveryWindowStart
        proposedDeliveryWindowEnd
        proposedGuestCount
        proposedAddressLine1
        proposedAddressLine2
        proposedCity
        proposedPostalCode
        removedItemsJson
        addedItemsJson
        oldTotal
        newTotal
        createdOn
      }
      latestVendorAdjustment {
        id
        status
        createdOn
        customerResponse
      }
      vendor {
        id
        name
        slug
      }
    }
  }
`;

const UPDATE_CLIENT_ORDER_BEFORE_ACCEPTANCE_MUTATION = `
  mutation UpdateClientOrderBeforeAcceptance($input: UpdateClientOrderBeforeAcceptanceInput!) {
    updateClientOrderBeforeAcceptance(input: $input) {
      success
      message
      code
      order {
        id
        status
        eventDate
        eventTime
        personCount
        deliveryAddress
        deliverySuite
        deliveryCity
        deliveryPostalCode
        orderNotes
        updatedAt
        canModify
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

const APPROVE_VENDOR_ORDER_ADJUSTMENT_MUTATION = `
  mutation ApproveVendorOrderAdjustment($adjustmentId: ID!, $note: String) {
    approveVendorOrderAdjustment(adjustmentId: $adjustmentId, note: $note) {
      success
      message
      order {
        id
        status
        eventDate
        eventTime
        personCount
        grandTotal
      }
      adjustment {
        id
        status
        createdOn
      }
    }
  }
`;

const REJECT_VENDOR_ORDER_ADJUSTMENT_MUTATION = `
  mutation RejectVendorOrderAdjustment($adjustmentId: ID!, $reason: String!) {
    rejectVendorOrderAdjustment(adjustmentId: $adjustmentId, reason: $reason) {
      success
      message
      adjustment {
        id
        status
        customerResponse
        createdOn
      }
    }
  }
`;

function buildErrorMessage(result, fallbackMessage) {
  return result?.message || fallbackMessage;
}

function normalizeStatusToken(value) {
  return `${value ?? ""}`
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function canDirectlyUpdateClientOrder(status) {
  return ["NEW", "PLACED", "PENDING"].includes(normalizeStatusToken(status));
}

function isGraphqlContractError(error, fieldName) {
  const message = `${error?.message ?? ""}`.trim().toLowerCase();

  return (
    message.includes(`cannot query field '${fieldName.toLowerCase()}'`) ||
    message.includes(`cannot query field "${fieldName.toLowerCase()}"`)
  );
}

function isOrderAlreadyAcceptedError(error) {
  const message = `${error?.message ?? ""}`.trim().toUpperCase();
  return message.includes("ORDER_ALREADY_ACCEPTED");
}

function mapModificationRequest(request) {
  if (!request?.id) {
    return null;
  }

  return {
    id: request.id,
    status: request.status || "",
    createdOn: request.createdOn || "",
    resolvedOn: request.resolvedOn || request.createdOn || "",
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

function mapVendorAdjustment(adjustment) {
  if (!adjustment?.id) {
    return null;
  }

  return {
    id: adjustment.id,
    status: adjustment.status || "",
    vendorNote: adjustment.vendorNote || "",
    reason: adjustment.reason || "",
    proposedEventDate: adjustment.proposedEventDate || "",
    proposedDeliveryWindowStart: adjustment.proposedDeliveryWindowStart || "",
    proposedDeliveryWindowEnd: adjustment.proposedDeliveryWindowEnd || "",
    proposedGuestCount: Math.max(1, Number(adjustment.proposedGuestCount ?? 1) || 1),
    proposedAddressLine1: adjustment.proposedAddressLine1 || "",
    proposedAddressLine2: adjustment.proposedAddressLine2 || "",
    proposedCity: adjustment.proposedCity || "",
    proposedPostalCode: adjustment.proposedPostalCode || "",
    removedItemsJson: Array.isArray(adjustment.removedItemsJson)
      ? adjustment.removedItemsJson
      : [],
    addedItemsJson: Array.isArray(adjustment.addedItemsJson)
      ? adjustment.addedItemsJson
      : [],
    oldTotal: adjustment.oldTotal ?? null,
    newTotal: adjustment.newTotal ?? null,
    createdOn: adjustment.createdOn || "",
    resolvedOn: adjustment.resolvedOn || adjustment.createdOn || "",
    customerResponse: adjustment.customerResponse || "",
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
    status: order.status || "",
    vendorSlug: order.vendorSlug || order.vendor?.slug || "",
    vendorName: order.vendorName || order.vendor?.name || order.vendor || "",
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
    status: order.status || "",
    address: order.deliveryAddress || "",
    addressLine2: order.deliverySuite || "",
    city: order.deliveryCity || "",
    postalCode: order.deliveryPostalCode || "",
    date: order.eventDate || "",
    time: order.eventTime || "",
    personCount: Math.max(1, Number(order.personCount ?? 1) || 1),
    additionalDetails: order.orderNotes || "",
    canModify: order.canModify !== false,
    status: order.status || "",
    pendingModificationRequest: mapModificationRequest(order.pendingModificationRequest),
    latestModificationRequest: mapModificationRequest(order.latestModificationRequest),
    pendingVendorAdjustment: mapVendorAdjustment(order.pendingVendorAdjustment),
    latestVendorAdjustment: mapVendorAdjustment(order.latestVendorAdjustment),
    vendorSlug: order?.vendor?.slug || "",
    vendorName: order?.vendor?.name || "",
  };
}

export async function fetchOrderReviewTarget(orderId) {
  const details = await fetchOrderModificationDetails(orderId);

  if (!details?.vendorSlug) {
    throw new Error("Unable to open the review page for this order.");
  }

  return {
    orderId: details.orderId || orderId,
    vendorSlug: details.vendorSlug,
    vendorName: details.vendorName || "",
    eventDate: details.date || "",
    reviewPath: `/vendor/${details.vendorSlug}/reviews`,
  };
}

export async function submitOrderModification(input) {
  const directUpdateVariables = {
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

  if (canDirectlyUpdateClientOrder(input.status || input.orderStatus)) {
    try {
      const response = await graphqlRequest({
        query: UPDATE_CLIENT_ORDER_BEFORE_ACCEPTANCE_MUTATION,
        variables: directUpdateVariables,
      });
      const result = response?.updateClientOrderBeforeAcceptance;

      if (!result?.success) {
        throw new Error(
          buildErrorMessage(result, "Unable to update this order right now."),
        );
      }

      return {
        mode: "direct-update",
        message: result.message || "Order updated successfully.",
        order: result.order || null,
        request: null,
      };
    } catch (error) {
      if (
        !isGraphqlContractError(error, "updateClientOrderBeforeAcceptance") &&
        !isOrderAlreadyAcceptedError(error)
      ) {
        throw error;
      }
    }
  }

  const response = await graphqlRequest({
    query: REQUEST_CLIENT_ORDER_MODIFICATION_MUTATION,
    variables,
  });
  const result = response?.requestClientOrderModification;

  if (!result?.success) {
    throw new Error(buildErrorMessage(result, "Unable to submit this change request."));
  }

  return {
    mode: "modification-request",
    message: result.message || "Change request submitted successfully.",
    request: mapModificationRequest(result.request),
    order: null,
  };
}

export async function approveVendorOrderAdjustment({ adjustmentId, note = "" }) {
  const response = await graphqlRequest({
    query: APPROVE_VENDOR_ORDER_ADJUSTMENT_MUTATION,
    variables: {
      adjustmentId,
      note: `${note ?? ""}`.trim() || null,
    },
  });
  const result = response?.approveVendorOrderAdjustment;

  if (!result?.success) {
    throw new Error(buildErrorMessage(result, "Unable to approve the vendor adjustment."));
  }

  return {
    message: result.message || "Adjustment approved successfully.",
    order: result.order || null,
    adjustment: mapVendorAdjustment(result.adjustment),
  };
}

export async function rejectVendorOrderAdjustment({ adjustmentId, reason }) {
  const response = await graphqlRequest({
    query: REJECT_VENDOR_ORDER_ADJUSTMENT_MUTATION,
    variables: {
      adjustmentId,
      reason: `${reason ?? ""}`.trim(),
    },
  });
  const result = response?.rejectVendorOrderAdjustment;

  if (!result?.success) {
    throw new Error(buildErrorMessage(result, "Unable to reject the vendor adjustment."));
  }

  return {
    message: result.message || "Adjustment rejected successfully.",
    adjustment: mapVendorAdjustment(result.adjustment),
  };
}
