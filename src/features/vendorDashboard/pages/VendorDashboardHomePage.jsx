import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiSettings,
  FiTruck,
  FiList,
  FiFileText,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import VendorSectionCard from "../components/VendorSectionCard";
import VendorDashboardDateFilter from "../components/VendorDashboardDateFilter";
import DashboardLoadingState from "../components/DashboardLoadingState";
import { fetchDashboardData } from "../dashboardSlice";
import { fetchClientOrders } from "../ordersSlice";
import { fetchInvoices } from "../invoicesSlice";
import { getOrderStatusClasses } from "../components/orders/orderUtils";
import { getInvoiceStatusClasses } from "../components/invoices/invoiceUtils";

const DEFAULT_DASHBOARD_DATE_RANGE = "last-7-days";

function translateDashboardStatus(t, status) {
  const normalizedStatus = `${status ?? ""}`
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const statusKeyMap = {
    completed: "vendorPanel.dashboard.statuses.completed",
    delivered: "vendorPanel.dashboard.statuses.delivered",
    confirmed: "vendorPanel.dashboard.statuses.confirmed",
    ready: "vendorPanel.dashboard.statuses.ready",
    preparing: "vendorPanel.dashboard.statuses.preparing",
    accepted: "vendorPanel.dashboard.statuses.accepted",
    scheduled: "vendorPanel.dashboard.statuses.scheduled",
    placed: "vendorPanel.dashboard.statuses.placed",
    "out for delivery": "vendorPanel.dashboard.statuses.outForDelivery",
    pending: "vendorPanel.dashboard.statuses.pending",
    unpaid: "vendorPanel.dashboard.statuses.unpaid",
    new: "vendorPanel.dashboard.statuses.new",
    draft: "vendorPanel.dashboard.statuses.draft",
    paid: "vendorPanel.dashboard.statuses.paid",
    overdue: "vendorPanel.dashboard.statuses.overdue",
    canceled: "vendorPanel.dashboard.statuses.canceled",
    cancelled: "vendorPanel.dashboard.statuses.cancelled",
    modified: "vendorPanel.dashboard.statuses.modified",
  };

  const key = statusKeyMap[normalizedStatus];
  return key ? t(key, { defaultValue: status }) : status;
}

