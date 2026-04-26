import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { getOrderStatusClasses } from "./orderUtils";

export default function OrdersTable({ orders, onOpenDetails }) {
  const [openMenuKey, setOpenMenuKey] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuKey(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-4">
      <div className="overflow-x-auto hidden md:block">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="type-subpara text-left uppercase tracking-[0.04em] text-[#7e776f]">
            <th className="px-3 py-2">Sr.</th>
            <th className="px-3 py-2">Order ID</th>
            <th className="px-3 py-2">Vendor</th>
            <th className="px-3 py-2">Event Name</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Person</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={`${order.id}-${order.date}-${index}`}
              className="rounded-2xl bg-[#fcfbf9] text-sm text-[#232323] shadow-[0_2px_8px_rgba(20,20,20,0.03)]"
            >
              <td className="rounded-l-2xl px-3 py-3 text-[#8d857d]">{index + 1}</td>
              <td className="px-3 py-3 font-semibold">{order.id}</td>
              <td className="px-3 py-3">{order.vendor}</td>
              <td className="max-w-[180px] truncate px-3 py-3">{order.eventName}</td>
              <td className="px-3 py-3">{order.date}</td>
              <td className="px-3 py-3">{order.person}</td>
              <td className="px-3 py-3 font-semibold">{order.total}</td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="rounded-r-2xl px-3 py-3">
                <div className="relative flex justify-center" ref={openMenuKey === `${order.id}-${index}` ? menuRef : null}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuKey((current) =>
                        current === `${order.id}-${index}` ? null : `${order.id}-${index}`,
                      )
                    }
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e5ddd5] bg-white text-[#5f5750] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
                    aria-label={`Open actions for ${order.id}`}
                  >
                    <FiMoreHorizontal className="text-[16px]" />
                  </button>

                  {openMenuKey === `${order.id}-${index}` ? (
                    <div className="absolute right-0 top-11 z-10 min-w-[120px] rounded-[14px] border border-[#e8dfd7] bg-white p-2 shadow-[0_14px_30px_rgba(24,24,24,0.10)]">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenDetails(order);
                          setOpenMenuKey(null);
                        }}
                        className="w-full cursor-pointer rounded-[10px] px-3 py-2 text-left text-sm font-medium text-[#2a2a2a] transition hover:bg-[#f8f4ef]"
                      >
                        Details
                      </button>
                    </div>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="space-y-3 md:hidden">
        {orders.map((order, index) => (
          <article
            key={`${order.id}-${order.date}-mobile-${index}`}
            className="rounded-[20px] border border-[#e8dfd7] bg-[#fcfbf9] p-4 shadow-[0_8px_20px_rgba(20,20,20,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a8f84]">
                  Order #{index + 1}
                </p>
                <p className="mt-1 text-base font-semibold text-[#232323]">
                  {order.id}
                </p>
                <p className="mt-1 text-sm text-[#6b635c]">{order.vendor}</p>
              </div>

              <button
                type="button"
                onClick={() => onOpenDetails(order)}
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#e5ddd5] bg-white text-[#5f5750] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
                aria-label={`Open actions for ${order.id}`}
              >
                <FiMoreHorizontal className="text-[16px]" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[16px] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#998d82]">
                  Event
                </p>
                <p className="mt-1 text-sm font-medium text-[#242424]">
                  {order.eventName}
                </p>
              </div>
              <div className="rounded-[16px] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#998d82]">
                  Date
                </p>
                <p className="mt-1 text-sm font-medium text-[#242424]">
                  {order.date}
                </p>
              </div>
              <div className="rounded-[16px] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#998d82]">
                  Guests
                </p>
                <p className="mt-1 text-sm font-medium text-[#242424]">
                  {order.person}
                </p>
              </div>
              <div className="rounded-[16px] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#998d82]">
                  Total
                </p>
                <p className="mt-1 text-sm font-semibold text-[#242424]">
                  {order.total}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
              >
                {order.status}
              </span>

              <button
                type="button"
                onClick={() => onOpenDetails(order)}
                className="text-sm font-semibold text-[#cf6e38]"
              >
                View details
              </button>
            </div>
          </article>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-sm text-[#777777]">
          No orders matched your current filter.
        </div>
      ) : null}
    </div>
  );
}
