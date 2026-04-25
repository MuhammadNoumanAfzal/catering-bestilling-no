import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import OrderDateFilter from "../components/orders/OrderDateFilter";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import OrderStatusSummaryCard from "../components/orders/OrderStatusSummaryCard";
import OrdersPagination from "../components/orders/OrdersPagination";
import OrdersTable from "../components/orders/OrdersTable";
import {
  vendorOrders,
  vendorOrderStatusSummary,
} from "../data/vendorDashboardData";
import {
  getRangeDays,
  isActiveOrder,
  normalizeOrderStatus,
  ORDER_TABS,
  ORDER_VIEW_TABS,
  PAGE_SIZE,
  parseOrderDate,
} from "../components/orders/orderUtils";

export default function VendorOrdersPage() {
  const [activeView, setActiveView] = useState("active");
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("last-month");
  const [customDateRange, setCustomDateRange] = useState({
    from: "2025-02-05",
    to: "2025-03-05",
  });
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dateMenuRef = useRef(null);

  const referenceDate = useMemo(() => {
    const timestamps = vendorOrders.map((order) => parseOrderDate(order.date).getTime());
    return new Date(Math.max(...timestamps));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setIsDateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const rangeDays = getRangeDays(selectedRange);

    return vendorOrders.filter((order) => {
      const matchesView =
        activeView === "active" ? isActiveOrder(order.status) : true;
      const matchesTab =
        activeTab === "all"
          ? true
          : normalizeOrderStatus(order.status) === activeTab;
      const orderDate = parseOrderDate(order.date);
      const diffInDays = Math.floor(
        (referenceDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const matchesRange =
        selectedRange === "this-year"
          ? orderDate.getFullYear() === referenceDate.getFullYear()
          : selectedRange === "custom-date"
            ? (() => {
                if (!customDateRange.from || !customDateRange.to) {
                  return true;
                }

                const fromDate = new Date(`${customDateRange.from}T00:00:00`);
                const toDate = new Date(`${customDateRange.to}T23:59:59`);
                return orderDate >= fromDate && orderDate <= toDate;
              })()
            : rangeDays === null
              ? true
              : diffInDays >= 0 && diffInDays <= rangeDays;

      if (!matchesView || !matchesTab || !matchesRange) {
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
  }, [
    activeTab,
    activeView,
    customDateRange,
    referenceDate,
    searchValue,
    selectedRange,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const startIndex =
    filteredOrders.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, filteredOrders.length);
  const activeOrdersCount = vendorOrders.filter((order) =>
    isActiveOrder(order.status),
  ).length;

  function handleTabChange(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleViewChange(view) {
    setActiveView(view);
    setActiveTab("all");
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
        <p className="mt-2 type-para text-[#635b53]">
          Track active orders and quickly review recently placed orders.
        </p>
      </section>

      <section>
        <h2 className="type-h3 font-extrabold text-[#121212]">Quick Status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vendorOrderStatusSummary.map((item) => (
            <OrderStatusSummaryCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#ddd4cb] bg-[linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-4 shadow-[0_18px_40px_rgba(28,28,28,0.07)] md:p-6">
        <div className="rounded-[24px] border border-[#efe4db] bg-[linear-gradient(180deg,#fffaf6_0%,#fffdfb_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <div className="flex flex-col gap-4 border-b border-[#ece4dc] pb-5">
            <div className="hide-scrollbar overflow-x-auto">
              <div className="flex min-w-max items-center gap-3 pr-1">
                {ORDER_VIEW_TABS.map((tab) => {
                  const isActive = tab.value === activeView;
                  const count =
                    tab.value === "active" ? activeOrdersCount : vendorOrders.length;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleViewChange(tab.value)}
                      className={[
                        "inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-semibold shadow-[0_6px_16px_rgba(31,19,8,0.04)] transition",
                        isActive
                          ? "border-[#f0b79e] bg-[linear-gradient(180deg,#fff1e8_0%,#ffe7da_100%)] text-[#cf5c2f]"
                          : "border-[#e5dad0] bg-white text-[#3c352f] hover:bg-[#faf5f0]",
                      ].join(" ")}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          isActive
                            ? "bg-[#cf6e38] text-white"
                            : "bg-[#f7efe8] text-[#7a7067]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}

                {(activeView === "active"
                  ? ORDER_TABS.filter(
                      (tab) =>
                        tab.value === "all" ||
                        tab.value === "draft" ||
                        tab.value === "scheduled",
                    )
                  : ORDER_TABS
                ).map((tab) => {
                  const isActive = tab.value === activeTab;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleTabChange(tab.value)}
                      className={[
                        "min-w-[118px] rounded-full cursor-pointer border px-5 py-2.5 text-sm font-semibold transition",
                        isActive
                          ? "border-[#f0b79e] bg-[#ffe7da] text-[#cf5c2f] shadow-[0_8px_18px_rgba(207,110,56,0.12)]"
                          : "border-[#ddd4cb] bg-white text-[#1f1f1f] hover:bg-[#faf7f3]",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[22px] bg-white/90 p-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex w-full items-center gap-2.5 rounded-full border border-[#eadfd5] bg-[#fcfaf8] px-4 py-3 text-sm text-[#7a7a7a] shadow-[0_6px_16px_rgba(31,19,8,0.04)] lg:max-w-[360px]">
                <FiSearch className="text-[15px] text-[#b08b75]" />
                <input
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search Order ID, Vendor, Event..."
                  className="type-subpara w-full bg-transparent text-[#242424] outline-none placeholder:text-[#aaaaaa]"
                />
              </label>

              <div className="flex justify-end">
                <OrderDateFilter
                  customDateRange={customDateRange}
                  isOpen={isDateMenuOpen}
                  menuRef={dateMenuRef}
                  onSelect={(value) => {
                    setSelectedRange(value);
                    setCurrentPage(1);
                    if (value !== "custom-date") {
                      setIsDateMenuOpen(false);
                    }
                  }}
                  onCustomDateChange={(field, value) =>
                    setCustomDateRange((current) => ({
                      ...current,
                      [field]: value,
                    }))
                  }
                  onApplyCustomDate={() => {
                    setCurrentPage(1);
                    setIsDateMenuOpen(false);
                  }}
                  onToggle={() => setIsDateMenuOpen((open) => !open)}
                  referenceDate={referenceDate}
                  selectedRange={selectedRange}
                />
              </div>
            </div>
          </div>
        </div>

        <OrdersTable
          orders={visibleOrders}
          onOpenDetails={(order) => setSelectedOrder(order)}
        />

        <OrdersPagination
          currentPage={safeCurrentPage}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          totalItems={filteredOrders.length}
          totalPages={totalPages}
        />
      </section>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
