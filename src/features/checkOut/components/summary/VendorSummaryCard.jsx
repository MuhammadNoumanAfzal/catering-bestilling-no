import { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import TablewareModal from "../../../../components/shared/TablewareModal";
import IncludedTablewareRow from "./IncludedTablewareRow";
import OrderItemCard from "./OrderItemCard";
import PriceDetailsCard from "./PriceDetailsCard";
import TipSelector from "./TipSelector";
import {
  getItemPrice,
  getVendorTotals,
  sortSummaryItems,
} from "./checkoutSummary.utils";

export default function VendorSummaryCard({
  cart,
  onTipChange,
  onRemoveItem,
  onTablewareChange,
}) {
  const [isTablewareModalOpen, setIsTablewareModalOpen] = useState(false);
  const personCount = cart.orderSummary.personCount;
  const items = sortSummaryItems(cart.orderSummary.items).map((item) => ({
    ...item,
    effectivePrice: getItemPrice(item, personCount),
  }));
  const { subtotal, deliveryFee, salesTax, tipValue } = getVendorTotals(cart);

  return (
    <section className="rounded-[18px] border border-[#e7dfd7] bg-white p-4 shadow-[0_10px_30px_rgba(45,31,20,0.08)]">
      <div className="rounded-[14px] bg-[linear-gradient(135deg,#fdf7f1_0%,#f6efe8_100%)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="type-h4 font-semibold uppercase tracking-[0.16em] text-[#b77a57]">
              Vendor
            </p>
            <p className="mt-1 type-h4 font-semibold leading-tight text-[#2c2c2c]">
              {cart.vendor.name}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#d46331] shadow-[0_6px_14px_rgba(212,99,49,0.14)]">
            <FiShoppingBag className="text-[18px]" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="type-h5 font-semibold text-[#2c2c2c]">Order items</p>
            <p className="mt-1 text-[12px] text-[#8b8580]">
              Review everything before placing the order
            </p>
          </div>

          <Link
            to={`/vendor/${cart.vendor.slug}`}
            className="cursor-pointer text-[14px] font-semibold text-[#cf6e38]"
          >
            Edit Cart
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              personCount={personCount}
              vendorSlug={cart.vendor.slug}
              onRemoveItem={onRemoveItem}
            />
          ))}

          <IncludedTablewareRow
            tableware={cart.orderSummary.tableware}
            onEdit={() => setIsTablewareModalOpen(true)}
          />
        </div>

        <PriceDetailsCard
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          salesTax={salesTax}
          tipValue={tipValue}
        />

        <TipSelector
          selectedTipRate={cart.orderSummary.tipRate}
          onSelect={(tipRate) => onTipChange(cart.vendor.slug, tipRate)}
        />
      </div>

      <TablewareModal
        isOpen={isTablewareModalOpen}
        initialValue={cart.orderSummary.tableware}
        onClose={() => setIsTablewareModalOpen(false)}
        onSave={(tableware) => {
          onTablewareChange(cart.vendor.slug, tableware);
          setIsTablewareModalOpen(false);
        }}
      />
    </section>
  );
}
