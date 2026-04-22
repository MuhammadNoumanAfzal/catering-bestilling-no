import {
  FiChevronRight,
  FiCreditCard,
  FiPackage,
  FiSettings,
  FiStar,
} from "react-icons/fi";
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
    return "bg-[#eff9ef] text-[#269847]";
  }

  if (normalizedStatus === "scheduled") {
    return "bg-[#eef4ff] text-[#3669c9]";
  }

  return "bg-[#fff3e8] text-[#c6792b]";
}

function VendorStatCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-[24px] border border-[#d9d9d9] bg-white p-5 shadow-[0_10px_24px_rgba(30,30,30,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
        <Icon className="text-[24px]" />
      </div>
      <p className="mt-5 text-sm font-medium text-[#595959]">{label}</p>
      <p className="mt-1 text-[2rem] font-extrabold leading-none text-[#1f1f1f]">
        {value}
      </p>
    </article>
  );
}

export default function VendorDashboardHomePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h3 text-[#191919]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#5f5f5f]">
          Welcome back, Raja. Here&apos;s an overview of your activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vendorStats.map((item) => (
          <VendorStatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <VendorSectionCard title="Recent Orders" icon={FiPackage}>
            <div className="space-y-3">
              {vendorRecentOrders.map((order, index) => (
                <div
                  key={`${order.id}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-[#efefef] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#222222]">
                      {order.id}
                    </p>
                    <p className="mt-1 text-xs text-[#8d8d8d]">{order.date}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </VendorSectionCard>

          <VendorSectionCard title="Settings" icon={FiSettings} footerLabel="Manage Settings">
            <div className="space-y-3">
              {vendorSettingsLinks.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-[#efefef] px-4 py-3 text-left transition hover:bg-[#faf7f3]"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="text-[16px] text-[#666666]" />
                    <span className="text-sm font-medium text-[#222222]">
                      {label}
                    </span>
                  </span>
                  <FiChevronRight className="text-[16px] text-[#9a9a9a]" />
                </button>
              ))}
            </div>
          </VendorSectionCard>
        </div>

        <VendorSectionCard title="Invoices" icon={FiCreditCard}>
          <div className="space-y-3">
            {vendorInvoices.map((invoice, index) => (
              <div
                key={`${invoice.id}-${index}`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-[#efefef] px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
                  <FiStar className="text-[16px]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#222222]">
                    {invoice.id}
                  </p>
                  <p className="mt-1 text-xs text-[#8d8d8d]">{invoice.date}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                  <p className="mt-2 text-sm font-bold text-[#222222]">
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
