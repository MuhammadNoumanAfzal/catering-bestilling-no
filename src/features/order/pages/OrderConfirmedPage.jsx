import { useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiArrowRight, FiEdit3, FiGrid, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import ModifyOrderModal from "../components/ModifyOrderModal";
import {
  readPlacedOrderDraft,
  writePlacedOrderDraft,
} from "../utils/placedOrderStorage";
import { writeOrderSummary } from "../../vendor/utils/orderSummaryStorage";
import { showSuccessToast } from "../../../utils/alerts";

function formatOrderPreview(orderDraft) {
  const primaryCart = orderDraft?.carts?.[0];
  const formState = orderDraft?.formState ?? {};
  const placedOrders = orderDraft?.placedOrders ?? [];
  const orderIds = placedOrders
    .map((order) => `${order.orderId ?? ""}`.trim())
    .filter(Boolean)
    .map((orderId) => (orderId.startsWith("#") ? orderId : `#${orderId}`));

  return {
    orderIds,
    address:
      formState.deliveryAddress ||
      primaryCart?.orderSummary?.deliveryAddress ||
      "",
    addressLine2: formState.deliveryAddressLine2 || "",
    city: formState.deliveryCity || "",
    postalCode: formState.deliveryPostalCode || "",
    date: formState.date || primaryCart?.orderSummary?.deliveryDate || "",
    time: formState.time || primaryCart?.orderSummary?.deliveryTime || "",
    personCount:
      formState.personCount || primaryCart?.orderSummary?.personCount || 20,
    additionalDetails: formState.additionalInfo || "",
  };
}

export default function OrderConfirmedPage() {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [placedOrderDraft, setPlacedOrderDraft] = useState(() =>
    readPlacedOrderDraft(),
  );
  const orderPreview = useMemo(
    () => formatOrderPreview(placedOrderDraft),
    [placedOrderDraft],
  );
  const primaryOrderId = orderPreview.orderIds[0] || "#23459";

  const handleModifySave = async (nextValues) => {
    if (!placedOrderDraft) {
      setIsModifyModalOpen(false);
      return;
    }

    const nextFormState = {
      ...placedOrderDraft.formState,
      deliveryAddress: nextValues.address,
      deliveryAddressLine2: nextValues.addressLine2,
      deliveryCity: nextValues.city,
      deliveryPostalCode: nextValues.postalCode,
      date: nextValues.date,
      time: nextValues.time,
      personCount: nextValues.personCount,
      additionalInfo: nextValues.additionalDetails,
    };

    const nextCarts = placedOrderDraft.carts.map((cart) => {
      const nextOrderSummary = {
        ...cart.orderSummary,
        deliveryAddress: nextValues.address,
        deliveryDate: nextValues.date,
        deliveryTime: nextValues.time,
        personCount: nextValues.personCount,
      };

      writeOrderSummary(cart.vendor.slug, nextOrderSummary);

      return {
        ...cart,
        orderSummary: nextOrderSummary,
      };
    });

    const nextPlacedOrderDraft = {
      ...placedOrderDraft,
      carts: nextCarts,
      formState: nextFormState,
    };

    writePlacedOrderDraft(nextPlacedOrderDraft);
    setPlacedOrderDraft(nextPlacedOrderDraft);

    setIsModifyModalOpen(false);
    await showSuccessToast("Modification request sent successfully");
  };

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[linear-gradient(180deg,#faf6f1_0%,#fffdf9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[28px] border border-[#e7ddd3] bg-white shadow-[0_24px_60px_rgba(48,31,17,0.08)]">
          <div className="border-b border-[#f0e5db] px-6 py-5 sm:px-8">
            <Link to="/" className="inline-flex cursor-pointer">
              <img
                src="/home/logo.png"
                alt="Lunsjavtale"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="px-6 py-10 text-center sm:px-8 sm:py-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1ea]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#cf6e38] text-white shadow-[0_10px_24px_rgba(207,110,56,0.28)]">
                <FaCheck className="text-[26px]" />
              </div>
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b77754]">
              Order placed successfully
            </p>
            <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[#201b17] sm:text-[42px]">
              Your catering order is confirmed
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-7 text-[#5f5a55]">
              We have received your request and sent it to the vendor. You will
              receive an email confirmation shortly with the final order details.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[20px] border border-[#eee4da] bg-[#fcf9f6] p-5 text-left sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  Status
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                  Confirmed
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  Order ID
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#cf6e38]">
                  {primaryOrderId}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  Next step
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                  Check your email inbox
                </p>
              </div>
            </div>

            {placedOrderDraft ? (
              <div className="mx-auto mt-5 grid max-w-2xl gap-4 rounded-[20px] border border-[#f0e5db] bg-white p-5 text-left sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                    Address
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                    {orderPreview.address || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                    Date
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                    {[orderPreview.date, orderPreview.time]
                      .filter(Boolean)
                      .join(" at ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                    Person Count
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                    {orderPreview.personCount}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#bb602d]"
              >
                <FiHome className="text-[16px]" />
                Back to Home
              </Link>

              <Link
                to="/browse/food-type"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
              >
                Browse Menus
                <FiArrowRight className="text-[16px]" />
              </Link>

              <Link
                to="/vendor-dashboard"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
              >
                Browse Dashboard
                <FiGrid className="text-[16px]" />
              </Link>

              {placedOrderDraft ? (
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
                >
                  Modify Order
                  <FiEdit3 className="text-[16px]" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isModifyModalOpen ? (
        <ModifyOrderModal
          initialValue={orderPreview}
          onCancel={() => setIsModifyModalOpen(false)}
          onSave={handleModifySave}
        />
      ) : null}
    </section>
  );
}
