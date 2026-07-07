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
import { useAuth } from "../../auth";
import VendorSectionCard from "../components/VendorSectionCard";
import { fetchDashboardData } from "../dashboardSlice";

function getStatusClasses(status) {
  const normalizedStatus = `${status ?? ""}`.toLowerCase();

  if (
    normalizedStatus === "completed" ||
    normalizedStatus === "delivered" ||
    normalizedStatus === "ready"
  ) {
    return "bg-[#e8f6ed] text-[#1b7a3e]";
  }

  if (
    normalizedStatus === "scheduled" ||
    normalizedStatus === "pending" ||
    normalizedStatus === "preparing" ||
    normalizedStatus === "placed" ||
    normalizedStatus === "confirmed"
  ) {
    return "bg-[#fff3eb] text-[#c95f33]";
  }

  if (normalizedStatus === "draft") {
    return "bg-[#e5e5e5] text-[#555555]";
  }

  return "bg-[#f5f3f0] text-[#716a62]";
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
      label: "Pending Invoice",
      value: pendingInvoices,
      icon: FiFileText,
    },
  ];

  const localSettingsLinks = [
    {
      label: "Edit Profile",
      to: "/vendor-dashboard/settings#profile",
    },
    {
      label: "Password",
      to: "/vendor-dashboard/settings#password",
    },
    {
      label: "Notification",
      to: "/vendor-dashboard/settings#notifications",
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
      <section>
        <h1 className="type-h2 text-[#191919]">Dashboard</h1>
        <p className="mt-2 type-para text-[#5f5a54]">
          Welcome back, {userDisplayName}! Heres an overview of your activity.
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
            title="Recent Orders"
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
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-[#7e776f]">
                  No recent orders found.
                </div>
              )}
            </div>
          </VendorSectionCard>

          <VendorSectionCard
            title="Settings"
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
            title="Invoices"
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
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                      <span className="text-base font-bold text-[#232323] min-w-[100px] text-right">
                        {invoice.amount}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-[#7e776f]">
                  No recent invoices found.
                </div>
              )}
            </div>
          </VendorSectionCard>
        </div>
      </section>
    </div>
  );
}
