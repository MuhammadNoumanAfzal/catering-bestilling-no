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
  buildCheckoutAddressFields,
  readSavedAddresses,
} from "../../../utils/customerProfileStorage";
import {
  confirmPlaceOrder,
  confirmRemoveItem,
  showOrderPlacedSuccess,
} from "../../../utils/alerts";

function formatAddressPreview(formState, prefix) {
  return [
    formState[`${prefix}Address`],
    formState[`${prefix}AddressLine2`],
    formState[`${prefix}City`],
    formState[`${prefix}PostalCode`],
  ]
    .filter(Boolean)
    .join(", ");
}

function CheckoutAddressControls({
  type,
  title,
  selectedAddressId,
  savedAddresses,
  onSelectAddress,
  isEditing,
  onToggleEditing,
}) {
  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={selectedAddressId}
          onChange={(event) => onSelectAddress(event.target.value)}
          className="type-subpara min-w-[170px] rounded-full border border-[#d8d0c7] bg-[#fcfaf8] px-3 py-2 text-[#37322f] outline-none"
        >
          {savedAddresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.label || "Saved address"}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onToggleEditing}
          className="rounded-full border border-[#efcdb7] bg-[#fff5ee] px-3.5 py-2 text-sm font-semibold text-[#c86434] transition hover:bg-[#fff0e6]"
        >
          {isEditing ? "Hide editor" : title}
        </button>
      </div>
      <p className="text-[12px] text-[#8b8177]">
        Auto-filled from saved addresses, but you can still customize it here.
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutType } = useParams();
  const [carts, setCarts] = useState([]);
  const [formState, setFormState] = useState(() => createInitialFormState());
  const [isDeliveryAddressEditing, setIsDeliveryAddressEditing] = useState(false);
  const [isInvoiceAddressEditing, setIsInvoiceAddressEditing] = useState(false);
  const deliveryAddresses = useMemo(() => readSavedAddresses("delivery"), []);
  const invoiceAddresses = useMemo(() => readSavedAddresses("invoice"), []);

  useEffect(() => {
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

  const applySavedAddress = (type, addressId) => {
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const selectedAddress = source.find((address) => address.id === addressId);

    if (!selectedAddress) {
      return;
    }

    setFormState((current) => ({
      ...current,
      ...buildCheckoutAddressFields(type, selectedAddress, current[`${type}Address`]),
    }));
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

                <CheckoutSection
                  title="Delivery Address"
                  actions={
                    <CheckoutAddressControls
                      type="delivery"
                      title="Edit address"
                      selectedAddressId={formState.selectedDeliveryAddressId}
                      savedAddresses={deliveryAddresses}
                      onSelectAddress={(addressId) => applySavedAddress("delivery", addressId)}
                      isEditing={isDeliveryAddressEditing}
                      onToggleEditing={() =>
                        setIsDeliveryAddressEditing((current) => !current)
                      }
                    />
                  }
                >
                  <div className="rounded-[12px] border border-[#eadfd5] bg-[#fffaf6] px-3 py-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a77b60]">
                      Current delivery address
                    </p>
                    <p className="mt-1 text-[14px] text-[#4a443f]">
                      {formatAddressPreview(formState, "delivery") ||
                        "Choose a saved delivery address or add a custom one."}
                    </p>
                  </div>

                  {isDeliveryAddressEditing ? (
                    <div className="mt-3">
                      <CheckoutAddressFields
                        mode={normalizedType}
                        prefix="delivery"
                        formState={formState}
                        updateField={updateField}
                      />
                    </div>
                  ) : null}
                </CheckoutSection>

                <CheckoutSection
                  title="Invoice Address"
                  actions={
                    <CheckoutAddressControls
                      type="invoice"
                      title="Edit invoice address"
                      selectedAddressId={formState.selectedInvoiceAddressId}
                      savedAddresses={invoiceAddresses}
                      onSelectAddress={(addressId) => applySavedAddress("invoice", addressId)}
                      isEditing={isInvoiceAddressEditing}
                      onToggleEditing={() =>
                        setIsInvoiceAddressEditing((current) => !current)
                      }
                    />
                  }
                >
                  <div className="rounded-[12px] border border-[#eadfd5] bg-[#fffaf6] px-3 py-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a77b60]">
                      Current invoice address
                    </p>
                    <p className="mt-1 text-[14px] text-[#4a443f]">
                      {formatAddressPreview(formState, "invoice") ||
                        "Choose a saved invoice address or add a custom one."}
                    </p>
                  </div>

                  {isInvoiceAddressEditing ? (
                    <div className="mt-3">
                      <CheckoutAddressFields
                        mode={normalizedType}
                        prefix="invoice"
                        formState={formState}
                        updateField={updateField}
                      />
                    </div>
                  ) : null}
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
