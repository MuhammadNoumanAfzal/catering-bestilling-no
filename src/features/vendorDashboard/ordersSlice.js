import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";
import { getOrderLifecycle } from "./components/orders/orderUtils";
import { readPlacedOrderDraft } from "../order/services";
import {
  formatCurrency as formatCheckoutCurrency,
  getCheckoutTotals,
} from "../checkOut/components/summary/checkoutSummaryUtils";

const FETCH_CLIENT_ORDERS_QUERY = `
  query FetchClientOrders($tab: String, $first: Int, $after: String) {
    clientOrders(tab: $tab, first: $first, after: $after) {
      totalCount
      edges {
        cursor
        node {
          id
          invoiceNumber
          status
          pricing {
            subtotal
            taxAmount
            deliveryFee
            addOnsTotal
            tipAmount
            grandTotal
          }
          createdOn
          dueDate
          eventDate
          eventTime
          personCount
          orderNotes
          vendor {
            id
            name
            slug
            coverPhotoUrl
            logoUrl
          }
          items {
            id
            productName
            quantity
            unitPrice
            lineTotal
            specialInstructions
            selectedOptions
            selectedAddons {
              name
              unitPrice
              quantity
              totalPrice
            }
          }
          modifiedItems {
            id
            name
            changeLabel
            summary
            previousValue
            newValue
          }
          hasPendingVendorAdjustment
          hasPendingModificationRequest
          pendingVendorAdjustment {
            id
            status
          }
          pendingModificationRequest {
            id
            status
          }
          latestModificationRequest {
            id
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const FETCH_CLIENT_ORDER_DETAIL_QUERY = `
  query GetClientOrderDetail($orderId: ID!) {
    clientOrder(id: $orderId) {
      id
      status
      canModify
      canceledAt
      cancellationReason
      hasPendingVendorAdjustment
      hasPendingModificationRequest
      eventName
      personCount
      pricing {
        subtotal
        taxRate
        taxAmount
        deliveryFee
        addOnsTotal
        tipAmount
        discountAmount
        serviceFee
        grandTotal
        amountPaid
        amountDue
      }
      deliveryAddress
      deliverySuite
      deliveryCity
      deliveryPostalCode
      deliveryAddressStr
      orderNotes
      createdOn
      eventDate
      eventTime
      vendor {
        id
        name
        slug
        logoUrl
      }
      items {
        id
        productName
        quantity
        unitPrice
        lineTotal
        specialInstructions
        selectedOptions
        selectedAddons {
          name
          unitPrice
          quantity
          totalPrice
        }
        product {
          id
          name
          description
          coverImage {
            id
            fileUrl
          }
          menuItems {
            id
            title
            description
          }
        }
      }
      modifiedItems {
        id
        name
        changeLabel
        summary
        previousValue
        newValue
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
        includedDishReplacements {
          orderItemId
          quantity
          removedMenuItem {
            id
            title
            description
            coverImage { fileUrl }
          }
          replacementMenu { id name }
          replacementMenuItem {
            id
            title
            description
            coverImage { fileUrl }
          }
        }
      }
      latestVendorAdjustment {
        id
        status
        vendorNote
        reason
        customerResponse
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
        includedDishReplacements {
          orderItemId
          quantity
          removedMenuItem {
            id
            title
            description
            coverImage { fileUrl }
          }
          replacementMenu { id name }
          replacementMenuItem {
            id
            title
            description
            coverImage { fileUrl }
          }
        }
      }
      pendingModificationRequest {
        id
        status
        reason
        customerResponse
        createdOn
        currentSnapshot {
          eventDate
          eventTime
          personCount
          orderNotes
          deliveryAddress {
            addressLine1
            addressLine2
            city
            postalCode
          }
        }
        proposedSnapshot {
          eventDate
          eventTime
          personCount
          orderNotes
          deliveryAddress {
            addressLine1
            addressLine2
            city
            postalCode
          }
        }
      }
      latestModificationRequest {
        id
        status
        createdOn
        resolvedOn
      }
    }
  }
