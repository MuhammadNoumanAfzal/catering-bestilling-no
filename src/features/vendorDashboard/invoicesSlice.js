import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";

const FETCH_INVOICES_QUERY = `
  query FetchInvoices(
    $status: String
    $search: String
    $dateFrom: Date
    $dateTo: Date
    $first: Int
    $after: String
  ) {
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
    clientOrders(
      status: $status
      search: $search
      dateFrom: $dateFrom
      dateTo: $dateTo
      first: $first
      after: $after
    ) {
      totalCount
      edges {
        cursor
        node {
          id
          invoiceNumber
          status
          issuedOn
          dueDate
          paidOn
          subtotal
          taxAmount
          deliveryFee
          tipAmount
          totalAmount
          paidAmount
          dueAmount
          currency
          pdfUrl
          vendor {
            id
            name
            slug
            logoUrl
          }
          order {
            id
            eventName
            dueDate
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

const GET_INVOICE_DETAIL_QUERY = `
  query GetInvoiceDetail($orderId: ID!) {
    clientOrder(id: $orderId) {
      id
      invoiceNumber
      status
      issuedOn
      dueDate
      paidOn
      currency
      subtotal
      taxAmount
      deliveryFee
      tipAmount
      totalAmount
      paidAmount
      dueAmount
      pdfUrl
      paymentType
      transactionReference
      note
      vendor {
        id
        name
        slug
        logoUrl
        companyName
      }
      order {
        id
        eventName
        dueDate
        guestCount
        deliveryDate
      }
      lineItems {
        id
        label
        description
        quantity
        unitPrice
        totalPrice
      }
    }
  }
`;

const GET_INVOICE_DOWNLOAD_URL_QUERY = `
  query GetInvoiceDownloadUrl($invoiceId: ID!) {
    invoiceDownloadUrl(invoiceId: $invoiceId) {
      url
      expiresAt
    }
  }
