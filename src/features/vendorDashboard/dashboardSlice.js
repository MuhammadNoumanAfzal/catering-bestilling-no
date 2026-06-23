import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";

const FETCH_CLIENT_DASHBOARD_QUERY = `
  query FetchClientDashboard {
    clientDashboard {
      totalOrders
      pendingInvoices
      recentOrders {
        id
        eventName
        eventDate
        status
        grandTotal
      }
      recentInvoices {
        id
        eventName
        eventDate
        status
        grandTotal
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

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({ query: FETCH_CLIENT_DASHBOARD_QUERY });
      const data = response.clientDashboard;
      
      const recentOrders = (data.recentOrders || []).map((order) => ({
        id: formatId(order.id),
        eventName: order.eventName || "Lunch Order",
        date: formatDate(order.eventDate),
        status: order.status || "Pending",
        amount: formatAmount(order.grandTotal),
      }));

      const recentInvoices = (data.recentInvoices || []).map((invoice) => ({
        id: formatId(invoice.id),
        eventName: invoice.eventName || "Corporate Invoice",
        date: formatDate(invoice.eventDate),
        status: invoice.status || "Pending",
        amount: formatAmount(invoice.grandTotal),
      }));

      return {
        totalOrders: data.totalOrders || 0,
        pendingInvoices: data.pendingInvoices || 0,
        recentOrders,
        recentInvoices,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch dashboard data.");
    }
  }
);

const initialState = {
  totalOrders: 0,
  pendingInvoices: 0,
  recentOrders: [],
  recentInvoices: [],
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalOrders = action.payload.totalOrders;
        state.pendingInvoices = action.payload.pendingInvoices;
        state.recentOrders = action.payload.recentOrders;
        state.recentInvoices = action.payload.recentInvoices;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load dashboard data.";
      });
  },
});

export default dashboardSlice.reducer;
