import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import {
  vendorOrders,
  vendorOrderStatusSummary,
} from "../data/vendorDashboardData";

const ORDER_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Drafts", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
];

const PAGE_SIZE = 8;

function getStatusClasses(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "completed" || normalizedStatus === "delivered") {
    return "bg-[#d9f5da] text-[#2ca44f]";
  }

  if (normalizedStatus === "scheduled") {
    return "bg-[#e0ebff] text-[#4477d7]";
  }

  return "bg-[#ececec] text-[#676767]";
}

function StatusSummaryCard({ label, value }) {
  return (
    <article className="rounded-[18px] border border-[#d9d1c8] bg-white px-6 py-5 text-center shadow-[0_8px_20px_rgba(30,30,30,0.04)]">
      <p className="text-[2rem] font-extrabold leading-none ">{value}</p>
      <p className="mt-2 type-para ">{label}</p>
    </article>
  );
}

export default function VendorOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return vendorOrders.filter((order) => {
      const matchesTab =
        activeTab === "all" ? true : order.status.toLowerCase() === activeTab;

      if (!matchesTab) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [order.id, order.vendor, order.eventName, order.date, order.status]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeTab, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const startIndex =
    filteredOrders.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, filteredOrders.length);
  const paginationNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).slice(0, 4);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">Orders</h1>
        <p className="mt-2 text-para ">
          Track, manage &amp; filter your all orders.
        </p>
      </section>

      <section>
        <h2 className="type-h3 font-extrabold text-[#121212]">Quick Status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vendorOrderStatusSummary.map((item) => (
            <StatusSummaryCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#ddd4cb] bg-white p-4 shadow-[0_12px_28px_rgba(28,28,28,0.06)] md:p-5">
        <div className="flex flex-col gap-3 border-b border-[#ece4dc] pb-4">
          <div className="flex flex-wrap gap-3">
            {ORDER_TABS.map((tab) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabChange(tab.value)}
                  className={[
                    "min-w-[112px] rounded-full cursor-pointer border px-5 py-2 type-h5  font-semibold transition",
                    isActive
                      ? "border-[#f0b79e] bg-[#ffe5d8] text-[#cf5c2f]"
                      : "border-[#d9d1c8] bg-white text-[#1f1f1f] hover:bg-[#faf7f3]",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex w-full items-center gap-2 rounded-full border border-[#ded6ce] bg-[#fcfaf8] px-4 py-2.5 text-sm text-[#7a7a7a] lg:max-w-[320px]">
              <FiSearch className="type-para" />
              <input
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search Order ID, Vendor, Event..."
                className="w-full bg-transparent text-sm text-[#242424] outline-none placeholder:text-[#aaaaaa]"
              />
            </label>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ded6ce] bg-white px-4 py-2.5 text-sm font-semibold cursor-pointer text-[#232323] transition hover:bg-[#faf7f3]"
            >
              <span>Last 7 days</span>
              <FiChevronDown className="type-para" />
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left type-parafont-semibold uppercase tracking-[0.04em] 
              ">
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Vendor</th>
                <th className="px-3 py-2">Event Name</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Person</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order, index) => (
                <tr
                  key={`${order.id}-${order.date}-${index}`}
                  className="rounded-2xl bg-[#fcfbf9] text-sm text-[#232323] shadow-[0_2px_8px_rgba(20,20,20,0.03)]"
                >
                  <td className="rounded-l-2xl px-3 py-3 font-semibold">
                    {order.id}
                  </td>
                  <td className="px-3 py-3">{order.vendor}</td>
                  <td className="px-3 py-3">{order.eventName}</td>
                  <td className="px-3 py-3">{order.date}</td>
                  <td className="px-3 py-3">{order.person}</td>
                  <td className="px-3 py-3 font-semibold">{order.total}</td>
                  <td className="rounded-r-2xl px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-sm text-[#777777]">
              No orders matched your current filter.
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#ece4dc] pt-4 text-sm text-[#666666] md:flex-row md:items-center md:justify-between">
          <p>
            Showing {startIndex} - {endIndex} of {filteredOrders.length} Orders
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#ddd4cb] text-[#6c6c6c] transition disabled:cursor-not-allowed disabled:opacity-45 hover:bg-[#faf7f3]"
            >
              <FiChevronLeft className="text-[14px]" />
            </button>

            {paginationNumbers.map((pageNumber) => {
              const isActive = pageNumber === safeCurrentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={[
                    "flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-semibold transition",
                    isActive
                      ? "bg-[#cf5c2f] text-white"
                      : "text-[#4d4d4d] hover:bg-[#faf7f3]",
                  ].join(" ")}
                >
                  {pageNumber}
                </button>
              );
            })}

            {totalPages > 4 ? <span className="px-1 text-xs">...</span> : null}

            {totalPages > 4 ? (
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                className={[
                  "flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-semibold transition",
                  totalPages === safeCurrentPage
                    ? "bg-[#cf5c2f] text-white"
                    : "text-[#4d4d4d] hover:bg-[#faf7f3]",
                ].join(" ")}
              >
                {totalPages}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#ddd4cb] text-[#6c6c6c] transition disabled:cursor-not-allowed disabled:opacity-45 hover:bg-[#faf7f3]"
            >
              <FiChevronRight className="text-[14px]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
