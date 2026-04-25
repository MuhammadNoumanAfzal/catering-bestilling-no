import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutSummaryPanel from "../components/CheckoutSummaryPanel";
import AdditionalInfoSection from "../components/checkoutPage/AdditionalInfoSection";
import CheckoutAddressFields from "../components/checkoutPage/CheckoutAddressFields";
import CheckoutSection from "../components/checkoutPage/CheckoutSection";
import ContactInfoSection from "../components/checkoutPage/ContactInfoSection";
import CustomerTypeSelector from "../components/checkoutPage/CustomerTypeSelector";
import EventDetailsSection from "../components/checkoutPage/EventDetailsSection";
import {
  createInitialFormState,
  VALID_TYPES,
} from "../components/checkoutPage/checkoutPage.constants";
import {
  clearAllStoredOrderSummaries,
  readAllStoredOrderSummaries,
  writeOrderSummary,
} from "../../vendor/utils/orderSummaryStorage";
import {
  confirmPlaceOrder,
  confirmRemoveItem,
  showOrderPlacedSuccess,
} from "../../../utils/alerts";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutType } = useParams();
  const [carts, setCarts] = useState([]);
  const [formState, setFormState] = useState(() => createInitialFormState());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const storedCarts = readAllStoredOrderSummaries();
    setCarts(storedCarts);
    setFormState(createInitialFormState(storedCarts[0]));
  }, []);

  useEffect(() => {
    carts.forEach(({ vendor, orderSummary }) => {
      writeOrderSummary(vendor.slug, orderSummary);
    });
  }, [carts]);

  const normalizedType = VALID_TYPES.includes(checkoutType)
    ? checkoutType
    : null;
  const hasItems = carts.some((cart) => cart.orderSummary.items.length > 0);

  const totalPersonCount = useMemo(
    () =>
      carts.reduce(
        (total, cart) => total + Number(cart.orderSummary.personCount ?? 0),
        0,
      ) || 20,
    [carts],
  );

  useEffect(() => {
    if (!hasItems) {
      return;
    }

    setFormState((current) => ({
      ...current,
      personCount: totalPersonCount,
    }));
  }, [hasItems, totalPersonCount]);

  if (!normalizedType) {
    return <Navigate to="/checkout/corporate" replace />;
  }

  const updateField = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const updateCartField = (key, value) => {
    setCarts((current) =>
      current.map((cart) => ({
        ...cart,
        orderSummary: {
          ...cart.orderSummary,
          [key]: value,
        },
      })),
    );
  };

  const handleTypeChange = (nextType) => {
    navigate(`/checkout/${nextType}`);
  };

  const handleTipChange = (vendorSlug, tipRate) => {
    setCarts((current) =>
      current.map((cart) =>
        cart.vendor.slug === vendorSlug
          ? {
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                tipRate,
              },
            }
          : cart,
      ),
    );
  };

  const handleTablewareChange = (vendorSlug, tableware) => {
    setCarts((current) =>
      current.map((cart) =>
        cart.vendor.slug === vendorSlug
          ? {
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                tableware,
              },
            }
          : cart,
      ),
    );
  };

  const handleRemoveItem = async (vendorSlug, itemId) => {
    const targetCart = carts.find((cart) => cart.vendor.slug === vendorSlug);
    const itemName = targetCart?.orderSummary.items.find((item) => item.id === itemId)?.name;
    const result = await confirmRemoveItem(itemName);

    if (!result.isConfirmed) {
      return;
    }

    setCarts((current) =>
      current
        .map((cart) => {
          if (cart.vendor.slug !== vendorSlug) {
            return cart;
          }

          const removedItem = cart.orderSummary.items.find(
            (item) => item.id === itemId,
          );

          return {
            ...cart,
            orderSummary: {
              ...cart.orderSummary,
              items: cart.orderSummary.items.filter((item) => item.id !== itemId),
              personCount: Math.max(
                1,
                cart.orderSummary.personCount -
                  (removedItem?.isAddOn
                    ? 0
                    : Number(removedItem?.totalServes ?? removedItem?.serves ?? 0)),
              ),
            },
          };
        })
        .filter((cart) => cart.orderSummary.items.length > 0),
    );
  };

  const handlePlaceOrder = async () => {
    const result = await confirmPlaceOrder();

    if (!result.isConfirmed) {
      return;
    }

    clearAllStoredOrderSummaries();
    await showOrderPlacedSuccess();
    navigate("/order-confirmed");
  };

  return (
    <div>
      <CheckoutHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden border border-[#d8d2ca]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0  p-3 sm:p-4">
              <CustomerTypeSelector
                normalizedType={normalizedType}
                onTypeChange={handleTypeChange}
              />

              <div className="mt-3 space-y-3">
                <ContactInfoSection
                  mode={normalizedType}
                  formState={formState}
                  updateField={updateField}
                />

                <CheckoutSection title="Delivery Address">
                  <CheckoutAddressFields
                    mode={normalizedType}
                    prefix="delivery"
                    formState={formState}
                    updateField={updateField}
                  />
                </CheckoutSection>

                <CheckoutSection title="Invoice Address">
                  <CheckoutAddressFields
                    mode={normalizedType}
                    prefix="invoice"
                    formState={formState}
                    updateField={updateField}
                  />
                </CheckoutSection>

                <EventDetailsSection
                  mode={normalizedType}
                  formState={formState}
                  updateField={updateField}
                  updateCartField={updateCartField}
                />

                <AdditionalInfoSection
                  value={formState.additionalInfo}
                  onChange={(value) => updateField("additionalInfo", value)}
                />
              </div>
            </section>

            <div className="flex min-h-full flex-col justify-between">
              {hasItems ? (
                <CheckoutSummaryPanel
                  carts={carts}
                  onTipChange={handleTipChange}
                  onRemoveItem={handleRemoveItem}
                  onTablewareChange={handleTablewareChange}
                  onPlaceOrder={handlePlaceOrder}
                />
              ) : (
                <aside className="flex min-h-[360px] items-center justify-center border-l border-[#d8d2ca] bg-white p-6 text-center">
                  <div>
                    <p className="type-h4 text-[#2d2d2d]">Your cart is empty</p>
                    <p className="type-subpara mt-2 text-[#6f675f]">
                      Add menu items before continuing to checkout.
                    </p>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
