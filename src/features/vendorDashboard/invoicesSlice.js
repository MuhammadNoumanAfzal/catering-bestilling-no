import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";
import { getStoredAccessToken } from "../../lib/auth/authSession";

const DEFAULT_RECEIPT_UPLOAD_ENDPOINT =
  "https://api.gocatering.no/api/upload-receipt/";

const RECEIPT_UPLOAD_ENDPOINT =
  import.meta.env.VITE_RECEIPT_UPLOAD_URL ??
  DEFAULT_RECEIPT_UPLOAD_ENDPOINT;

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
          currency
          pdfUrl
          pricing {
            subtotal
            taxAmount
            deliveryFee
            addOnsTotal
            tipAmount
            grandTotal
            amountPaid
            amountDue
          }
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
  query GetInvoiceDetail($invoiceId: ID!) {
    invoice(id: $invoiceId) {
      id
      invoiceNumber
      paymentStatus
      paymentMethod
      paymentReference
      dueDate
      issuedAt
      paidAt
      verifiedAt
      rejectedAt
      customerName
      customerEmail
      customerPhone
      orderId
      orderNumber
      vendorId
      vendorName
      subtotal {
        amount
        currency
        formatted
      }
      taxAmount {
        amount
        currency
        formatted
      }
      deliveryFee {
        amount
        currency
        formatted
      }
      grandTotal {
        amount
        currency
        formatted
      }
      amountPaid {
        amount
        currency
        formatted
      }
      amountDue {
        amount
        currency
        formatted
      }
      bankDetails {
        accountName
        accountNumber
        iban
        swiftCode
        bankName
        instructions
      }
      paymentReport {
        paymentDate
        transferReference
        note
        receiptUrl
        reportedAt
        reportedByCustomerId
      }
      paymentHistory {
        id
        action
        actorType
        actorId
        actorName
        fromStatus
        toStatus
        note
        createdAt
      }
    }
  }
`;

const REPORT_INVOICE_PAYMENT_MUTATION = `
  mutation ReportInvoicePayment($invoiceId: ID!, $input: ReportInvoicePaymentInput!) {
    reportInvoicePayment(invoiceId: $invoiceId, input: $input) {
      success
      message
      invoice {
        id
      }
    }
  }
