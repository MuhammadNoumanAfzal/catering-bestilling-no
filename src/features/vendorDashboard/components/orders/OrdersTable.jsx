import { getOrderStatusClasses } from "./orderUtils";

export default function OrdersTable({ orders }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-[760px] border-separate border-spacing-y-2">
        <thead>
          <tr className="type-subpara text-left uppercase tracking-[0.04em] text-[#7e776f]">
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
          {orders.map((order, index) => (
            <tr
              key={`${order.id}-${order.date}-${index}`}
              className="rounded-2xl bg-[#fcfbf9] text-sm text-[#232323] shadow-[0_2px_8px_rgba(20,20,20,0.03)]"
            >
              <td className="rounded-l-2xl px-3 py-3 font-semibold">{order.id}</td>
              <td className="px-3 py-3">{order.vendor}</td>
              <td className="px-3 py-3">{order.eventName}</td>
              <td className="px-3 py-3">{order.date}</td>
              <td className="px-3 py-3">{order.person}</td>
              <td className="px-3 py-3 font-semibold">{order.total}</td>
              <td className="rounded-r-2xl px-3 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-sm text-[#777777]">
          No orders matched your current filter.
        </div>
      ) : null}
    </div>
  );
}
