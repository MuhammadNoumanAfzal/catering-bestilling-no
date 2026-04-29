import { LuUtensilsCrossed } from "react-icons/lu";
import TablewareModal, {
  getSelectedTablewareCount,
  getTablewareSummaryText,
} from "../../../components/shared/TablewareModal";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { promptSignInRequired } from "../../../utils/alerts";

const TIP_OPTIONS = [
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.2 },
  { label: "Other", value: "other" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function extractAmount(value) {
  const matched = `${value ?? ""}`.match(/(\d+(?:\.\d+)?)/);
  return matched ? Number(matched[1]) : 0;
}

function getItemServes(item, personCount) {
  const baseServes = Number(item.totalServes ?? item.serves ?? 0);
  return Math.max(baseServes, Number(personCount ?? 0) || 0);
}

function getItemPrice(item, personCount) {
  const unitPrice = Number(item.unitPrice ?? 0);

  if (unitPrice > 0) {
    return unitPrice * getItemServes(item, personCount);
  }

  return Number(item.price ?? 0);
}

function sortSummaryItems(items) {
  return [...items].sort((left, right) => {
    if (left.isAddOn === right.isAddOn) {
      return 0;
    }

    return left.isAddOn ? 1 : -1;
  });
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
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

function IncludedTablewareRow({ tableware, onEdit }) {
  const selectedCount = getSelectedTablewareCount(tableware);
  const summaryText = getTablewareSummaryText(tableware);

  return (
    <div className="border-b border-[#e2ddd8] pb-4 pt-3">
      <div className="flex items-start justify-between gap-3">
        <p className="type-h5 leading-5 text-[#252525]">
          {selectedCount} Tableware
        </p>
        <p className="shrink-0 text-[14px] font-semibold text-[#252525]">
          NOK 0.00
        </p>
      </div>

      <p className="mt-2 type-para font-medium leading-5 text-[#8b8580]">
        - {summaryText}
      </p>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer type-para font-medium text-[#4f7cff]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default function VendorOrderSidebar({
  vendor,
  orderSummary,
  minimumPersons = 1,
  onRemoveItem,
  onTipChange,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  onPersonCountChange,
  onDeliveryAddressChange,
  onInvoiceAddressChange,
  onTablewareChange,
}) {
  const [isTablewareModalOpen, setIsTablewareModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const items = sortSummaryItems(orderSummary.items).map((item) => ({
    ...item,
    price: getItemPrice(item, orderSummary.personCount),
    effectiveServes: getItemServes(item, orderSummary.personCount),
  }));
  const foodAndBeverage = items.reduce((total, item) => total + item.price, 0);
  const restaurantDeliveryFee = extractAmount(vendor?.deliveryFee);
  const salesTax = foodAndBeverage * 0.15;
  const tipValue =
    typeof orderSummary.tipRate === "number"
      ? foodAndBeverage * orderSummary.tipRate
      : 0;
  const total = foodAndBeverage + restaurantDeliveryFee + salesTax + tipValue;
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
              Add items to your cart
            </p>
          </div>
        ) : (
          <div className="border border-[#d8d2ca] bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <h2 className="text-center type-h3 font-extrabold uppercase tracking-[0.04em] ">
              Order Summary
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
                      NOK {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    {(item.details ?? []).map((detail) => (
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
                      Serves {item.effectiveServes}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="cursor-pointer type-para font-medium text-[#e05b46]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <IncludedTablewareRow
                tableware={orderSummary.tableware}
                onEdit={() => setIsTablewareModalOpen(true)}
              />
            </div>

            <div className="border-b border-[#e2ddd8] py-4 type-para ">
              <div className="flex items-center justify-between gap-3">
                <span>Food &amp; beverage</span>
                <span className="font-semibold ">
                  NOK {formatCurrency(foodAndBeverage)}
                </span>
              </div>
              <p className="mt-1 type-para text-[#76706a]">{restaurantName}</p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Restaurant delivery fee</span>
                <span className="font-semibold text-[#76706a]">
                  NOK {formatCurrency(restaurantDeliveryFee)}
                </span>
              </div>
              <p className="mt-1 type-para text-[#76706a]">
                This is not a driver tip
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Sales Tax</span>
                <span className="font-semibold text-[#76706a]">
                  NOK {formatCurrency(salesTax)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Tip</span>
                <span className="font-semibold ">
                  NOK {formatCurrency(tipValue)}
                </span>
              </div>
            </div>

            <div className="border-b border-[#e2ddd8] py-4">
              <p className="text-[13px] font-semibold ">Tip</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIP_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => onTipChange(option.value)}
                    className={`rounded-full cursor-pointer border px-3 py-1 text-[13px] leading-5 ${
                      orderSummary.tipRate === option.value
                        ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                        : "border-[#d4cfc8] bg-white text-[#555555]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-[#e2ddd8] py-4">
              <h3 className="text-center type-h3 font-extrabold uppercase tracking-[0.04em] text-[#1d1d1d]">
                Event Details
              </h3>

              <div className="mt-4">
                <p className="type-para font-semibold ">
                  Delivery Date &amp; Time
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onDeliveryDateChange(orderSummary.deliveryDate);
                    onDeliveryTimeChange(orderSummary.deliveryTime);
                  }}
                  className="mt-2 w-full border border-[#ddd6cf] px-3 py-3 text-left text-[14px] text-[#66605b]"
                >
                  {formattedDateTime}
                </button>
              </div>

              <div className="mt-4">
                <p className="type-para font-semibold ">Person Count</p>
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
                <p>Location: {orderSummary.deliveryAddress}</p>
              </div>
            </div>

            <div className="pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="type-h4 font-semibold ">Total</span>
                <span className="type-h4  font-semibold ">
                  NOK {formatCurrency(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!isLoggedIn) {
                    const result = await promptSignInRequired();

                    if (result.isConfirmed) {
                      navigate("/signin", { state: { from: location } });
                    } else if (result.isDenied) {
                      navigate("/signup", { state: { from: location } });
                    }

                    return;
                  }

                  navigate("/checkout/corporate");
                }}
                className="mt-4 w-full cursor-pointer rounded-[4px] bg-[#cf6e38] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#bb602d]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <TablewareModal
        isOpen={isTablewareModalOpen}
        initialValue={orderSummary.tableware}
        onClose={() => setIsTablewareModalOpen(false)}
        onSave={(tableware) => {
          onTablewareChange(tableware);
          setIsTablewareModalOpen(false);
        }}
      />
    </aside>
  );
}
