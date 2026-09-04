import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OrderItemCard from "./OrderItemCard";
import PriceDetailsCard from "./PriceDetailsCard";
import TipSelector from "./TipSelector";
import {
  getItemPrice,
  getVendorTotals,
  sortSummaryItems,
} from "./checkoutSummaryUtils";

export default function VendorSummaryCard({
  cart,
  onTipChange,
  onRemoveItem,
}) {
  const { t } = useTranslation();
  const personCount = cart.orderSummary.personCount;
  const items = sortSummaryItems(cart.orderSummary.items).map((item) => ({
    ...item,
    effectivePrice: getItemPrice(item, personCount),
  }));
  const {
    subtotal,
    deliveryFee,
    salesTax,
    addOnsTotal,
    tipValue,
    discountAmount,
    serviceFee,
  } = getVendorTotals(cart);

  return (
    <section className="border-t border-[#eee7e0] pt-3 first:border-t-0 first:pt-0">
      <div className="rounded-[12px] bg-[#faf4ee] p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b77a57]">
              {t("checkout.vendor")}
            </p>
            <p className="mt-0.5 text-[17px] font-semibold leading-tight text-[#2c2c2c]">
              {cart.vendor.name}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#d46331]">
            <FiShoppingBag className="text-[16px]" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-[#2c2c2c]">{t("checkout.orderItems")}</p>
            <p className="mt-0.5 text-[11px] text-[#8b8580]">
              {t("checkout.reviewBeforePlace")}
            </p>
          </div>

          <Link
            to={`/vendor/${cart.vendor.slug}`}
            className="cursor-pointer text-[12px] font-semibold text-[#cf6e38]"
          >
            {t("checkout.editCart")}
          </Link>
        </div>

        <div className="mt-2.5 space-y-2">
          {items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              personCount={personCount}
              vendorSlug={cart.vendor.slug}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>

        <PriceDetailsCard
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          salesTax={salesTax}
          addOnsTotal={addOnsTotal}
          tipValue={tipValue}
          discountAmount={discountAmount}
          serviceFee={serviceFee}
        />

        <TipSelector
          selectedTipRate={cart.orderSummary.tipRate}
          customTipAmount={cart.orderSummary.customTipAmount}
          onSelect={(tipRate, customAmount) =>
            onTipChange(cart.vendor.slug, tipRate, customAmount)
          }
        />
      </div>
    </section>
  );
}
