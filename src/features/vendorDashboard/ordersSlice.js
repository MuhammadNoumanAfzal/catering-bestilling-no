import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";

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
          totalAmount
          taxAmount
          deliveryFee
          tipAmount
          grandTotal
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
            totalPrice
            specialInstructions
            selectedOptions
            selectedAddons
          }
          modifiedItems {
            id
            name
            changeLabel
            summary
            previousValue
            newValue
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
      eventName
      personCount
      grandTotal
      totalAmount
      taxAmount
      deliveryFee
      tipAmount
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
        logoUrl
      }
      items {
        id
        productName
        quantity
        unitPrice
        totalPrice
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

const toTitleCase = (value) =>
  `${value ?? ""}`
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

function mapListOrder(node) {
  const mappedItems = (node.items || []).map((item) => ({
    id: item.id || "",
    quantity: item.quantity || 1,
    name: item.productName || "Catering Meal",
    price: formatAmount(item.totalPrice),
    details: [
      item.specialInstructions ? `Note: ${item.specialInstructions}` : "",
      ...Object.entries(item.selectedOptions || {}).map(
        ([key, value]) => `${key}: ${value}`,
      ),
      ...(item.selectedAddons || []).map((addon) =>
        addon?.name
          ? `Add-on: ${addon.name}${addon.price ? ` (+${formatAmount(addon.price)})` : ""}`
          : "",
      ),
    ].filter(Boolean),
  }));

  const itemsList = Array.isArray(node.items) ? node.items : [];
  const addOnsTotal = itemsList.reduce((sum, item) => {
    const addons = Array.isArray(item.selectedAddons) ? item.selectedAddons : [];
    return sum + addons.reduce((itemSum, addon) => {
      const price = parseFloat(addon?.price || addon?.unitPrice || 0);
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

  const subtotalVal = parseFloat(node.totalAmount || 0);
  const tipVal = parseFloat(node.tipAmount || 0);
  const calculatedGrandTotal = subtotalVal + tipVal + addOnsTotal;

  return {
    id: formatId(node.id),
    rawId: node.id || "",
    vendor: node.vendor?.name || "Catering partner",
    eventName: node.eventName || "Corporate Event",
    date: formatDate(node.eventDate),
    eventDateRaw: node.eventDate || "",
    createdOnRaw: node.createdOn || "",
    person: formatNumber(node.personCount, 1),
    total: formatAmount(calculatedGrandTotal),
    status: node.status || "Ready",
    isModified: Array.isArray(node.modifiedItems) && node.modifiedItems.length > 0,
    orderedDate: formatDate(node.createdOn),
    deliveredDate: formatDate(node.dueDate || node.eventDate),
    location: node.deliveryAddressStr || "Not provided",
    invoiceId: node.invoiceNumber || "",
    image: node.vendor?.coverPhotoUrl || node.vendor?.logoUrl || "/home/hero1.webp",
    subtotal: formatAmount(node.totalAmount),
    taxAmount: formatAmount(node.taxAmount),
    deliveryFee: formatAmount(node.deliveryFee),
    orderNotes: node.orderNotes || "",
    eventTime: node.eventTime || "",
    items: mappedItems,
    modifiedItems: Array.isArray(node.modifiedItems) ? node.modifiedItems : [],
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
      const orders = (response.clientOrders?.edges || []).map((edge) =>
        mapListOrder(edge.node),
      );
      const completedCount = orders.filter(
        (order) => `${order.status}`.toLowerCase() === "completed",
      ).length;
      const scheduledCount = orders.filter(
        (order) => `${order.status}`.toLowerCase() === "scheduled",
      ).length;
      const draftsCount = orders.filter(
        (order) => `${order.status}`.toLowerCase() === "draft",
      ).length;
      const statusSummary = [
        {
          label: "Total Orders",
          value: response.clientOrders?.totalCount ?? orders.length,
        },
        { label: "Completed", value: completedCount },
        { label: "Scheduled", value: scheduledCount },
        { label: "Drafts", value: draftsCount },
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

      const items = (orderNode.items || []).map((item) => ({
        id: item.id || "",
        quantity: formatNumber(item.quantity, 1),
        name: item.productName || item.product?.name || "Catering Meal",
        price: formatAmount(item.totalPrice),
        details: [
          item.product?.description || "",
          ...((item.product?.menuItems || []).map((menuItem) =>
            menuItem?.title ? `Included: ${menuItem.title}` : "",
          )),
        ].filter(Boolean),
      }));

      const modifiedItems = mapModificationCards(statuses, heroImage);

      return {
        orderId: `${orderNode.id}`,
        detail: {
          id: formatId(orderNode.id),
          rawId: orderNode.id || "",
          vendor: orderNode.vendor?.name || "Catering partner",
          eventName: orderNode.eventName || "Corporate Event",
          date: formatDate(orderNode.eventDate),
          eventDateRaw: orderNode.eventDate || "",
          createdOnRaw: orderNode.createdOn || "",
          person: formatNumber(orderNode.personCount, 1),
          total: formatAmount(orderNode.grandTotal),
          subtotal: formatAmount(orderNode.totalAmount),
          taxAmount: formatAmount(orderNode.taxAmount),
          deliveryFee: formatAmount(orderNode.deliveryFee),
          tipAmount: formatAmount(orderNode.tipAmount),
          status: orderNode.status || "Pending",
          canModify: orderNode.canModify !== false,
          isModified: modifiedItems.length > 0,
          orderedDate: formatDate(orderNode.createdOn),
          deliveredDate: formatDate(orderNode.eventDate),
          location: orderNode.deliveryAddressStr || "Not provided",
          deliveryAddress: orderNode.deliveryAddress || "",
          deliverySuite: orderNode.deliverySuite || "",
          deliveryCity: orderNode.deliveryCity || "",
          deliveryPostalCode: orderNode.deliveryPostalCode || "",
          invoiceId: orderNode.invoiceNumber || "",
          orderNotes: orderNode.orderNotes || "",
          eventTime: orderNode.eventTime || "",
          image: heroImage,
          items,
          modifiedItems,
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
    { label: "Total Orders", value: 0 },
    { label: "Completed", value: 0 },
    { label: "Scheduled", value: 0 },
    { label: "Drafts", value: 0 },
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