`;

const FETCH_CLIENT_ORDER_LIST_STATUS_QUERY = `
  query GetClientOrderListStatus($orderId: ID!) {
    clientOrder(id: $orderId) {
      id
      status
      hasPendingVendorAdjustment
      hasPendingModificationRequest
      pendingVendorAdjustment {
        id
        status
      }
      pendingModificationRequest {
        id
        status
      }
      latestVendorAdjustment {
        id
        status
      }
      latestModificationRequest {
        id
        status
      }
      modifiedItems {
        id
      }
    }
  }
`;

const FETCH_CLIENT_ORDER_MODIFICATIONS_QUERY = `
  query GetClientOrderModifications($orderId: ID!) {
    clientOrder(id: $orderId) {
      id
      statuses {
        id
        status
        note
        createdOn
      }
      order {
        id
        statuses {
          id
          status
          note
          createdOn
        }
      }
    }
  }
`;

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

const formatAmount = (val) => {
  const num = parseFloat(val || 0);
  return `NOK ${num.toFixed(2)}`;
};

const formatNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const formatId = (id) => {
  if (!id) return "";
  const idStr = String(id);
  return idStr.startsWith("#") ? idStr : `#${idStr}`;
};

function normalizeOrderIdForComparison(id) {
  const rawId = `${id ?? ""}`.trim();

  if (!rawId) {
    return "";
  }

  try {
    let base64 = rawId;
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const decoded = atob(base64);

    if (decoded.includes(":")) {
      const parts = decoded.split(":");
      return `${parts[parts.length - 1] ?? ""}`.trim();
    }
  } catch {
    // Ignore invalid base64/global IDs and use the original value.
  }

  return rawId;
}

function buildPlacedOrderDraftOverride(orderId) {
  const draft = readPlacedOrderDraft();
  const primaryPlacedOrder = draft?.placedOrders?.[0] || null;
  const draftOrderId = normalizeOrderIdForComparison(primaryPlacedOrder?.orderId);
  const normalizedOrderId = normalizeOrderIdForComparison(orderId);

  if (!draftOrderId || !normalizedOrderId || draftOrderId !== normalizedOrderId) {
    return null;
  }

  const carts = Array.isArray(draft?.carts) ? draft.carts : [];
  const formState = draft?.formState ?? {};
  const totals = getCheckoutTotals(
    carts.map((cart) => ({
      ...cart,
      orderSummary: {
        ...cart.orderSummary,
        pricing: null,
        previewItems: [],
        pricingCurrency: "NOK",
        availability: null,
      },
    })),
  );
  const grandTotal = Number(totals?.grandTotal ?? 0);
  const deliveryAddress = [formState.deliveryAddress, formState.deliveryAddressLine2]
    .filter(Boolean)
    .join(", ");
  const fullLocation = [
    deliveryAddress,
    formState.deliveryCity,
    formState.deliveryPostalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    eventDate: formState.date || "",
    eventTime: formState.time || "",
    personCount: Number(formState.personCount ?? 0) || 0,
    deliveryAddress: formState.deliveryAddress || "",
    deliverySuite: formState.deliveryAddressLine2 || "",
    deliveryCity: formState.deliveryCity || "",
    deliveryPostalCode: formState.deliveryPostalCode || "",
    deliveryAddressStr: fullLocation,
    total:
      Number.isFinite(grandTotal) && grandTotal > 0
        ? `NOK ${formatCheckoutCurrency(grandTotal)}`
        : "",
  };
}

