import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";

const FETCH_INVOICES_QUERY = `
  query FetchInvoices {
    invoiceSummary {
      totalInvoices
      paidInvoices
      unpaidInvoices
      overdueInvoices
      totalSpent
      thisMonthSpent
      pendingAmount
      overdueAmount
    }
    orderPayments {
      edges {
        node {
          id
          createdOn
          status
          paidAmount
          paymentType
          note
          orders {
            edges {
              node {
                id
                clientOrder {
                  edges {
                    node {
                      id
                      eventName
                      eventDate
                      dueDate
                      totalAmount
                      taxAmount
                      deliveryFee
                      tipAmount
                      grandTotal
                      vendor {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
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

const mapPaymentNode = (node) => {
  const orderNode = node.orders?.edges?.[0]?.node;
  const clientOrderNode = orderNode?.clientOrder?.edges?.[0]?.node;

  const eventName = clientOrderNode?.eventName || node.note || "Catering Event";
  const vendorName = clientOrderNode?.vendor?.name || "Lunsjavtale Catering";
  const deliveredDateRaw = clientOrderNode?.eventDate || node.createdOn;
  const dueDateRaw = clientOrderNode?.dueDate || deliveredDateRaw;
  const grandTotal = node.paidAmount || clientOrderNode?.grandTotal || 0;

  const subtotal = clientOrderNode?.totalAmount || 0;
  const tax = clientOrderNode?.taxAmount || 0;
  const deliveryFee = clientOrderNode?.deliveryFee || 0;
  const tip = clientOrderNode?.tipAmount || 0;

  const statusRaw = node.status || "Pending";
  const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase();

  return {
    id: formatId(node.id),
    vendor: vendorName,
    event: eventName,
    deliveredOn: formatDate(deliveredDateRaw),
    deliveredAt: deliveredDateRaw ? deliveredDateRaw.split("T")[0] : "",
    dueOn: formatDate(dueDateRaw),
    dueAt: dueDateRaw ? dueDateRaw.split("T")[0] : "",
    amount: formatAmount(grandTotal),
    status: status,
    subtotal: formatAmount(subtotal),
    tax: formatAmount(tax),
    deliveryFee: formatAmount(deliveryFee),
    tip: formatAmount(tip),
    rawAmount: parseFloat(grandTotal),
  };
};

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({ query: FETCH_INVOICES_QUERY });
      
      const summary = response.invoiceSummary || {};
      const overview = [
        { label: "Total Invoices", value: summary.totalInvoices || 0 },
        { label: "Paid Invoices", value: summary.paidInvoices || 0 },
        { label: "Unpaid Invoices", value: summary.unpaidInvoices || 0 },
        { label: "Overdue Invoices", value: summary.overdueInvoices || 0 },
      ];

      const totals = [
        { label: "Total Spent", value: formatAmount(summary.totalSpent) },
        { label: "This Month", value: formatAmount(summary.thisMonthSpent) },
        { label: "Pending Amount", value: formatAmount(summary.pendingAmount) },
        { label: "Overdue Amount", value: formatAmount(summary.overdueAmount) },
      ];

      const records = (response.orderPayments?.edges || []).map((edge) =>
        mapPaymentNode(edge.node)
      );

      return { overview, totals, records };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch invoices data.");
    }
  }
);

const initialState = {
  records: [],
  overview: [
    { label: "Total Invoices", value: 0 },
    { label: "Paid Invoices", value: 0 },
    { label: "Unpaid Invoices", value: 0 },
    { label: "Overdue Invoices", value: 0 },
  ],
  totals: [
    { label: "Total Spent", value: "NOK 0.00" },
    { label: "This Month", value: "NOK 0.00" },
    { label: "Pending Amount", value: "NOK 0.00" },
    { label: "Overdue Amount", value: "NOK 0.00" },
  ],
  isLoading: false,
  error: null,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload.records;
        state.overview = action.payload.overview;
        state.totals = action.payload.totals;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load invoices data.";
      });
  },
});

export default invoicesSlice.reducer;
