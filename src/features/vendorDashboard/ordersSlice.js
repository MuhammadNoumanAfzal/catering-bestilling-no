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

const formatId = (id) => {
  if (!id) return "";
  const idStr = String(id);
  return idStr.startsWith("#") ? idStr : `#${idStr}`;
};

export const fetchClientOrders = createAsyncThunk(
  "orders/fetchClientOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({ query: FETCH_CLIENT_ORDERS_QUERY });
      
      const orders = (response.clientOrders?.edges || []).map((edge) => {
        const node = edge.node;
        
        const mappedItems = (node.items || []).map((item) => ({
          quantity: item.quantity || 1,
          name: item.productName || "Catering Meal",
          price: formatAmount(item.totalPrice),
          details: ["Includes setup and labeled packaging", "Prepared with premium seasonal ingredients"],
        }));

        return {
          id: formatId(node.id),
          vendor: node.vendor?.companyName || "Nordic Gourmet Catering",
          eventName: node.eventName || "Corporate Event",
          date: formatDate(node.eventDate),
          person: node.personCount || 1,
          total: formatAmount(node.grandTotal),
          status: node.status || "Ready",
          isModified: false,
          orderedDate: formatDate(node.createdOn),
          deliveredDate: formatDate(node.eventDate),
          location: node.deliveryAddressStr || "Main Office",
          invoiceId: `#INV-${node.id || "001"}`,
          items: mappedItems.length > 0 ? mappedItems : undefined,
        };
      });

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
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
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
      });
  },
});

export default ordersSlice.reducer;