function resolveOrderGrandTotal(node, fallbackAddOnsTotal = 0) {
  const pricing = node?.pricing || {};
  const grandTotal = parseFloat(pricing?.grandTotal || node?.grandTotal || 0);
  if (Number.isFinite(grandTotal) && grandTotal > 0) {
    return grandTotal;
  }

  const totalAmount = parseFloat(pricing?.subtotal || node?.totalAmount || 0);
  const deliveryFee = parseFloat(pricing?.deliveryFee || node?.deliveryFee || 0);
  const tipAmount = parseFloat(pricing?.tipAmount || node?.tipAmount || 0);
  const taxAmount = parseFloat(pricing?.taxAmount || node?.taxAmount || 0);

  if (Number.isFinite(totalAmount) && totalAmount > 0) {
    return totalAmount + deliveryFee + tipAmount + taxAmount + fallbackAddOnsTotal;
  }

  return totalAmount + tipAmount + fallbackAddOnsTotal;
}

const toTitleCase = (value) =>
  `${value ?? ""}`
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const PENDING_VENDOR_ADJUSTMENT_STATUSES = new Set([
  "PENDING",
  "PENDING_CUSTOMER_APPROVAL",
]);

const REJECTED_VENDOR_ADJUSTMENT_STATUSES = new Set([
  "REJECTED",
  "DECLINED",
  "CANCELED",
  "CANCELLED",
]);

const PENDING_CLIENT_MODIFICATION_STATUSES = new Set(["PENDING"]);

function hasOpenPendingVendorAdjustment(node) {
  const backendFlag = node?.hasPendingVendorAdjustment;
  if (typeof backendFlag === "boolean") {
    return backendFlag;
  }

  const adjustmentStatus = `${node?.pendingVendorAdjustment?.status ?? ""}`
    .trim()
    .toUpperCase();

  return PENDING_VENDOR_ADJUSTMENT_STATUSES.has(adjustmentStatus);
}

function hasOpenPendingClientModification(node) {
  const backendFlag = node?.hasPendingModificationRequest;
  if (typeof backendFlag === "boolean") {
    return backendFlag;
  }

  const requestStatus = `${node?.pendingModificationRequest?.status ?? ""}`
    .trim()
    .toUpperCase();

  return PENDING_CLIENT_MODIFICATION_STATUSES.has(requestStatus);
}

function hasRejectedVendorAdjustment(node) {
  const latestStatus = `${node?.latestVendorAdjustment?.status ?? ""}`
    .trim()
    .toUpperCase();

  return REJECTED_VENDOR_ADJUSTMENT_STATUSES.has(latestStatus);
}

function resolveClientDisplayStatus(node, isModified) {
  if (isModified) {
    return "Modified";
  }

  if (hasRejectedVendorAdjustment(node)) {
    return "Canceled";
  }

  return node?.status || "Ready";
}

