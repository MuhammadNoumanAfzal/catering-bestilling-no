import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiCreditCard,
  FiPackage,
  FiSettings,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import VendorSectionCard from "../components/VendorSectionCard";
import { fetchDashboardData } from "../dashboardSlice";
import {
  vendorSettingsLinks,
} from "../data/vendorDashboardConfig";

function getStatusClasses(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "completed" || normalizedStatus === "delivered" || normalizedStatus === "ready") {
    return "bg-[#e7f8eb] text-[#1f8f47]";
  }

  if (normalizedStatus === "scheduled" || normalizedStatus === "pending") {
    return "bg-[#eef3fc] text-[#2c76ff]";
  }

  return "bg-[#fff1eb] text-[#cf6e38]";
}

function VendorStatCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-[24px] border border-[#d9d9d9] bg-white p-4 shadow-[0_10px_24px_rgba(30,30,30,0.06)] sm:p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-transparent text-[#cf5c2f] sm:h-16 sm:w-16">
        <Icon className="text-[34px] sm:text-[54px]" />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#2a2a2a] sm:mt-5 sm:text-base">{label}</p>
      <p className="mt-3 text-[24px] font-extrabold leading-none text-[#1f1f1f] sm:mt-4 sm:text-[30px]">
        {value}
      </p>
    </article>
  );
}

export default function VendorDashboardHomePage() {
  const dispatch = useDispatch();
  const {
    totalOrders,
    pendingInvoices,
    rewardPoints,
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
      icon: FiCreditCard,
    },
    {
      label: "Reward Points",
      value: rewardPoints,
      icon: FiStar,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf5c2f] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2">Dashboard</h1>
        <p className="mt-4 type-para">
          Welcome back, Nouman. Here&apos;s an overview of your activity.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <VendorStatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <VendorSectionCard
            title="Recent Orders"
            icon={FiPackage}
            footerTo="/vendor-dashboard/orders"
          >
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div
                    key={`${order.id}-${index}`}
                    className="flex flex-col gap-3 rounded-2xl border border-[#efefef] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="type-h5">
                        {order.eventName}
                      </p>
                      <p className="mt-1 type-para text-[#8d8d8d]">{order.date} • {order.id}</p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <span className="type-h5 font-semibold text-[#1a1a1a]">{order.amount}</span>
                      <span
                        className={`rounded-full px-3 py-1 type-h6 font-semibold ${getStatusClasses(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
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
            footerLabel="Manage Settings"
            footerTo="/vendor-dashboard/settings"
          >
            <div className="space-y-3">
              {vendorSettingsLinks.map(({ label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#efefef] px-4 py-3 text-left transition hover:bg-[#faf7f3]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon className="shrink-0 text-[22px] text-[#666666]" />
                    <span className="type-h5 text-[#222222]">{label}</span>
                  </span>
                  <FiChevronRight className="shrink-0 text-[22px] text-[#9a9a9a]" />
                </Link>
              ))}
            </div>
          </VendorSectionCard>
        </div>

        <VendorSectionCard
          title="Invoices"
          icon={FiCreditCard}
          footerTo="/vendor-dashboard/invoices"
        >
          <div className="space-y-3">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice, index) => (
                <div
                  key={`${invoice.id}-${index}`}
                  className="grid gap-3 rounded-2xl border border-[#efefef] px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
                    <FiStar className="text-[22px]" />
                  </div>

                  <div className="min-w-0">
                    <p className="type-h5">
                      {invoice.eventName}
                    </p>
                    <p className="mt-1 type-para text-[#8d8d8d]">{invoice.date} • {invoice.id}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 type-h6 font-semibold ${getStatusClasses(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                    <p className="mt-2 type-h5 font-bold text-[#222222]">
                      {invoice.amount}
                    </p>
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
      </section>
    </div>
  );
}
