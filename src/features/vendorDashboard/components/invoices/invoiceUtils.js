export const STATUS_OPTIONS = [
  { labelKey: "vendorPanel.invoices.allStatus", value: "all" },
  { labelKey: "vendorPanel.invoices.paid", value: "paid" },
  { labelKey: "vendorPanel.invoices.pending", value: "pending" },
  { labelKey: "vendorPanel.invoices.reported", value: "reported" },
  { labelKey: "vendorPanel.invoices.rejected", value: "rejected" },
  { labelKey: "vendorPanel.invoices.overdue", value: "overdue" },
];

export const DATE_OPTIONS = [
  { labelKey: "vendorPanel.invoices.last7Days", value: "7" },
  { labelKey: "vendorPanel.invoices.last30Days", value: "30" },
  { labelKey: "vendorPanel.invoices.thisYear", value: "year" },
  { labelKey: "vendorPanel.invoices.allTime", value: "all" },
  { labelKey: "vendorPanel.invoices.customDate", value: "custom-date" },
];

export const PAGE_SIZE = 8;

export function formatFilterDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");
  return `${day}-${month}-${year}`;
}

export function getInvoiceDateFilterLabel(selectedRange, customDateRange, t) {
  if (
    selectedRange === "custom-date" &&
    customDateRange.from &&
    customDateRange.to
  ) {
    return t("vendorPanel.invoices.customDateRange", {
      from: formatFilterDate(customDateRange.from),
      to: formatFilterDate(customDateRange.to),
    });
  }

  return (
    t(DATE_OPTIONS.find((option) => option.value === selectedRange)?.labelKey) ??
    t("vendorPanel.invoices.fallbackDateFilter")
  );
}

export function getInvoiceStatusClasses(status) {
  const normalizedStatus = `${status ?? ""}`.toLowerCase();

  if (normalizedStatus === "paid") {
    return "bg-[#dff6dd] text-[#2d9b42]";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#fff4d6] text-[#cf8b19]";
  }

  if (normalizedStatus === "reported") {
    return "bg-[#e8f0ff] text-[#2c76ff]";
  }

  if (normalizedStatus === "overdue") {
    return "bg-[#fde2d9] text-[#d06036]";
  }

  if (normalizedStatus === "rejected") {
    return "bg-[#fde8e8] text-[#c34242]";
  }

  return "bg-[#eef3fc] text-[#2c76ff]";
}

export function getInvoiceQueryDateRange(selectedRange, customDateRange = {}) {
  const today = new Date();
  const toDate = today.toISOString().slice(0, 10);

  if (selectedRange === "all") {
    return { dateFrom: null, dateTo: null };
  }

  if (selectedRange === "custom-date") {
    return {
      dateFrom: customDateRange.from || null,
      dateTo: customDateRange.to || null,
    };
  }

  if (selectedRange === "year") {
    return {
      dateFrom: `${today.getFullYear()}-01-01`,
      dateTo: toDate,
    };
  }

  const rangeDays = Number(selectedRange);

  if (!Number.isFinite(rangeDays) || rangeDays <= 0) {
    return { dateFrom: null, dateTo: null };
  }

  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - (rangeDays - 1));

  return {
    dateFrom: fromDate.toISOString().slice(0, 10),
    dateTo: toDate,
  };
}