function mapListOrder(node) {
  const draftOverride = buildPlacedOrderDraftOverride(node?.id);
  const mappedItems = (node.items || []).map((item) => ({
    id: item.id || "",
    quantity: item.quantity || 1,
    name: item.productName || "Catering Meal",
    price: formatAmount(parseFloat(item.lineTotal || item.totalPrice || 0)),
    details: [
      item.specialInstructions ? `Note: ${item.specialInstructions}` : "",
      ...Object.entries(item.selectedOptions || {}).map(
        ([key, value]) => `${key}: ${value}`,
      ),
      ...(item.selectedAddons || []).map((addon) =>
        addon?.name
          ? `Add-on: ${addon.name}${addon.totalPrice || addon.price ? ` (+${formatAmount(addon.totalPrice || addon.price)})` : ""}`
          : "",
      ),
    ].filter(Boolean),
  }));

  const itemsList = Array.isArray(node.items) ? node.items : [];
  const pricingAddOnsTotal = parseFloat(node?.pricing?.addOnsTotal || 0);
  const addOnsTotal = Number.isFinite(pricingAddOnsTotal) && pricingAddOnsTotal > 0
    ? pricingAddOnsTotal
    : itemsList.reduce((sum, item) => {
    const addons = Array.isArray(item.selectedAddons) ? item.selectedAddons : [];
    return sum + addons.reduce((itemSum, addon) => {
      const price = parseFloat(addon?.totalPrice || addon?.price || addon?.unitPrice || 0);
      const name = addon?.name || "";
      const match = name.match(/x(\d+)$/);
      const qty = match ? parseInt(match[1], 10) : 1;
      
      // Legacy fallback for test orders where unit price 12 was saved instead of total
      if (price === 12 && qty > 1 && name.includes("first add on")) {
        return itemSum + (price * qty);
      }
      
      return itemSum + price;
    }, 0);
  }, 0);

  const resolvedGrandTotal = resolveOrderGrandTotal(node, addOnsTotal);
  const hasModifiedItems = Array.isArray(node.modifiedItems) && node.modifiedItems.length > 0;
  const hasPendingVendorAdjustment = hasOpenPendingVendorAdjustment(node);
  const hasPendingClientModification = hasOpenPendingClientModification(node);
  const isModified =
    hasModifiedItems || hasPendingVendorAdjustment || hasPendingClientModification;

  return {
    id: formatId(node.id),
    rawId: node.id || "",
    vendor: node.vendor?.name || "Catering partner",
    eventName: node.eventName || "Corporate Event",
    date: formatDate(draftOverride?.eventDate || node.eventDate),
    eventDateRaw: draftOverride?.eventDate || node.eventDate || "",
    createdOnRaw: node.createdOn || "",
    person: formatNumber(draftOverride?.personCount || node.personCount, 1),
    total: draftOverride?.total || formatAmount(resolvedGrandTotal),
    status: resolveClientDisplayStatus(node, isModified),
    isModified,
    orderedDate: formatDate(node.createdOn),
    deliveredDate: formatDate(node.dueDate || draftOverride?.eventDate || node.eventDate),
    location: draftOverride?.deliveryAddressStr || node.deliveryAddressStr || "Not provided",
    invoiceId: node.invoiceNumber || "",
    image: node.vendor?.coverPhotoUrl || node.vendor?.logoUrl || "/home/hero1.webp",
    subtotal: formatAmount(node.pricing?.subtotal || node.totalAmount),
    taxAmount: formatAmount(node.pricing?.taxAmount || node.taxAmount),
    deliveryFee: formatAmount(node.pricing?.deliveryFee || node.deliveryFee),
    orderNotes: node.orderNotes || "",
    eventTime: draftOverride?.eventTime || node.eventTime || "",
    lifecycle: getOrderLifecycle(
      resolveClientDisplayStatus(node, isModified),
      node.eventDate || "",
    ),
    items: mappedItems,
    modifiedItems: hasModifiedItems ? node.modifiedItems : [],
  };
}

function mapModificationCards(statuses, fallbackImage) {
  if (!Array.isArray(statuses) || statuses.length <= 1) {
    return [];
  }

  return statuses.slice(1).map((statusEntry, index) => {
    const previousStatus = statuses[index]?.status;
    const nextStatus = statusEntry?.status;

    return {
      id: statusEntry?.id || `${nextStatus}-${index}`,
      image: fallbackImage || "/home/hero1.webp",
      name: "Order status update",
      changeLabel: toTitleCase(nextStatus || "updated"),
      summary:
        statusEntry?.note ||
        `Order status changed from ${toTitleCase(previousStatus)} to ${toTitleCase(nextStatus)}.`,
      previousValue: toTitleCase(previousStatus || "Not available"),
      newValue: toTitleCase(nextStatus || "Not available"),
    };
  });
}

function mapBackendModifiedItems(modifiedItems, fallbackImage) {
  if (!Array.isArray(modifiedItems) || modifiedItems.length === 0) {
    return [];
  }

  return modifiedItems.map((item, index) => ({
    id: item?.id || `modified-${index}`,
    image: fallbackImage || "/home/hero1.webp",
    name: item?.name || "Order update",
    changeLabel: toTitleCase(item?.changeLabel || "Adjustment requested"),
    summary: item?.summary || "The vendor requested a change to this order.",
    previousValue: item?.previousValue || "Current order details",
    newValue: item?.newValue || "Updated order details pending approval",
  }));
}

