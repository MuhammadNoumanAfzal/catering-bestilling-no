import {
  FiChevronRight,
  FiCreditCard,
  FiPackage,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import VendorSectionCard from "../components/VendorSectionCard";
import {
  vendorInvoices,
  vendorRecentOrders,
  vendorSettingsLinks,
  vendorStats,
} from "../data/vendorDashboardData";

function getStatusClasses(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "completed" || normalizedStatus === "delivered") {
    return "bg-[#b7eeb7] text-[#1aa541]";
  }

  if (normalizedStatus === "scheduled") {
    return "bg-[#c4d3ee] text-[#3669c9]";
  }

  return "bg-[#f3e3d4] text-[#cc7926]";
}

function VendorStatCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-[24px] border border-[#d9d9d9] bg-white p-5 shadow-[0_10px_24px_rgba(30,30,30,0.06)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
        <Icon className="text-[54px]" />
      </div>
      <p className="mt-5 type-h5">{label}</p>
      <p className="mt-4 text-[30px] font-extrabold leading-none text-[#1f1f1f]">
        {value}
      </p>
    </article>
  );
}

export default function VendorDashboardHomePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2">Dashboard</h1>
        <p className="mt-4 type-para">
          Welcome back, Nouman. Here&apos;s an overview of your activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vendorStats.map((item) => (
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
              {vendorRecentOrders.map((order, index) => (
                <div
                  key={`${order.id}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-[#efefef] px-4 py-3"
                >
                  <div>
                    <p className="type-h5">
                      {order.id}
                    </p>
                    <p className="mt-1 type-para text-[#8d8d8d]">{order.date}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 type-h6 font-semibold ${getStatusClasses(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
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
                  className="flex w-full items-center justify-between rounded-2xl border border-[#efefef] px-4 py-3 text-left transition hover:bg-[#faf7f3]"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="text-[22px] text-[#666666]" />
                    <span className="type-h5 text-[#222222]">{label}</span>
                  </span>
                  <FiChevronRight className="text-[22px] text-[#9a9a9a]" />
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
            {vendorInvoices.map((invoice, index) => (
              <div
                key={`${invoice.id}-${index}`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-[#efefef] px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
                  <FiStar className="text-[22px]" />
                </div>

                <div>
                  <p className="type-h5">
                    {invoice.id}
                  </p>
                  <p className="mt-1 type-para text-[#8d8d8d]">{invoice.date}</p>
                </div>

                <div className="text-right">
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
            ))}
          </div>
        </VendorSectionCard>
      </section>
    </div>
  );
}
