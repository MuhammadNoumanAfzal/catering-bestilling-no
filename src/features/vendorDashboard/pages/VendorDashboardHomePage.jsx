import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiCreditCard,
  FiPackage,
  FiSettings,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import VendorSectionCard from "../components/VendorSectionCard";
import { fetchDashboardData } from "../dashboardSlice";
import { vendorSettingsLinks } from "../data/vendorDashboardConfig";

const SETTINGS_PREVIEW_COPY = {
  "Edit Profile": "Update your business identity and contact details.",
  Notification: "Control alerts for orders, invoices, and updates.",
};

function getStatusClasses(status) {
  const normalizedStatus = `${status ?? ""}`.toLowerCase();

  if (
    normalizedStatus === "completed" ||
    normalizedStatus === "delivered" ||
    normalizedStatus === "ready"
  ) {
    return "bg-[#e7f8eb] text-[#1f8f47]";
  }

  if (normalizedStatus === "scheduled" || normalizedStatus === "pending") {
    return "bg-[#eef3fc] text-[#2c76ff]";
  }

  return "bg-[#fff1eb] text-[#cf6e38]";
}

function joinMeta(parts) {
  return parts.filter(Boolean).join(" • ");
}

function VendorStatCard({ label, value, icon: Icon }) {
  return (
    <article className="relative overflow-hidden rounded-[26px] border border-[#eadfd5] bg-[linear-gradient(135deg,#fffdfb_0%,#fff5ee_100%)] p-4 shadow-[0_18px_36px_rgba(42,23,10,0.07)] sm:p-5">
      <div className="absolute right-[-18px] top-[-18px] h-24 w-24 rounded-full bg-[#ffe6d8]/70 blur-2xl" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#cf5c2f] shadow-[0_10px_22px_rgba(207,92,47,0.14)] sm:h-14 sm:w-14">
        <Icon className="text-[26px] sm:text-[30px]" />
      </div>
      <p className="relative mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9f7a66] sm:mt-5">
        {label}
      </p>
      <p className="relative mt-3 text-[28px] font-extrabold leading-none text-[#1f1f1f] sm:mt-4 sm:text-[32px]">
        {value}
      </p>
      <p className="relative mt-2 text-sm text-[#6f645b]">
        Updated from your live dashboard activity.
      </p>
    </article>
  );
}

function DashboardErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[24px] border border-[#f1c8bb] bg-[#fff5f1] p-6 text-center shadow-[0_12px_24px_rgba(32,32,32,0.04)]">
      <h2 className="text-lg font-semibold text-[#3a2218]">
        Unable to load dashboard
      </h2>
      <p className="mt-2 text-sm text-[#8a5642]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#cf5c2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b94f26]"
      >
        Try again
      </button>
    </div>
  );
}