`;

const GET_INVOICE_DOWNLOAD_URL_QUERY = `
  query GetInvoiceDownloadUrl($invoiceId: ID!) {
    invoiceDownloadUrl(invoiceId: $invoiceId) {
      downloadUrl
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

function formatDateTime(value) {
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
      hour: "2-digit",
      minute: "2-digit",
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

  if (normalized === "payment-reported" || normalized === "payment_reported") {
    return {
      raw: status || "payment-reported",
      key: "reported",
      label: "Payment Reported",
    };
  }

  if (normalized === "payment-overdue" || normalized === "overdue") {
    return {
      raw: status || "payment-overdue",
      key: "overdue",
      label: "Overdue",
    };
  }

  if (normalized === "rejected") {
    return {
      raw: status || "rejected",
      key: "rejected",
      label: "Rejected",
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
    {
      labelKey: "vendorPanel.invoices.overview.totalInvoices",
      value: summary.totalInvoices ?? 0,
    },
    {
      labelKey: "vendorPanel.invoices.overview.paidInvoices",
      value: summary.paidInvoices ?? 0,
    },
    {
      labelKey: "vendorPanel.invoices.overview.unpaidInvoices",
      value: summary.unpaidInvoices ?? 0,
    },
    {
      labelKey: "vendorPanel.invoices.overview.overdueInvoices",
      value: summary.overdueInvoices ?? 0,
    },
  ];
}

function buildTotals(summary = {}) {
  return [
    {
      labelKey: "vendorPanel.invoices.overview.totalSpent",
      value: formatMoney(summary.totalSpent),
    },
    {
      labelKey: "vendorPanel.invoices.overview.thisMonth",
      value: formatMoney(summary.thisMonthSpent),
    },
    {
      labelKey: "vendorPanel.invoices.overview.pendingAmount",
      value: formatMoney(summary.pendingAmount),
    },
    {
      labelKey: "vendorPanel.invoices.overview.overdueAmount",
      value: formatMoney(summary.overdueAmount),
    },
  ];
}

function mapInvoiceListNode(node) {
  const pricing = node.pricing || {};
  const status = mapInvoiceStatus(node.status);
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
    subtotal: formatMoney(pricing.subtotal || node.subtotal, currency),
    tax: formatMoney(pricing.taxAmount || node.taxAmount, currency),
    deliveryFee: formatMoney(pricing.deliveryFee || node.deliveryFee, currency),
    tip: formatMoney(pricing.tipAmount || node.tipAmount, currency),
    amount: formatMoney(pricing.grandTotal || node.totalAmount, currency),
    paidAmount: formatMoney(pricing.amountPaid || node.paidAmount, currency),
    dueAmount: formatMoney(pricing.amountDue || node.dueAmount, currency),
    amountRaw: toNumber(pricing.grandTotal || node.totalAmount),
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
  const bankDetails = node.bankDetails || {};
  const status = mapInvoiceStatus(node.paymentStatus || node.status);
  const currency =
    node.grandTotal?.currency ||
    node.amountDue?.currency ||
    node.amountPaid?.currency ||
    node.subtotal?.currency ||
    "NOK";

  return {
    id: node.id || "",
    orderId: node.orderId || "",
    invoiceNumber: node.invoiceNumber || node.id || "Invoice",
    orderNumber: node.orderNumber || node.invoiceNumber || node.id || "",
    status: status.label,
    statusKey: status.key,
    statusRaw: status.raw,
    issuedOn: formatDate(node.issuedAt || node.issueDate || node.issuedOn),
    dueOn: formatDate(node.dueDate),
    paidOn: formatDate(node.paidAt || node.paidOn),
    paidOnRaw: node.paidAt || node.paidOn || "",
    issuedAtRaw: node.issuedAt || node.issueDate || node.issuedOn || "",
    dueDateRaw: node.dueDate || "",
    verifiedAt: formatDateTime(node.verifiedAt),
    rejectedAt: formatDateTime(node.rejectedAt),
    subtotal:
      node.subtotal?.formatted || formatMoney(node.subtotal?.amount, currency),
    taxAmount:
      node.taxAmount?.formatted || formatMoney(node.taxAmount?.amount, currency),
    deliveryFee:
      node.deliveryFee?.formatted ||
      formatMoney(node.deliveryFee?.amount, currency),
    tipAmount: formatMoney(0, currency),
    totalAmount:
      node.grandTotal?.formatted ||
      formatMoney(node.grandTotal?.amount, currency),
    paidAmount:
      node.amountPaid?.formatted ||
      formatMoney(node.amountPaid?.amount, currency),
    dueAmount:
      node.amountDue?.formatted || formatMoney(node.amountDue?.amount, currency),
    paymentType: node.paymentMethod || node.paymentType || "",
    paymentMethod: node.paymentMethod || "",
    transactionReference:
      node.paymentReference ||
      node.invoiceNumber ||
      node.orderNumber ||
      node.transactionReference ||
      "",
    note: node.note || "",
    bankTransferInstructions:
      node.bankTransferInstructions || bankDetails.instructions || "",
    bankAccountName: node.bankAccountName || bankDetails.accountName || "",
    bankAccountNumber:
      node.bankAccountNumber || bankDetails.accountNumber || "",
    iban: node.iban || bankDetails.iban || "",
    swiftCode: node.swiftCode || bankDetails.swiftCode || "",
    bankName: bankDetails.bankName || "",
    vendor: {
      id: node.vendorId || node.vendor?.id || "",
      name: node.vendorName || node.vendor?.name || "",
      slug: node.vendor?.slug || "",
      logoUrl: node.vendor?.logoUrl || "",
      companyName: node.vendor?.companyName || node.vendorName || "",
    },
    order: {
      id: node.orderId || "",
      eventName: node.orderNumber || node.invoiceNumber || "",
      eventDate: formatDate(node.dueDate),
      personCount: 0,
      deliveryAddressStr: "",
    },
    billingAddress: {
      address: "",
      country: "",
      phone: node.customerPhone || "",
    },
    customer: {
      name: node.customerName || "",
      email: node.customerEmail || "",
      phone: node.customerPhone || "",
    },
    paymentReport: node.paymentReport
      ? {
          paymentDate: node.paymentReport.paymentDate || "",
          transferReference: node.paymentReport.transferReference || "",
          note: node.paymentReport.note || "",
          receiptUrl: node.paymentReport.receiptUrl || "",
          reportedAt: node.paymentReport.reportedAt || "",
          reportedAtLabel: formatDateTime(node.paymentReport.reportedAt),
          reportedByCustomerId: node.paymentReport.reportedByCustomerId || "",
        }
      : null,
    paymentHistory: Array.isArray(node.paymentHistory)
      ? node.paymentHistory.map((item) => ({
          id: item?.id || "",
          action: item?.action || "",
          actorType: item?.actorType || "",
          actorId: item?.actorId || "",
          actorName: item?.actorName || "",
          fromStatus: item?.fromStatus || "",
          toStatus: item?.toStatus || "",
          note: item?.note || "",
          createdAt: item?.createdAt || "",
          createdAtLabel: formatDateTime(item?.createdAt),
        }))
      : [],
    lineItems: [],
  };
}

async function uploadReceiptFile(file) {
  if (!(file instanceof File)) {
    throw new Error("Please choose a valid receipt file.");
  }

  const accessToken = getStoredAccessToken();

  if (!accessToken) {
    throw new Error("Please sign in again before uploading a receipt.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(RECEIPT_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success || !payload?.receiptUrl) {
    throw new Error(
      payload?.message || "Receipt upload failed. Please try again.",
    );
  }

  return payload.receiptUrl;
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
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({
        query: GET_INVOICE_DETAIL_QUERY,
        variables: { invoiceId },
      });

      if (!response.invoice?.id) {
        throw new Error("Invoice details not found.");
      }

      return mapInvoiceDetail(response.invoice);
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to load invoice details.",
      );
    }
  },
);

export const reportInvoicePayment = createAsyncThunk(
  "invoices/reportInvoicePayment",
  async (
    { invoiceId, input, receiptFile = null },
    { rejectWithValue },
  ) => {
    try {
      let receiptUrl = input?.receiptUrl || "";

      if (receiptFile) {
        receiptUrl = await uploadReceiptFile(receiptFile);
      }

      const mutationResponse = await graphqlRequest({
        query: REPORT_INVOICE_PAYMENT_MUTATION,
        variables: {
          invoiceId,
          input: {
            paymentDate: input?.paymentDate,
            transferReference: input?.transferReference || null,
            note: input?.note || null,
            receiptUrl: receiptUrl || null,
          },
        },
      });

      if (!mutationResponse.reportInvoicePayment?.success) {
        throw new Error(
          mutationResponse.reportInvoicePayment?.message ||
            "Unable to report this invoice payment.",
        );
      }

      const detailResponse = await graphqlRequest({
        query: GET_INVOICE_DETAIL_QUERY,
        variables: { invoiceId },
      });

      if (!detailResponse.invoice?.id) {
        throw new Error("Invoice details not found after reporting payment.");
      }

      return {
        message:
          mutationResponse.reportInvoicePayment?.message ||
          "Invoice payment reported successfully.",
        invoice: mapInvoiceDetail(detailResponse.invoice),
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to report this invoice payment.",
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

      if (!response.invoiceDownloadUrl?.downloadUrl) {
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
  reportPaymentStatus: "idle",
  reportPaymentError: null,
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
      state.reportPaymentStatus = "idle";
      state.reportPaymentError = null;
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
      .addCase(reportInvoicePayment.pending, (state) => {
        state.reportPaymentStatus = "loading";
        state.reportPaymentError = null;
      })
      .addCase(reportInvoicePayment.fulfilled, (state, action) => {
        state.reportPaymentStatus = "succeeded";
        state.selectedInvoiceDetail = action.payload.invoice;
      })
      .addCase(reportInvoicePayment.rejected, (state, action) => {
        state.reportPaymentStatus = "failed";
        state.reportPaymentError =
          action.payload || "Unable to report this invoice payment.";
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