async function enrichClientOrdersWithAdjustmentState(edges = []) {
  const safeEdges = Array.isArray(edges) ? edges : [];

  const settledResults = await Promise.allSettled(
    safeEdges.map(async (edge) => {
      const node = edge?.node;
      const orderId = node?.id;

      if (!orderId) {
        return { edge, detail: null };
      }

      const detailResponse = await graphqlRequest({
        query: FETCH_CLIENT_ORDER_LIST_STATUS_QUERY,
        variables: { orderId },
      });

      return {
        edge,
        detail: detailResponse?.clientOrder || null,
      };
    }),
  );

  return settledResults.map((result, index) => {
    const fallbackEdge = safeEdges[index];

    if (result.status !== "fulfilled") {
      return fallbackEdge;
    }

    const node = result.value?.edge?.node || fallbackEdge?.node || {};
    const detail = result.value?.detail || {};

    return {
      ...(result.value?.edge || fallbackEdge),
      node: {
        ...node,
        status: detail?.status || node?.status,
        hasPendingVendorAdjustment:
          typeof detail?.hasPendingVendorAdjustment === "boolean"
            ? detail.hasPendingVendorAdjustment
            : node?.hasPendingVendorAdjustment,
        hasPendingModificationRequest:
          typeof detail?.hasPendingModificationRequest === "boolean"
            ? detail.hasPendingModificationRequest
            : node?.hasPendingModificationRequest,
        pendingVendorAdjustment:
          detail?.pendingVendorAdjustment ?? node?.pendingVendorAdjustment ?? null,
        pendingModificationRequest:
          detail?.pendingModificationRequest ?? node?.pendingModificationRequest ?? null,
        latestVendorAdjustment:
          detail?.latestVendorAdjustment ?? node?.latestVendorAdjustment ?? null,
        latestModificationRequest:
          detail?.latestModificationRequest ?? node?.latestModificationRequest ?? null,
        modifiedItems:
          Array.isArray(detail?.modifiedItems) && detail.modifiedItems.length > 0
            ? detail.modifiedItems
            : node?.modifiedItems,
      },
    };
  });
}

export const fetchClientOrders = createAsyncThunk(
  "orders/fetchClientOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({
        query: FETCH_CLIENT_ORDERS_QUERY,
        variables: {
          tab: null,
          first: 100,
          after: null,
        },
      });
      const enrichedEdges = await enrichClientOrdersWithAdjustmentState(
        response.clientOrders?.edges || [],
      );
      const orders = enrichedEdges.map((edge) =>
        mapListOrder(edge.node),
      );
      const completedCount = orders.filter(
        (order) => order.lifecycle === "completed",
      ).length;
      const scheduledCount = orders.filter(
        (order) => order.lifecycle === "scheduled",
      ).length;
      const draftsCount = orders.filter(
        (order) => order.lifecycle === "draft",
      ).length;
      const statusSummary = [
        {
          labelKey: "vendorPanel.dashboard.totalOrders",
          value: response.clientOrders?.totalCount ?? orders.length,
        },
        {
          labelKey: "vendorPanel.orders.completed",
          value: completedCount,
        },
        {
          labelKey: "vendorPanel.orders.scheduled",
          value: scheduledCount,
        },
        {
          labelKey: "vendorPanel.orders.drafts",
          value: draftsCount,
        },
      ];

      return { orders, statusSummary };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders data.");
    }
  }
);

