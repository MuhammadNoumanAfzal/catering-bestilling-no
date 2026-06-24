import { Navigate } from "react-router-dom";
import {
  AdditionalInfoSection,
  CheckoutAddressControls,
  CheckoutAddressFields,
  CheckoutAddressPreview,
  CheckoutHeader,
  CheckoutSection,
  CheckoutSummaryPanel,
  ContactInfoSection,
  CustomerTypeSelector,
  EventDetailsSection,
} from "../components";
import { useCheckoutPage } from "../hooks/useCheckoutPage";

export default function CheckoutPage() {
  const {
    applySavedAddress,
    carts,
    deliveryAddresses,
    formState,
    handlePlaceOrder,
    handleRemoveItem,
    handleTablewareChange,
    handleTipChange,
    handleTypeChange,
    hasItems,
    invoiceAddresses,
    isAutofilling,
    isDeliveryAddressEditing,
    isInvoiceAddressEditing,
    isSubmittingOrder,
    normalizedType,
    setIsDeliveryAddressEditing,
    setIsInvoiceAddressEditing,
    updateCartField,
    updateField,
  } = useCheckoutPage();

  if (!normalizedType) {
    return <Navigate to="/checkout/corporate" replace />;
  }

  return (
    <div>
      <CheckoutHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden border border-[#d8d2ca]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0 p-3 sm:p-4">
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

                {isAutofilling ? (
                  <div className="rounded-[12px] border border-[#eadfd5] bg-[#fffaf6] px-3 py-3 text-[13px] text-[#7f6c5d]">
                    Loading your saved account details...
                  </div>
                ) : null}

                <CheckoutSection
                  title="Delivery Address"
                  actions={
                    <CheckoutAddressControls
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
                  <CheckoutAddressPreview
                    formState={formState}
                    prefix="delivery"
                    title="Current delivery address"
                    emptyText="Choose a saved delivery address or add a custom one."
                  />

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
                    <div className="flex flex-col gap-3 sm:items-end">
                      <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#5f564f]">
                        <input
                          type="checkbox"
                          checked={Boolean(formState.invoiceSameAsDelivery)}
                          onChange={(event) =>
                            updateField(
                              "invoiceSameAsDelivery",
                              event.target.checked,
                            )
                          }
                          className="h-4 w-4 accent-[#cf6e38]"
                        />
                        Use delivery address for invoice
                      </label>

                      {!formState.invoiceSameAsDelivery ? (
                        <CheckoutAddressControls
                          title="Edit invoice address"
                          selectedAddressId={formState.selectedInvoiceAddressId}
                          savedAddresses={invoiceAddresses}
                          onSelectAddress={(addressId) =>
                            applySavedAddress("invoice", addressId)
                          }
                          isEditing={isInvoiceAddressEditing}
                          onToggleEditing={() =>
                            setIsInvoiceAddressEditing((current) => !current)
                          }
                        />
                      ) : null}
                    </div>
                  }
                >
                  <CheckoutAddressPreview
                    formState={formState}
                    prefix="invoice"
                    title="Current invoice address"
                    emptyText="Choose a saved invoice address or add a custom one."
                  />

                  {isInvoiceAddressEditing && !formState.invoiceSameAsDelivery ? (
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
                  isSubmitting={isSubmittingOrder}
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
