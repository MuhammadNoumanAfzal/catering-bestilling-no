import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiSettings,
  FiTruck,
  FiList,
  FiFileText,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import VendorSectionCard from "../components/VendorSectionCard";
import DashboardLoadingState from "../components/DashboardLoadingState";
import { fetchDashboardData } from "../dashboardSlice";
import { getOrderStatusClasses } from "../components/orders/orderUtils";
import { getInvoiceStatusClasses } from "../components/invoices/invoiceUtils";

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
  const { user } = useAuth();
  const {
    totalOrders,
    pendingInvoices,
    recentOrders,
    recentInvoices,
    isLoading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const stats = [
    {
      label: t("vendorPanel.dashboard.totalOrders"),
      value: totalOrders,
      icon: FiTruck,
    },
    {
      label: t("vendorPanel.dashboard.pendingInvoice"),
      value: pendingInvoices,
      icon: FiFileText,
    },
  ];

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
  const normalizedOrders = Array.isArray(recentOrders) ? recentOrders : [];
  const normalizedInvoices = Array.isArray(recentInvoices) ? recentInvoices : [];

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
      <section>
        <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#18120f]">
          {t("vendorPanel.dashboard.title")}
        </h1>
        <p className="mt-2 type-para text-[#5f5a54]">
          {t("vendorPanel.dashboard.welcomeBack", { name: userDisplayName })}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((item) => (
          <VendorStatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Left Column: Recent Orders & Settings */}
        <div className="space-y-6">
          <VendorSectionCard
            title={t("vendorPanel.dashboard.recentOrders")}
            icon={FiList}
            footerTo="/vendor-dashboard/orders"
          >
            <div className="divide-y divide-[#f0f0f0]">
              {normalizedOrders.slice(0, 3).length > 0 ? (
                normalizedOrders.slice(0, 3).map((order, index) => (
                  <div
                    key={`${order.id}-${index}`}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-[#232323]">{order.id}</span>
                      <span className="text-sm text-[#8d857d]">{order.date}</span>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getOrderStatusClasses(order.status)}`}
                    >
                      {translateDashboardStatus(t, order.status)}
                    </span>
                  </div>
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

        {/* Right Column: Invoices */}
        <div>
          <VendorSectionCard
            title={t("vendorPanel.nav.invoices")}
            icon={FiFileText}
            footerTo="/vendor-dashboard/invoices"
          >
            <div className="divide-y divide-[#f0f0f0]">
              {normalizedInvoices.slice(0, 6).length > 0 ? (
                normalizedInvoices.slice(0, 6).map((invoice, index) => (
                  <div
                    key={`${invoice.id}-${index}`}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-[#232323]">{invoice.id}</span>
                      <span className="text-sm text-[#8d857d]">{invoice.date}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getInvoiceStatusClasses(invoice.status)}`}
                      >
                        {translateDashboardStatus(t, invoice.status)}
                      </span>
                      <span className="text-base font-bold text-[#232323] min-w-[100px] text-right">
                        {invoice.amount}
                      </span>
                    </div>
                  </div>
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