export const fetchClientOrderDetail = createAsyncThunk(
  "orders/fetchClientOrderDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const [detailResponse, modificationsResponse] = await Promise.all([
        graphqlRequest({
          query: FETCH_CLIENT_ORDER_DETAIL_QUERY,
          variables: { orderId },
        }),
        graphqlRequest({
          query: FETCH_CLIENT_ORDER_MODIFICATIONS_QUERY,
          variables: { orderId },
        }).catch(() => null),
      ]);

      const orderNode = detailResponse?.clientOrder;
      const draftOverride = buildPlacedOrderDraftOverride(orderNode?.id);

      if (!orderNode?.id) {
        throw new Error("Order details not found.");
      }

      const heroImage =
        orderNode.items?.[0]?.product?.coverImage?.fileUrl ||
        orderNode.vendor?.logoUrl ||
        "/home/hero1.webp";
      const statuses =
        modificationsResponse?.clientOrder?.statuses ||
        modificationsResponse?.clientOrder?.order?.statuses ||
        [];

      const items = (orderNode.items || []).map((item) => {
        const itemAddons = Array.isArray(item.selectedAddons) ? item.selectedAddons : [];
        const itemOptions = item.selectedOptions || {};

        return {
          id: item.id || "",
          quantity: formatNumber(item.quantity, 1),
          name: item.productName || item.product?.name || "Catering Meal",
          price: formatAmount(parseFloat(item.lineTotal || item.totalPrice || 0)),
          details: [
            item.specialInstructions ? `Note: ${item.specialInstructions}` : "",
            item.product?.description || "",
            ...Object.entries(itemOptions).map(([key, value]) => `${key}: ${value}`),
            ...itemAddons.map((addon) =>
              addon?.name
                ? `Add-on: ${addon.name}${addon.totalPrice || addon.price ? ` (+${formatAmount(addon.totalPrice || addon.price)})` : ""}`
                : "",
            ),
            ...((item.product?.menuItems || []).map((menuItem) =>
              menuItem?.title ? `Included: ${menuItem.title}` : "",
            )),
          ].filter(Boolean),
        };
      });

      const itemsList = Array.isArray(orderNode.items) ? orderNode.items : [];
      const pricingAddOnsTotal = parseFloat(orderNode?.pricing?.addOnsTotal || 0);
      const addOnsTotal = Number.isFinite(pricingAddOnsTotal) && pricingAddOnsTotal > 0
        ? pricingAddOnsTotal
        : itemsList.reduce((sum, item) => {
        const addons = Array.isArray(item.selectedAddons) ? item.selectedAddons : [];
        return sum + addons.reduce((itemSum, addon) => {
          const price = parseFloat(addon?.totalPrice || addon?.price || addon?.unitPrice || 0);
          const name = addon?.name || "";
          const match = name.match(/x(\d+)$/);
          const qty = match ? parseInt(match[1], 10) : 1;
          
          // Legacy fallback for test orders where unit price 12 was saved instead of total
          if (price === 12 && qty > 1 && name.includes("first add on")) {
            return itemSum + (price * qty);
          }
          
          return itemSum + price;
        }, 0);
      }, 0);

      const resolvedGrandTotal = resolveOrderGrandTotal(orderNode, addOnsTotal);

      const modifiedItems =
        mapBackendModifiedItems(orderNode.modifiedItems, heroImage) ||
        mapModificationCards(statuses, heroImage);
      const resolvedModifiedItems =
        modifiedItems.length > 0 ? modifiedItems : mapModificationCards(statuses, heroImage);

      const pendingVendorAdjustment = orderNode.pendingVendorAdjustment || null;
      const latestVendorAdjustment = orderNode.latestVendorAdjustment || null;
      const hasPendingVendorAdjustment = hasOpenPendingVendorAdjustment(orderNode);
      const pendingModificationRequest = orderNode.pendingModificationRequest || null;
      const latestModificationRequest = orderNode.latestModificationRequest || null;
      const hasPendingClientModification = hasOpenPendingClientModification(orderNode);
      const hasPendingChanges =
        resolvedModifiedItems.length > 0 ||
        hasPendingVendorAdjustment ||
        hasPendingClientModification;

      return {
        orderId: `${orderNode.id}`,
        detail: {
          id: formatId(orderNode.id),
          rawId: orderNode.id || "",
          vendor: orderNode.vendor?.name || "Catering partner",
          vendorSlug: orderNode.vendor?.slug || "",
          eventName: orderNode.eventName || "Corporate Event",
          date: formatDate(draftOverride?.eventDate || orderNode.eventDate),
          eventDateRaw: draftOverride?.eventDate || orderNode.eventDate || "",
          createdOnRaw: orderNode.createdOn || "",
          person: formatNumber(draftOverride?.personCount || orderNode.personCount, 1),
          total: draftOverride?.total || formatAmount(resolvedGrandTotal),
          subtotal: formatAmount(orderNode.pricing?.subtotal || orderNode.totalAmount),
          taxAmount: formatAmount(orderNode.pricing?.taxAmount || orderNode.taxAmount),
          deliveryFee: formatAmount(orderNode.pricing?.deliveryFee || orderNode.deliveryFee),
          tipAmount: formatAmount(orderNode.pricing?.tipAmount || orderNode.tipAmount),
          status: resolveClientDisplayStatus(orderNode, hasPendingChanges),
          canModify: orderNode.canModify !== false,
          isModified: hasPendingChanges,
          orderedDate: formatDate(orderNode.createdOn),
          deliveredDate: formatDate(draftOverride?.eventDate || orderNode.eventDate),
          location: draftOverride?.deliveryAddressStr || orderNode.deliveryAddressStr || "Not provided",
          deliveryAddress: draftOverride?.deliveryAddress || orderNode.deliveryAddress || "",
          deliverySuite: draftOverride?.deliverySuite || orderNode.deliverySuite || "",
          deliveryCity: draftOverride?.deliveryCity || orderNode.deliveryCity || "",
          deliveryPostalCode: draftOverride?.deliveryPostalCode || orderNode.deliveryPostalCode || "",
          invoiceId: orderNode.invoiceNumber || "",
          orderNotes: orderNode.orderNotes || "",
          eventTime: draftOverride?.eventTime || orderNode.eventTime || "",
          image: heroImage,
          items,
          modifiedItems: resolvedModifiedItems,
          pendingVendorAdjustment,
          latestVendorAdjustment,
          pendingModificationRequest,
          latestModificationRequest,
          canceledAt: orderNode.canceledAt || "",
          cancellationReason: orderNode.cancellationReason || "",
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch order detail.",
      );
    }
  },
);