function parseDashboardDate(dateValue) {
  if (!dateValue) {
    return new Date(Number.NaN);
  }

  const parsedDate = new Date(dateValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return new Date(`${dateValue} 00:00:00`);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function getDashboardDateWindow(selectedRange, customDateRange, referenceDate = new Date()) {
  const end = endOfDay(referenceDate);

  if (selectedRange === "all-time") {
    return null;
  }

  if (selectedRange === "custom-date") {
    const from = customDateRange.from
      ? startOfDay(parseDashboardDate(customDateRange.from))
      : null;
    const to = customDateRange.to
      ? endOfDay(parseDashboardDate(customDateRange.to))
      : null;

    return { from, to };
  }

  if (selectedRange === "this-year") {
    return { from: new Date(referenceDate.getFullYear(), 0, 1), to: end };
  }

  const daysByRange = {
    "last-7-days": 7,
    "last-month": 30,
    "last-3-months": 90,
    "last-6-months": 180,
  };
  const days = daysByRange[selectedRange];

  if (!days) {
    return null;
  }

  const from = startOfDay(referenceDate);
  from.setDate(from.getDate() - days);
  return { from, to: end };
}

function matchesDashboardDateFilter(item, selectedRange, customDateRange, referenceDate) {
  const window = getDashboardDateWindow(selectedRange, customDateRange, referenceDate);

  if (!window) {
    return true;
  }

  const itemDate = parseDashboardDate(item.eventDate || item.date);

  if (Number.isNaN(itemDate.getTime())) {
    return true;
  }

  if (window.from && !Number.isNaN(window.from.getTime()) && itemDate < window.from) {
    return false;
  }

  if (window.to && !Number.isNaN(window.to.getTime()) && itemDate > window.to) {
    return false;
  }

  return true;
}

function getRouteId(item) {
  return item.rawId || item.orderId || `${item.id ?? ""}`.replace(/^#/, "");
}

function mapOrderFallback(order) {
  return {
    id: order.id || "",
    rawId: order.rawId || getRouteId(order),
    eventName: order.eventName || "",
    date: order.date || order.orderedDate || "",
    eventDate: order.eventDateRaw || order.createdOnRaw || order.date || "",
    status: order.status || "Pending",
    amount: order.total || order.amount || "",
  };
}

function mapInvoiceFallback(invoice) {
  return {
    id: invoice.invoiceNumberShort || invoice.invoiceNumber || invoice.id || "",
    rawId: invoice.orderId || invoice.rawId || invoice.id || "",
    orderId: invoice.orderId || invoice.rawId || invoice.id || "",
    eventName: invoice.event || invoice.eventName || "",
    date: invoice.issuedOn || invoice.dueOn || invoice.eventDate || "",
    eventDate: invoice.issuedOnRaw || invoice.dueDateRaw || invoice.eventDateRaw || "",
    status: invoice.status || "Pending",
    amount: invoice.amount || "",
  };
}

function VendorStatCard({ label, value, icon: Icon }) {
  return (
    <article className="flex flex-col items-center justify-center rounded-[20px] border border-[#e5e5e5] bg-white p-7 shadow-none transition-all duration-200 hover:border-[#ebdcd0] hover:shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center text-[#cf6e38]">
        <Icon className="text-[48px]" />
      </div>
      <p className="mt-3 text-sm font-bold text-[#232323] tracking-wide text-center uppercase">
        {label}
      </p>
      <p className="mt-2 text-5xl font-black text-[#232323] text-center leading-none">
        {value}
      </p>
    </article>
  );
}

function DashboardErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-[24px] border border-[#f1c8bb] bg-[#fff5f1] p-6 text-center shadow-[0_12px_24px_rgba(32,32,32,0.04)]">
      <h2 className="text-lg font-semibold text-[#3a2218]">
        {t("vendorPanel.dashboard.loadErrorTitle")}
      </h2>
      <p className="mt-2 text-sm text-[#8a5642]">
        {message || t("vendorPanel.dashboard.loadErrorMessage")}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#cf5c2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b94f26]"
      >
        {t("alerts.tryAgain")}
      </button>
    </div>
  );
}

export default function VendorDashboardHomePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDateRange, setSelectedDateRange] = useState(DEFAULT_DASHBOARD_DATE_RANGE);
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const {
    totalOrders,
    pendingInvoices,
    recentOrders,
    recentInvoices,
    isLoading,
    error,
  } = useSelector((state) => state.dashboard);
  const {
    orders: allOrders = [],
    isLoading: areOrdersLoading = false,
  } = useSelector((state) => state.orders);
  const {
    records: allInvoices = [],
    isLoading: areInvoicesLoading = false,
  } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    const shouldLoadOrders = totalOrders > recentOrders.length && allOrders.length === 0 && !areOrdersLoading;
    const shouldLoadInvoices = pendingInvoices > recentInvoices.length && allInvoices.length === 0 && !areInvoicesLoading;

    if (shouldLoadOrders) {
      dispatch(fetchClientOrders({ silent: true }));
    }

    if (shouldLoadInvoices) {
      dispatch(fetchInvoices({ first: 100 }));
    }
  }, [
    allInvoices.length,
    allOrders.length,
    areInvoicesLoading,
    areOrdersLoading,
    dispatch,
    pendingInvoices,
    recentInvoices.length,
    recentOrders.length,
    totalOrders,
  ]);


  const localSettingsLinks = [
    {
      label: t("vendorPanel.settingsLinks.editProfile"),
      to: "/vendor-dashboard/settings#profile",
    },
    {
      label: t("vendorPanel.settingsLinks.password"),
      to: "/vendor-dashboard/settings#password",
    },
    {
      label: t("vendorPanel.settingsLinks.notification"),
      to: "/vendor-dashboard/settings#notifications",
    },
  ];

  const userDisplayName =
    user?.firstName?.trim() || user?.name?.trim() || t("vendorPanel.fallbackGreetingName");
  const dashboardOrders = Array.isArray(recentOrders) ? recentOrders : [];
  const dashboardInvoices = Array.isArray(recentInvoices) ? recentInvoices : [];
  const fallbackOrders = Array.isArray(allOrders) ? allOrders.map(mapOrderFallback) : [];
  const fallbackInvoices = Array.isArray(allInvoices) ? allInvoices.map(mapInvoiceFallback) : [];
  const normalizedOrders = fallbackOrders.length > dashboardOrders.length ? fallbackOrders : dashboardOrders;
  const normalizedInvoices = fallbackInvoices.length > dashboardInvoices.length ? fallbackInvoices : dashboardInvoices;
  const dashboardReferenceDate = useMemo(() => {
    const validDates = [...normalizedOrders, ...normalizedInvoices]
      .map((item) => item.eventDate || item.date)
      .map(parseDashboardDate)
      .filter((date) => !Number.isNaN(date.getTime()))
      .map((date) => date.getTime());

    if (validDates.length === 0) {
      return new Date();
    }

    return new Date(Math.max(...validDates));
  }, [normalizedInvoices, normalizedOrders]);
  const filteredOrders = useMemo(
    () => normalizedOrders.filter((order) => matchesDashboardDateFilter(order, selectedDateRange, customDateRange, dashboardReferenceDate)),
    [customDateRange, dashboardReferenceDate, normalizedOrders, selectedDateRange],
  );
  const filteredInvoices = useMemo(
    () => normalizedInvoices.filter((invoice) => matchesDashboardDateFilter(invoice, selectedDateRange, customDateRange, dashboardReferenceDate)),
    [customDateRange, dashboardReferenceDate, normalizedInvoices, selectedDateRange],
  );

  const displayedTotalOrders = normalizedOrders.length > 0 ? filteredOrders.length : totalOrders;
  const displayedPendingInvoices = normalizedInvoices.length > 0
    ? filteredInvoices.filter((invoice) => {
        const status = `${invoice.status ?? ""}`.toLowerCase();
        return status !== "paid" && status !== "completed" && status !== "cancelled" && status !== "canceled";
      }).length
    : pendingInvoices;
  const stats = [
    {
      label: t("vendorPanel.dashboard.totalOrders"),
      value: displayedTotalOrders,
      icon: FiTruck,
    },
    {
      label: t("vendorPanel.dashboard.pendingInvoice"),
      value: displayedPendingInvoices,
      icon: FiFileText,
    },
  ];
  function handleDateFilterSelect(value) {
    setSelectedDateRange(value);
    if (value !== "custom-date") {
      setIsDateMenuOpen(false);
    }
  }

  function handleDateMenuToggle(nextOpen) {
    if (typeof nextOpen === "boolean") {
      setIsDateMenuOpen(nextOpen);
      return;
    }

    setIsDateMenuOpen((open) => !open);
  }

  function handleResetDateFilter() {
    setSelectedDateRange("all-time");
    setCustomDateRange({ from: "", to: "" });
    setIsDateMenuOpen(false);
  }

  function handleOrderClick(order) {
    const orderId = getRouteId(order);
    navigate("/vendor-dashboard/orders", {
      state: orderId ? { openOrderId: orderId } : undefined,
    });
  }

  function handleInvoiceClick(invoice) {
    const invoiceId = getRouteId(invoice);

    if (invoiceId) {
      navigate(`/vendor-dashboard/invoices/${encodeURIComponent(invoiceId)}`);
    }
  }

  if (isLoading) {
    return <DashboardLoadingState title="Loading dashboard" description="Gathering your latest orders, invoices, and account activity." rows={4} columns={4} />;
  }

  if (error) {
    return (
      <DashboardErrorState
        message={error}
        onRetry={() => dispatch(fetchDashboardData())}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#18120f]">
            {t("vendorPanel.dashboard.title")}
          </h1>
          <p className="mt-2 type-para text-[#5f5a54]">
            {t("vendorPanel.dashboard.welcomeBack", { name: userDisplayName })}
          </p>
        </div>

        <VendorDashboardDateFilter
          customDateRange={customDateRange}
          isOpen={isDateMenuOpen}
          onApplyCustomDate={() => setIsDateMenuOpen(false)}
          onCustomDateChange={(field, value) =>
            setCustomDateRange((current) => ({ ...current, [field]: value }))
          }
          onReset={handleResetDateFilter}
          onSelect={handleDateFilterSelect}
          onToggle={handleDateMenuToggle}
          selectedRange={selectedDateRange}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((item) => (
          <VendorStatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <VendorSectionCard
            title={t("vendorPanel.dashboard.recentOrders")}
            icon={FiList}
            footerTo="/vendor-dashboard/orders"
          >
            <div className="divide-y divide-[#f0f0f0]">
              {filteredOrders.slice(0, 3).length > 0 ? (
                filteredOrders.slice(0, 3).map((order, index) => (
                  <button
                    key={`${order.id}-${index}`}
                    type="button"
                    onClick={() => handleOrderClick(order)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left transition hover:bg-[#faf9f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b79e]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-base font-bold text-[#232323]">{order.id}</span>
                      <span className="text-sm text-[#8d857d]">{order.date}</span>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${getOrderStatusClasses(order.status)}`}
                    >
                      {translateDashboardStatus(t, order.status)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-[#7e776f]">
                  {t("vendorPanel.dashboard.noRecentOrders")}
                </div>
              )}
            </div>
          </VendorSectionCard>

          <VendorSectionCard
            title={t("nav.settings")}
            icon={FiSettings}
            footerLabel={null}
          >
            <div className="divide-y divide-[#f0f0f0]">
              {localSettingsLinks.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center justify-between py-4 hover:bg-[#faf9f6] transition duration-150 px-1"
                >
                  <span className="text-base font-semibold text-[#232323]">{label}</span>
                  <FiChevronRight className="text-[#cf6e38] text-base" />
                </Link>
              ))}
            </div>
          </VendorSectionCard>
        </div>

        <div>
          <VendorSectionCard
            title={t("vendorPanel.nav.invoices")}
            icon={FiFileText}
            footerTo="/vendor-dashboard/invoices"
          >
            <div className="divide-y divide-[#f0f0f0]">
              {filteredInvoices.slice(0, 6).length > 0 ? (
                filteredInvoices.slice(0, 6).map((invoice, index) => (
                  <button
                    key={`${invoice.id}-${index}`}
                    type="button"
                    onClick={() => handleInvoiceClick(invoice)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left transition hover:bg-[#faf9f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b79e]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-base font-bold text-[#232323]">{invoice.id}</span>
                      <span className="text-sm text-[#8d857d]">{invoice.date}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getInvoiceStatusClasses(invoice.status)}`}
                      >
                        {translateDashboardStatus(t, invoice.status)}
                      </span>
                      <span className="text-base font-bold text-[#232323] min-w-[100px] text-right">
                        {invoice.amount}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-[#7e776f]">
                  {t("vendorPanel.dashboard.noRecentInvoices")}
                </div>
              )}
            </div>
          </VendorSectionCard>
        </div>
      </section>
    </div>
  );
}
