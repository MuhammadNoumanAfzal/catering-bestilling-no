import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";

const FETCH_CLIENT_ORDERS_QUERY = `
  query FetchClientOrders {
    orderQuickSummary {
      totalOrders
      completed
      scheduled
      drafts
    }
    clientOrders {
      edges {
        node {
          id
          eventName
          eventDate
          createdOn
          deliveryAddressStr
          personCount
          grandTotal
          status
          vendor {
            companyName
          }
          items {
            id
            quantity
            productName
            totalPrice
          }
        }
      }
    }
  }
`;

const FETCH_CLIENT_ORDER_DETAIL_QUERY = `
  query GetClientOrderDetail($orderId: ID!) {
    clientOrder(id: $orderId) {
      id
      status
      eventName
      personCount
      grandTotal
      totalAmount
      taxAmount
      deliveryFee
      tipAmount
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
    details: [],
  }));

  return {
    id: formatId(node.id),
    rawId: node.id || "",
    vendor: node.vendor?.companyName || "Catering partner",
    eventName: node.eventName || "Corporate Event",
    date: formatDate(node.eventDate),
    eventDateRaw: node.eventDate || "",
    createdOnRaw: node.createdOn || "",
    person: formatNumber(node.personCount, 1),
    total: formatAmount(node.grandTotal),
    status: node.status || "Ready",
    isModified: false,
    orderedDate: formatDate(node.createdOn),
    deliveredDate: formatDate(node.eventDate),
    location: node.deliveryAddressStr || "Not provided",
    invoiceId: node.id ? `#INV-${node.id}` : "",
    items: mappedItems,
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
      const response = await graphqlRequest({ query: FETCH_CLIENT_ORDERS_QUERY });
      
      const orders = (response.clientOrders?.edges || []).map((edge) =>
        mapListOrder(edge.node),
      );

      const summary = response.orderQuickSummary || { totalOrders: 0, completed: 0, scheduled: 0, drafts: 0 };
      const statusSummary = [
        { label: "Total Orders", value: summary.totalOrders },
        { label: "Completed", value: summary.completed },
        { label: "Scheduled", value: summary.scheduled },
        { label: "Drafts", value: summary.drafts },
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
          isModified: modifiedItems.length > 0,
          orderedDate: formatDate(orderNode.createdOn),
          deliveredDate: formatDate(orderNode.eventDate),
          location: orderNode.deliveryAddressStr || "Not provided",
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
