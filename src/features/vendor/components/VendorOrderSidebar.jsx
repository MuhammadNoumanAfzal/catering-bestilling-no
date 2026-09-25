import { LuUtensilsCrossed } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import { promptSignInRequired, showAuthErrorAlert } from "../../../utils/alerts";
import {
  getItemPrice,
  getItemServes,
  getVendorTotals,
  sortSummaryItems,
} from "../../checkOut/components/summary/checkoutSummaryUtils";
import { validateOrderSummaryBasics } from "../../order/utils/orderFlowValidation";

const TIP_OPTIONS = [
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
  { label: "Other", value: "other" },
];

function formatCurrency(value) {
  const amount = Number(value ?? 0);
  const normalizedAmount = Math.abs(amount - Math.round(amount)) < 0.005
    ? Math.round(amount)
    : amount;

  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: Number.isInteger(normalizedAmount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(normalizedAmount);
}

function formatKr(value) {
  return formatCurrency(value);
}

function formatDateTime(date, time) {
  if (!date) {
    return "";
  }

  const parsed = new Date(`${date}T${time || "00:00"}`);

  if (Number.isNaN(parsed.getTime())) {
    return [date, time].filter(Boolean).join(", ");
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

export default function VendorOrderSidebar({
  vendor,
  orderSummary,
  minimumPersons = 1,
  isVendorAvailable = true,
  onRemoveItem,
  onTipChange,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onDeliveryAddressChange,
  onInvoiceAddressChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const items = sortSummaryItems(orderSummary.items).map((item) => ({
    ...item,
    price: getItemPrice(item, orderSummary.personCount),
    effectiveServes: getItemServes(item, orderSummary.personCount),
  }));
  const {
    subtotal,
    deliveryFee,
    salesTax,
    addOnsTotal,
    tipValue,
    grandTotal,
  } = getVendorTotals({
    vendor,
    orderSummary: {
      ...orderSummary,
      pricing: null,
    },
  });
  const hasItems = items.length > 0;
  const formattedDateTime = formatDateTime(
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
  );
  const restaurantName =
    vendor?.name ?? items[0]?.vendorName ?? "Selected restaurant";

  return (
    <aside className="rounded-none border-l border-[#e7dfd6] bg-[#fdfbf8]">
      <div className="sticky top-[84px] p-2 sm:p-3">
        {!hasItems ? (
          <div className="flex min-h-[720px] flex-col items-center justify-center text-center">
            <LuUtensilsCrossed className="text-[64px] text-[#9d9d9d]" />
            <p className="mt-4 type-h3 font-semibold text-[#1f1f1f]">
              {t("vendor.addItemsToCart")}
            </p>
          </div>
        ) : (
          <div className="border border-[#d8d2ca] bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <h2 className="text-center type-h3 font-extrabold uppercase tracking-[0.04em] ">
              {t("vendor.orderSummary")}
            </h2>

            <div className="mt-3 border-t border-[#ddd6cf] pt-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-[#e2ddd8] pb-4 pt-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-medium leading-5 type-h5 ">
                      {item.quantity} {item.name}
                    </p>
                    <p className="shrink-0 text-[14px] font-semibold ">
                      {formatKr(item.price)}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    {(item.details ?? [])
                      .filter(
                        (detail) =>
                          detail &&
                          !/^\d+\s*order/i.test(detail) &&
                          !/^(serves|serverer|holder til)/i.test(detail),
                      )
                      .map((detail) => (
                        <p
                          key={detail}
                          className="type-para font-medium leading-5 text-[#8b8580]"
                        >
                          - {detail}
                        </p>
                      ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="type-para text-[#76706a]">
                      {item.isAddOn
                        ? t("vendor.qty", { count: item.quantity })
                        : t("vendor.serves", { count: item.effectiveServes })}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="cursor-pointer type-para font-medium text-[#e05b46]"
                    >
                      {t("vendor.deleteItem")}
                    </button>
                  </div>
                </div>
              ))}

            </div>

            <div className="border-b border-[#e2ddd8] py-4 type-para ">
              <div className="flex items-center justify-between gap-3">
                <span>{t("vendor.subtotal")}</span>
                <span className="font-semibold ">
                  {formatKr(subtotal)}
                </span>
              </div>
              <p className="mt-1 type-para text-[#76706a]">{restaurantName}</p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>{t("vendor.deliveryFee")}</span>
                <span className="font-semibold text-[#76706a]">
                  {formatKr(deliveryFee)}
                </span>
              </div>

              {addOnsTotal > 0 ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span>{t("vendor.addOns")}</span>
                  <span className="font-semibold text-[#76706a]">
                    {formatKr(addOnsTotal)}
                  </span>
                </div>
              ) : null}


              <div className="mt-2 flex items-center justify-between gap-3">
                <span>{t("vendor.tip")}</span>
                <span className="font-semibold ">
                  {formatKr(tipValue)}
                </span>
              </div>
            </div>

            <div className="border-b border-[#e2ddd8] py-4">
              <p className="text-[13px] font-semibold ">{t("vendor.tip")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIP_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      if (orderSummary.tipRate === option.value) {
                        onTipChange(null, option.value === "other" ? "" : undefined);
                        return;
                      }

                      if (option.value === "other") {
                        onTipChange("other", orderSummary.customTipAmount ?? "");
                      } else {
                        onTipChange(option.value, 0);
                      }
                    }}
                    className={`rounded-full cursor-pointer border px-3 py-1 text-[13px] leading-5 transition ${
                      orderSummary.tipRate === option.value
                        ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                        : "border-[#d4cfc8] bg-white text-[#555555] hover:border-[#cf6e38]/40 hover:bg-[#fffaf6]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {orderSummary.tipRate === "other" && (
                <div className="mt-3 max-w-[200px]">
                  <label className="block text-[12px] font-medium text-[#8b8580]">
                    {t("vendor.customTipAmount")}
                  </label>
                  <div className="relative mt-1.5 rounded-[4px] shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">

                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={orderSummary.customTipAmount ?? ""}
                      onChange={(event) => onTipChange("other", event.target.value)}
                      className="block w-full rounded-[4px] border border-[#d4cfc8] py-1.5 pl-3 pr-3 text-[14px] text-[#2c2c2c] placeholder:text-[#a49b92] focus:border-[#cf6e38] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-[#e2ddd8] py-4">
              <h3 className="text-center type-h3 font-extrabold uppercase tracking-[0.04em] text-[#1d1d1d]">
                {t("menu.eventDetails")}
              </h3>

              <div className="mt-4">
                <p className="type-para font-semibold ">
                  {t("vendor.deliveryDateTime")}
                </p>
                <div className="mt-2 w-full border border-[#ddd6cf] px-3 py-3 text-left text-[14px] text-[#66605b]">
                  {formattedDateTime || t("vendor.selectDeliveryDateTime")}
                </div>
              </div>

              <div className="mt-4">
                <p className="type-para font-semibold ">{t("menu.personsLabel")}</p>
                <div className="mt-2 inline-flex items-center border border-[#d7d1ca] text-[14px] text-[#3a3a3a]">
                  <button
                    type="button"
                    onClick={() =>
                      onPersonCountChange(
                        Math.max(minimumPersons, orderSummary.personCount - 1),
                      )
                    }
                    className="h-8 w-8 border-r cursor-pointer border-[#d7d1ca]"
                  >
                    -
                  </button>
                  <span className="inline-flex min-w-[40px] justify-center px-3">
                    {orderSummary.personCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onPersonCountChange(orderSummary.personCount + 1)
                    }
                    className="h-8 w-8 border-l cursor-pointer border-[#d7d1ca]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center type-para text-[#55514d]">
                <p>
                  {t("vendor.location")}: {" "}{orderSummary.deliveryAddress || t("vendor.addDeliveryAddress")}
                </p>
              </div>
            </div>

            <div className="pt-3">
              <div className="rounded-[10px] border border-[#d9ead7] bg-[#f6fff5] px-3 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="type-h4 font-semibold text-[#1d1d1d]">{t("vendor.total")}</span>
                  <div className="text-right">
                    <span className="type-h4 font-semibold text-[#1d1d1d]">
                      {formatKr(grandTotal)}
                    </span>
                    <p className="mt-1 text-[11px] font-semibold leading-4 text-[#2f7a3e]">
                      {t("checkout.vatIncluded", { defaultValue: "VAT included" })}: {formatKr(salesTax)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!isLoggedIn) {
                    const result = await promptSignInRequired();

                    if (result.isConfirmed) {
                      navigate("/signin", {
                        state: {
                          from: {
                            pathname: "/checkout/corporate",
                          },
                        },
                      });
                    } else if (result.isDenied) {
                      navigate("/signup", {
                        state: {
                          from: {
                            pathname: "/checkout/corporate",
                          },
                        },
                      });
                    }

                    return;
                  }

                  const validationError = validateOrderSummaryBasics({
                    deliveryDate: orderSummary.deliveryDate,
                    deliveryTime: orderSummary.deliveryTime,
                    deliveryAddress: orderSummary.deliveryAddress,
                    personCount: orderSummary.personCount,
                    minimumPersons,
                    t,
                  });

                  if (validationError) {
                    await showAuthErrorAlert(
                      validationError,
                      t("vendor.orderDetailsRequired"),
                    );
                    return;
                  }

                  if (!isVendorAvailable) {
                    await showAuthErrorAlert(
                      t("vendor.unavailableSelectedTimeMessage"),
                      t("vendor.unavailableSelectedTimeTitle"),
                    );
                    return;
                  }

                  navigate("/checkout/corporate");
                }}
                className={`mt-4 w-full rounded-[4px] px-4 py-3 text-[15px] font-semibold text-white transition ${
                  isVendorAvailable
                    ? "cursor-pointer bg-[#cf6e38] hover:bg-[#bb602d]"
                    : "cursor-not-allowed bg-[#d7c5b9]"
                }`}
              >
                {t("vendor.checkout")}
              </button>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
}