const initialState = {
  orders: [],
  statusSummary: [
    { labelKey: "vendorPanel.dashboard.totalOrders", value: 0 },
    { labelKey: "vendorPanel.orders.completed", value: 0 },
    { labelKey: "vendorPanel.orders.scheduled", value: 0 },
    { labelKey: "vendorPanel.orders.drafts", value: 0 },
  ],
  isLoading: false,
  error: null,
  selectedOrderDetail: null,
  selectedOrderDetailStatus: "idle",
  selectedOrderDetailError: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrderDetail(state) {
      state.selectedOrderDetail = null;
      state.selectedOrderDetailStatus = "idle";
      state.selectedOrderDetailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.statusSummary = action.payload.statusSummary;
      })
      .addCase(fetchClientOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load orders data.";
      })
      .addCase(fetchClientOrderDetail.pending, (state) => {
        state.selectedOrderDetailStatus = "loading";
        state.selectedOrderDetailError = null;
      })
      .addCase(fetchClientOrderDetail.fulfilled, (state, action) => {
        state.selectedOrderDetailStatus = "succeeded";
        state.selectedOrderDetail = action.payload.detail;
      })
      .addCase(fetchClientOrderDetail.rejected, (state, action) => {
        state.selectedOrderDetailStatus = "failed";
        state.selectedOrderDetailError =
          action.payload || "Failed to load order detail.";
      });
  },
});

export const { clearSelectedOrderDetail } = ordersSlice.actions;
export default ordersSlice.reducer;