function DashboardInvoicePreviewCard({ invoice }) {
  return (
    <div className="rounded-[22px] border border-[#efe3d8] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-4 shadow-[0_10px_24px_rgba(36,20,9,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#cf5c2f] shadow-[0_8px_18px_rgba(207,92,47,0.10)]">
            <FiCreditCard className="text-[20px]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold text-[#221914]">
              {invoice.eventName}
            </p>
            <p className="mt-1 text-sm text-[#877a71]">
              {joinMeta([invoice.date, invoice.id])}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusClasses(invoice.status)}`}
        >
          {invoice.status}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aa7a61]">
            Invoice amount
          </p>
          <p className="mt-1 text-[22px] font-bold leading-none text-[#1f1f1f]">
            {invoice.amount}
          </p>
        </div>
        <span className="text-sm font-medium text-[#c76b3e]">
          Recent billing
        </span>
      </div>
    </div>
  );
}

function DashboardSettingsQuickLink({ label, icon: Icon, to }) {
  const helperText =
    SETTINGS_PREVIEW_COPY[label] || "Open this area to manage vendor account settings.";

  return (
    <Link
      to={to}
      className="group rounded-[22px] border border-[#efe3d8] bg-[linear-gradient(180deg,#fffefd_0%,#fff7f2_100%)] p-4 shadow-[0_10px_22px_rgba(36,20,9,0.05)] transition hover:-translate-y-0.5 hover:border-[#e4d0c2]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#cf5c2f] shadow-[0_8px_18px_rgba(207,92,47,0.10)]">
          <Icon className="text-[20px]" />
        </span>
        <FiChevronRight className="mt-1 shrink-0 text-[18px] text-[#c4a18d] transition group-hover:text-[#cf5c2f]" />
      </div>

      <p className="mt-4 text-[16px] font-semibold text-[#241b16]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#71665d]">{helperText}</p>
    </Link>
  );
}

export default function VendorDashboardHomePage() {
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
      label: "Total Orders",
      value: totalOrders,
      icon: FiTruck,
    },
    {
      label: "Pending Invoices",
      value: pendingInvoices,
      icon: FiCreditCard,
    },
  ];

  const userDisplayName =
    user?.firstName?.trim() || user?.name?.trim() || "there";
  const normalizedOrders = Array.isArray(recentOrders) ? recentOrders : [];
  const normalizedInvoices = Array.isArray(recentInvoices) ? recentInvoices : [];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf5c2f] border-t-transparent"></div>
      </div>
    );
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
      <section className="overflow-hidden rounded-[30px] border border-[#ecdccd] bg-[radial-gradient(circle_at_top_right,rgba(255,228,210,0.9),transparent_28%),linear-gradient(135deg,#fff8f1_0%,#fffdfb_46%,#fdf2e9_100%)] p-5 shadow-[0_22px_44px_rgba(55,30,15,0.08)] sm:p-6 lg:p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-end">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#b06f4d]">
              Vendor command center
            </p>
            <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.04em] text-[#191919] sm:text-[40px]">
              Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5f5a54] sm:text-[16px]">
              Welcome back, {userDisplayName}. Keep an eye on fresh orders,
              pending invoices, and the parts of your business that need your
              attention first.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border border-[#f0ded1] bg-white/80 px-4 py-4 shadow-[0_12px_24px_rgba(53,29,14,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a06f55]">
                Recent Orders
              </p>
              <p className="mt-2 text-[26px] font-bold text-[#1f1f1f]">
                {normalizedOrders.length}
              </p>
            </div>
            <div className="rounded-[24px] border border-[#f0ded1] bg-white/80 px-4 py-4 shadow-[0_12px_24px_rgba(53,29,14,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a06f55]">
                Recent Invoices
              </p>
              <p className="mt-2 text-[26px] font-bold text-[#1f1f1f]">
                {normalizedInvoices.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((item) => (
          <VendorStatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <VendorSectionCard
          title="Recent Orders"
          icon={FiPackage}
          footerTo="/vendor-dashboard/orders"
        >
          <div className="grid grid-cols-2 gap-3">
            {normalizedOrders.length > 0 ? (
              normalizedOrders.map((order, index) => (
                <div
                  key={`${order.id}-${index}`}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-[#efefef] px-3 py-3 sm:px-4"
                >
                  <div>
                    <p className="type-h5">{order.eventName}</p>
                    <p className="mt-1 type-para text-[#8d8d8d]">
                      {joinMeta([order.date, order.id])}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col items-start gap-2">
                    <span className="type-h5 font-semibold text-[#1a1a1a]">
                      {order.amount}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 type-h6 font-semibold ${getStatusClasses(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-6 text-center text-sm text-[#7e776f]">
                No recent orders found.
              </div>
            )}
          </div>
        </VendorSectionCard>

        <div className="space-y-6">
          <VendorSectionCard
            title="Invoices"
            icon={FiCreditCard}
            footerTo="/vendor-dashboard/invoices"
          >
            <div className="rounded-[24px] border border-[#f0e2d8] bg-[linear-gradient(135deg,#fff8f2_0%,#fffdfb_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aa7659]">
                    Billing overview
                  </p>
                  <p className="mt-2 text-[26px] font-bold leading-none text-[#1d1d1d]">
                    {pendingInvoices}
                  </p>
                  <p className="mt-2 text-sm text-[#736860]">
                    Pending invoices currently need attention.
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#efd8ca] bg-white px-3 py-2 text-right shadow-[0_8px_20px_rgba(44,24,11,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ad7d63]">
                    Recent
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#cf5c2f]">
                    {normalizedInvoices.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {normalizedInvoices.length > 0 ? (
                normalizedInvoices.map((invoice, index) => (
                  <DashboardInvoicePreviewCard
                    key={`${invoice.id}-${index}`}
                    invoice={invoice}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-sm text-[#7e776f]">
                  No recent invoices found.
                </div>
              )}
            </div>
          </VendorSectionCard>

          <VendorSectionCard
            title="Settings"
            icon={FiSettings}
            footerLabel="Manage Settings"
            footerTo="/vendor-dashboard/settings"
          >
            <div className="mb-4 rounded-[22px] border border-[#f0e4db] bg-[linear-gradient(135deg,#fffaf4_0%,#fffdfa_100%)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ac795c]">
                Quick controls
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6f645b]">
                Jump into the settings areas you are most likely to update
                during day-to-day operations.
              </p>
            </div>

            <div className="grid gap-3">
              {vendorSettingsLinks.map(({ label, icon: Icon, to }) => (
                <DashboardSettingsQuickLink
                  key={label}
                  label={label}
                  icon={Icon}
                  to={to}
                />
              ))}
            </div>
          </VendorSectionCard>
        </div>
      </section>
    </div>
  );
}
