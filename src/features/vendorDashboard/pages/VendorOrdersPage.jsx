import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { ModifyOrderModal } from "../../order";
import {
  mapOrderToModifyForm,
  submitOrderModification,
} from "../../order/api/orderModificationService";
import OrderDateFilter from "../components/orders/OrderDateFilter";
import DashboardPageHero from "../components/DashboardPageHero";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import OrderStatusSummaryCard from "../components/orders/OrderStatusSummaryCard";
import OrdersPagination from "../components/orders/OrdersPagination";
import OrdersTable from "../components/orders/OrdersTable";
import {
  clearSelectedOrderDetail,
  fetchClientOrderDetail,
  fetchClientOrders,
} from "../ordersSlice";
import {
  getRangeDays,
  isActiveOrder,
  isOrderDateValid,
  normalizeOrderStatus,
  ORDER_TABS,
  ORDER_VIEW_TABS,
  PAGE_SIZE,
  parseOrderDate,
} from "../components/orders/orderUtils";

function OrdersErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[24px] border border-[#f1c8bb] bg-[#fff5f1] p-6 text-center shadow-[0_12px_24px_rgba(32,32,32,0.04)]">
      <h2 className="text-lg font-semibold text-[#3a2218]">
        Unable to load orders
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

export default function VendorOrdersPage() {
  const [activeView, setActiveView] = useState("active");
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("all-time");
  const [customDateRange, setCustomDateRange] = useState({
    from: "",
    to: "",
  });
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isModifySaving, setIsModifySaving] = useState(false);
  const [modifyError, setModifyError] = useState("");
  const dateMenuRef = useRef(null);

  const dispatch = useDispatch();
  const {
    orders,
    statusSummary,
    isLoading,
    error,
    selectedOrderDetail,
    selectedOrderDetailStatus,
    selectedOrderDetailError,
  } = useSelector((state) => state.orders);
  const normalizedOrders = Array.isArray(orders) ? orders : [];
  const normalizedStatusSummary = Array.isArray(statusSummary)
    ? statusSummary
    : [];

  useEffect(() => {
    dispatch(fetchClientOrders());
  }, [dispatch]);

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

  const referenceDate = useMemo(() => {
    const validDates = normalizedOrders
      .map((order) => order.eventDateRaw || order.createdOnRaw || order.date)
      .filter(isOrderDateValid)
      .map((dateValue) => parseOrderDate(dateValue).getTime());

    if (validDates.length === 0) {
      return new Date();
    }

    return new Date(Math.max(...validDates));
  }, [normalizedOrders]);

  const filteredOrders = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const rangeDays = getRangeDays(selectedRange);

    return normalizedOrders.filter((order) => {
      const orderDateSource = order.eventDateRaw || order.createdOnRaw || order.date;
      const orderDate = parseOrderDate(orderDateSource);
      const hasValidOrderDate = !Number.isNaN(orderDate.getTime());
      const matchesView =
        activeView === "active" ? isActiveOrder(order.status) : true;
      const matchesTab =
        selectedTabs.length === 0 || selectedTabs.includes("all")
          ? true
          : selectedTabs.includes(normalizeOrderStatus(order.status));

      let matchesRange = true;

      if (selectedRange === "this-year" && hasValidOrderDate) {
        matchesRange = orderDate.getFullYear() === referenceDate.getFullYear();
      } else if (selectedRange === "custom-date") {
        if (customDateRange.from && customDateRange.to && hasValidOrderDate) {
          const fromDate = new Date(`${customDateRange.from}T00:00:00`);
          const toDate = new Date(`${customDateRange.to}T23:59:59`);
          matchesRange = orderDate >= fromDate && orderDate <= toDate;
        }
      } else if (rangeDays !== null && hasValidOrderDate) {
        const diffInDays = Math.floor(
          (referenceDate.getTime() - orderDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        matchesRange = diffInDays >= 0 && diffInDays <= rangeDays;
      }

      if (!matchesView || !matchesTab || !matchesRange) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        order.id,
        order.vendor,
        order.eventName,
        order.date,
        order.status,
        order.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [
    activeView,
    customDateRange,
    normalizedOrders,
    referenceDate,
    searchValue,
    selectedTabs,
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
  const activeOrdersCount = normalizedOrders.filter((order) =>
    isActiveOrder(order.status),
  ).length;

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  function handleTabChange(tab) {
    setSelectedTabs((current) => {
      if (tab === "all") {
        return [];
      }

      const nextTabs = current.includes(tab)
        ? current.filter((item) => item !== tab)
        : [...current.filter((item) => item !== "all"), tab];

      return nextTabs;
    });
    setCurrentPage(1);
  }

  function handleViewChange(view) {
    setActiveView(view);
    setSelectedTabs((current) => {
      if (view !== "active") {
        return current.filter((tab) => tab !== "all");
      }

      const allowedTabs = ["draft", "scheduled"];
      return current.filter((tab) => allowedTabs.includes(tab));
    });
    setCurrentPage(1);
  }

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  }

  function handleOpenDetails(order) {
    setSelectedOrder(order);
    dispatch(fetchClientOrderDetail(order.rawId || order.id));
  }

  function handleCloseDetails() {
    setIsModifyModalOpen(false);
    setModifyError("");
    setSelectedOrder(null);
    dispatch(clearSelectedOrderDetail());
  }

  async function handleModifySave(nextValues) {
    const targetOrder = selectedOrderDetail || selectedOrder;
    const orderId = targetOrder?.rawId || targetOrder?.orderId || targetOrder?.id;

    if (!orderId) {
      await showAuthErrorAlert(
        "This order does not have a valid id for modification.",
        "Modify order failed",
      );
      return;
    }

    setIsModifySaving(true);
    setModifyError("");

    try {
      const result = await submitOrderModification({
        orderId,
        ...nextValues,
      });
      await Promise.all([
        dispatch(fetchClientOrders()),
        dispatch(fetchClientOrderDetail(orderId)),
      ]);
      await showSuccessToast(result.message);
      setIsModifyModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to modify this order right now.";
      setModifyError(message);
    } finally {
      setIsModifySaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf5c2f] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <OrdersErrorState
        message={error}
        onRetry={() => dispatch(fetchClientOrders())}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHero
        eyebrow="Operations"
        title="Orders"
        description="Track active orders, review history, and keep every event moving on schedule from one focused workspace."
        stats={[
          {
            label: "All Orders",
            value: normalizedOrders.length,
            note: "Everything currently loaded from the API.",
          },
          {
            label: "Active Now",
            value: activeOrdersCount,
            note: "Orders that still need operational attention.",
          },
          {
            label: "Filtered",
            value: filteredOrders.length,
            note: "Matching your current view and filters.",
          },
          {
            label: "Pages",
            value: totalPages,
            note: "Scrollable order archive pages available.",
          },
        ]}
      />

      <section>
        <h2 className="type-h3 font-extrabold text-[#121212]">Quick Status</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {normalizedStatusSummary.map((item) => (
            <OrderStatusSummaryCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e6d9cd] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f3_100%)] p-3 shadow-[0_22px_44px_rgba(28,28,28,0.08)] sm:p-4 md:p-6">
        <div className="rounded-[24px] border border-[#efe4db] bg-[linear-gradient(180deg,#fffaf6_0%,#fffdfb_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:p-4">
          <div className="flex flex-col gap-4 border-b border-[#ece4dc] pb-5">
            <div className="hide-scrollbar overflow-x-auto">
              <div className="flex min-w-max items-center gap-3 pr-1">
                {ORDER_VIEW_TABS.map((tab) => {
                  const isActive = tab.value === activeView;
                  const count =
                    tab.value === "active"
                      ? activeOrdersCount
                      : normalizedOrders.length;

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
                  const isActive =
                    tab.value === "all"
                      ? activeView !== "active" && selectedTabs.length === 0
                      : selectedTabs.includes(tab.value);

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

            <div className="flex flex-col gap-3 rounded-[18px] bg-white/90 p-2.5 sm:rounded-[22px] sm:p-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex w-full items-center gap-2.5 rounded-full border border-[#eadfd5] bg-[#fcfaf8] px-4 py-3 text-sm text-[#7a7a7a] shadow-[0_6px_16px_rgba(31,19,8,0.04)] lg:max-w-[360px]">
                <FiSearch className="text-[15px] text-[#b08b75]" />
                <input
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search Order ID, Vendor, Event..."
                  className="type-subpara w-full bg-transparent text-[#242424] outline-none placeholder:text-[#aaaaaa]"
                />
              </label>

              <div className="flex w-full justify-stretch sm:justify-end">
                <OrderDateFilter
                  customDateRange={customDateRange}
                  defaultRange="all-time"
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

          <OrdersTable
            orders={visibleOrders}
            onOpenDetails={handleOpenDetails}
          />

          <OrdersPagination
            currentPage={safeCurrentPage}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            startIndex={startIndex}
            totalItems={filteredOrders.length}
            totalPages={totalPages}
          />
        </div>
      </section>

      <OrderDetailsModal
        order={selectedOrderDetail || selectedOrder}
        isLoading={selectedOrderDetailStatus === "loading"}
        error={selectedOrderDetailError}
        isOpen={Boolean(selectedOrder)}
        onClose={handleCloseDetails}
        onModify={() => {
          setModifyError("");
          setIsModifyModalOpen(true);
        }}
      />

      {isModifyModalOpen ? (
        <ModifyOrderModal
          error={modifyError}
          initialValue={mapOrderToModifyForm(selectedOrderDetail || selectedOrder)}
          isLoading={selectedOrderDetailStatus === "loading"}
          isSaving={isModifySaving}
          onCancel={() => setIsModifyModalOpen(false)}
          onSave={handleModifySave}
        />
      ) : null}
    </div>
  );
}
