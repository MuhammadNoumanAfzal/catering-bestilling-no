import { FiX } from "react-icons/fi";
import { getOrderStatusClasses } from "./orderUtils";

function getOrderDetailItems(order) {
  return (
    order.items ?? [
      {
        quantity: order.person,
        name: "Tasty Super Star Package",
        price: order.total,
        details: [
          "3 Meats: Smoked Pulled Pork, Gluten-Free Brisket, St. Louis Pork Ribs",
          "3 Sides: Potato Salad, BBQ Pinto Beans, Mac & Cheese",
          "Dessert: Banana Pudding",
          "Add: Black BBQ Sauce, Honey Mustard Sauce",
          "Packaging: Tray Packaging",
        ],
      },
    ]
  );
}

function getOrderMeta(order) {
  return {
    image: order.image ?? "/home/hero1.webp",
    invoiceId: order.invoiceId ?? "#INOV-33254",
    orderedDate: order.orderedDate ?? "01 Mar 2026",
    deliveredDate: order.deliveredDate ?? order.date,
    location: order.location ?? "House # 22 Bergen",
  };
}

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) {
    return null;
  }

  const items = getOrderDetailItems(order);
  const meta = getOrderMeta(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,22,15,0.45)] px-4 py-6 backdrop-blur-[6px]">
      <div className="relative max-h-[92vh] w-full max-w-[760px] overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] shadow-[0_30px_80px_rgba(24,18,14,0.24)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#ffd8bf_0%,rgba(255,216,191,0)_72%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 cursor-pointer rounded-full border border-white/70 bg-white/90 p-2.5 text-[#1f1f1f] shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition hover:bg-white"
          aria-label="Close order details"
        >
          <FiX className="text-[18px]" />
        </button>

        <div className="hide-scrollbar max-h-[92vh] overflow-y-auto">
          <div className="relative border-b border-[#efe6de] px-6 py-6 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#c67a4d]">
              Order Overview
            </p>
            <h2 className="mt-2 type-h2 text-[#1f1f1f]">Order details</h2>
          </div>

          <div className="px-6 pt-5">
            <div className="overflow-hidden rounded-[24px] border border-[#eee5dc] shadow-[0_18px_36px_rgba(40,26,15,0.10)]">
              <img
                src={meta.image}
                alt={order.eventName}
                className="h-[250px] w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="rounded-[22px] border border-[#efe5db] bg-[#fcf8f4] p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#5d554d]">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)] ${getOrderStatusClasses(order.status)}`}
                >
                  {order.status}
                </span>
                <p>
                  Vendor:{" "}
                  <span className="font-semibold text-[#1f1f1f]">{order.vendor}</span>
                </p>
                <p>
                  Order ID:{" "}
                  <span className="font-semibold text-[#1f1f1f]">{order.id}</span>
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Event
                  </p>
                  <p className="mt-1 type-h4 text-[#1f1f1f]">{order.eventName}</p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Guests
                  </p>
                  <p className="mt-1 type-h4 text-[#1f1f1f]">{order.person}</p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Total
                  </p>
                  <p className="mt-1 type-h4 text-[#1f1f1f]">{order.total}</p>
                </div>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between gap-3">
                <h3 className="type-h3 text-[#1f1f1f]">Items</h3>
                <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                  {items.length} item{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="rounded-[22px] border border-[#efe5db] bg-white p-4 shadow-[0_10px_24px_rgba(31,22,15,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="type-h4 text-[#1f1f1f]">
                          {item.quantity} {item.name}
                        </p>
                      </div>
                      <p className="type-h4 shrink-0 text-[#1f1f1f]">{item.price}</p>
                    </div>

                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[#72695f]">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#cf6e38]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-[#efe5db] bg-[linear-gradient(180deg,#fffaf6_0%,#fff 100%)] p-5 shadow-[0_12px_24px_rgba(31,22,15,0.05)]">
              <h3 className="type-h3 text-[#1f1f1f]">Order info</h3>
              <div className="mt-4 grid gap-4 text-sm text-[#5d554d] sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Invoice
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{meta.invoiceId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Order Date
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{meta.orderedDate}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Event
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{order.eventName}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Delivered On
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{meta.deliveredDate}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Persons
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{order.person}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    Location
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{meta.location}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between border-t border-[#ece4dc] bg-white/95 px-6 py-4 backdrop-blur-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a8572]">
                Grand Total
              </p>
              <p className="mt-1 type-subpara text-[#6e645a]">
                Includes the full order amount
              </p>
            </div>
            <p className="type-h2 text-[#1f1f1f]">{order.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