`;

function formatDate(value) {
  if (!value) {
    return "";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return value;
  }
}

function formatMoney(value, currency = "NOK") {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return `${currency} 0.00`;
  }

  try {
    return new Intl.NumberFormat("en-NO", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function toNumber(value) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function titleizeStatus(value) {
  return `${value ?? ""}`
    .replace(/^payment[-_]/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";
}

function mapInvoiceStatus(status) {
  const normalized = `${status ?? ""}`.trim().toLowerCase();

  if (normalized === "payment-paid" || normalized === "paid") {
    return { raw: status || "payment-paid", key: "paid", label: "Paid" };
  }

  if (
    normalized === "payment-pending" ||
    normalized === "pending" ||
    normalized === "unpaid"
  ) {
    return {
      raw: status || "payment-pending",
      key: "pending",
      label: "Pending",
    };
  }

  if (normalized === "payment-overdue" || normalized === "overdue") {
    return {
      raw: status || "payment-overdue",
      key: "overdue",
      label: "Overdue",
    };
  }

  return {
    raw: status || "",
    key: normalized || "unknown",
    label: titleizeStatus(status),
  };
}

function buildOverview(summary = {}) {
  return [
    { label: "Total Invoices", value: summary.totalInvoices ?? 0 },
    { label: "Paid Invoices", value: summary.paidInvoices ?? 0 },
    { label: "Unpaid Invoices", value: summary.unpaidInvoices ?? 0 },
    { label: "Overdue Invoices", value: summary.overdueInvoices ?? 0 },
  ];
}

function buildTotals(summary = {}) {
  return [
    { label: "Total Spent", value: formatMoney(summary.totalSpent) },
    { label: "This Month", value: formatMoney(summary.thisMonthSpent) },
    { label: "Pending Amount", value: formatMoney(summary.pendingAmount) },
    { label: "Overdue Amount", value: formatMoney(summary.overdueAmount) },
  ];
}

function mapInvoiceListNode(node) {
  const total = parseFloat(node.totalAmount || 0);
  const paid = parseFloat(node.paidAmount || 0);
  
  let calculatedStatus = "pending";
  if (paid >= total && total > 0) {
    calculatedStatus = "paid";
  } else {
    const dueDateObj = new Date(node.dueDate);
    const today = new Date();
    const isPastDue = !isNaN(dueDateObj.getTime()) && dueDateObj.setHours(0,0,0,0) < today.setHours(0,0,0,0);
    if (isPastDue) {
      calculatedStatus = "overdue";
    } else {
      calculatedStatus = "pending";
    }
  }

  const status = mapInvoiceStatus(calculatedStatus);
  const currency = node.currency || "NOK";
  const orderId = node.id || node.order?.id || "";

  return {
    id: orderId,
    orderId,
    invoiceNumber: node.invoiceNumber || `Invoice ${orderId}`,
    invoiceNumberShort: node.invoiceNumber || orderId,
    status: status.label,
    statusKey: status.key,
    statusRaw: status.raw,
    issuedOn: formatDate(node.issuedOn),
    issuedOnRaw: node.issuedOn || "",
    dueOn: formatDate(node.dueDate),
    dueDateRaw: node.dueDate || "",
    paidOn: formatDate(node.paidOn),
    paidOnRaw: node.paidOn || "",
    subtotal: formatMoney(node.subtotal, currency),
    tax: formatMoney(node.taxAmount, currency),
    deliveryFee: formatMoney(node.deliveryFee, currency),
    tip: formatMoney(node.tipAmount, currency),
    amount: formatMoney(node.totalAmount, currency),
    paidAmount: formatMoney(node.paidAmount, currency),
    dueAmount: formatMoney(node.dueAmount, currency),
    amountRaw: toNumber(node.totalAmount),
    currency,
    pdfUrl: node.pdfUrl || "",
    vendor: node.vendor?.name || "Catering partner",
    vendorSlug: node.vendor?.slug || "",
    vendorLogoUrl: node.vendor?.logoUrl || "",
    event: node.order?.eventName || "Event",
    eventDate: formatDate(node.order?.dueDate),
    eventDateRaw: node.order?.dueDate || "",
  };
}

function mapInvoiceDetail(node) {
  const total = parseFloat(node.totalAmount || 0);
  const paid = parseFloat(node.paidAmount || 0);
  
  let calculatedStatus = "pending";
  if (paid >= total && total > 0) {
    calculatedStatus = "paid";
  } else {
    const dueDateObj = new Date(node.dueDate);
    const today = new Date();
    const isPastDue = !isNaN(dueDateObj.getTime()) && dueDateObj.setHours(0,0,0,0) < today.setHours(0,0,0,0);
    if (isPastDue) {
      calculatedStatus = "overdue";
    } else {
      calculatedStatus = "pending";
    }
  }

  const status = mapInvoiceStatus(calculatedStatus);
  const currency = node.currency || "NOK";

  return {
    id: node.id || "",
    orderId: node.id || "",
    invoiceNumber: node.invoiceNumber || node.id || "Invoice",
    status: status.label,
    statusKey: status.key,
    statusRaw: status.raw,
    issuedOn: formatDate(node.issuedOn),
    dueOn: formatDate(node.dueDate),
    paidOn: formatDate(node.paidOn),
    subtotal: formatMoney(node.subtotal, currency),
    taxAmount: formatMoney(node.taxAmount, currency),
    deliveryFee: formatMoney(node.deliveryFee, currency),
    tipAmount: formatMoney(node.tipAmount, currency),
    totalAmount: formatMoney(node.totalAmount, currency),
    paidAmount: formatMoney(node.paidAmount, currency),
    dueAmount: formatMoney(node.dueAmount, currency),
    paymentType: node.paymentType || "Not specified",
    transactionReference: node.transactionReference || "Not available",
    note: node.note || "",
    vendor: {
      id: node.vendor?.id || "",
      name: node.vendor?.name || "Catering partner",
      slug: node.vendor?.slug || "",
      logoUrl: node.vendor?.logoUrl || "",
      companyName: node.vendor?.companyName || "",
    },
    order: {
      id: node.order?.id || node.id || "",
      eventName: node.order?.eventName || "Event",
      eventDate: formatDate(node.order?.dueDate),
      personCount: Number(node.order?.guestCount ?? 0),
      deliveryAddressStr: node.order?.deliveryDate
        ? `Delivery date: ${formatDate(node.order.deliveryDate)}`
        : "Not provided",
    },
    billingAddress: {
      address: "",
      country: "",
      phone: "",
    },
    lineItems: Array.isArray(node.lineItems)
      ? node.lineItems.map((item) => ({
          id: item.id || "",
          label: item.label || "Line item",
          description: item.description || "",
          quantity: Number(item.quantity ?? 0),
          unitPrice: formatMoney(item.unitPrice, currency),
          totalPrice: formatMoney(item.totalPrice, currency),
        }))
      : [],
  };
}

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({
        query: FETCH_INVOICES_QUERY,
        variables: {
          status: filters.status ?? null,
          search: filters.search ?? null,
          dateFrom: filters.dateFrom ?? null,
          dateTo: filters.dateTo ?? null,
          first: filters.first ?? 100,
          after: filters.after ?? null,
        },
      });

      const summary = response.invoiceSummary || {};
      const connection = response.clientOrders || {};

      return {
        records: (connection.edges || []).map((edge) =>
          mapInvoiceListNode(edge.node || {}),
        ),
        overview: buildOverview(summary),
        totals: buildTotals(summary),
        totalCount: connection.totalCount ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load invoices.");
    }
  },
);

export const fetchInvoiceDetail = createAsyncThunk(
  "invoices/fetchInvoiceDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({
        query: GET_INVOICE_DETAIL_QUERY,
        variables: { orderId },
      });

      if (!response.clientOrder?.id) {
        throw new Error("Invoice details not found.");
      }

      return mapInvoiceDetail(response.clientOrder);
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to load invoice details.",
      );
    }
  },
);

export const fetchInvoiceDownloadUrl = createAsyncThunk(
  "invoices/fetchInvoiceDownloadUrl",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({
        query: GET_INVOICE_DOWNLOAD_URL_QUERY,
        variables: { invoiceId },
      });

      if (!response.invoiceDownloadUrl?.url) {
        throw new Error("Invoice download link is not available.");
      }

      return response.invoiceDownloadUrl;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to get invoice download link.",
      );
    }
  },
);

const initialState = {
  records: [],
  overview: buildOverview(),
  totals: buildTotals(),
  totalCount: 0,
  isLoading: false,
  error: null,
  selectedInvoiceDetail: null,
  selectedInvoiceDetailStatus: "idle",
  selectedInvoiceDetailError: null,
  downloadStatus: "idle",
  downloadError: null,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    clearSelectedInvoiceDetail(state) {
      state.selectedInvoiceDetail = null;
      state.selectedInvoiceDetailStatus = "idle";
      state.selectedInvoiceDetailError = null;
    },
    clearInvoiceDownloadState(state) {
      state.downloadStatus = "idle";
      state.downloadError = null;
    },
  },
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
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load invoices.";
      })
      .addCase(fetchInvoiceDetail.pending, (state) => {
        state.selectedInvoiceDetailStatus = "loading";
        state.selectedInvoiceDetailError = null;
      })
      .addCase(fetchInvoiceDetail.fulfilled, (state, action) => {
        state.selectedInvoiceDetailStatus = "succeeded";
        state.selectedInvoiceDetail = action.payload;
      })
      .addCase(fetchInvoiceDetail.rejected, (state, action) => {
        state.selectedInvoiceDetailStatus = "failed";
        state.selectedInvoiceDetailError =
          action.payload || "Failed to load invoice details.";
      })
      .addCase(fetchInvoiceDownloadUrl.pending, (state) => {
        state.downloadStatus = "loading";
        state.downloadError = null;
      })
      .addCase(fetchInvoiceDownloadUrl.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(fetchInvoiceDownloadUrl.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.downloadError =
          action.payload || "Failed to get invoice download link.";
      });
  },
});

export const { clearSelectedInvoiceDetail, clearInvoiceDownloadState } =
  invoicesSlice.actions;

export default invoicesSlice.reducer;
