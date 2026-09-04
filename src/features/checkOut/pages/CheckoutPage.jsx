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
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const {
    applySavedAddress,
    carts,
    deliveryAddresses,
    deliverySlots,
    formState,
    handlePlaceOrder,
    handleRemoveItem,
    handleTipChange,
    handleTypeChange,
    handleDateChange,
    hasBlockingAvailabilityIssues,
    hasItems,
    hasLivePricing,
    invoiceAddresses,
    isAutofilling,
    checkoutErrorMessage,
    isDeliveryAddressEditing,
    isInvoiceAddressEditing,
    isLoadingPricing,
    isLoadingSlots,
    pricingError,
    isSubmittingOrder,
    normalizedType,
    checkoutActionLabel,
    checkoutAvailabilityMessage,
    requiredMinimumPersonCount,
    setIsDeliveryAddressEditing,
    setIsInvoiceAddressEditing,
    updateCartField,
    updateField,
  } = useCheckoutPage();

  if (!normalizedType) {
    return <Navigate to="/checkout/corporate" replace />;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <CheckoutHeader />

      <main className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[24px] border border-[#e8e1da] bg-white shadow-[0_16px_38px_rgba(55,34,19,0.05)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="min-w-0 p-4 sm:p-5">
              <CustomerTypeSelector
                normalizedType={normalizedType}
                onTypeChange={handleTypeChange}
              />

              <div className="mt-4 space-y-4">
                {checkoutErrorMessage ? (
                  <div className="rounded-[12px] border border-[#f2d8cb] bg-[#fff7f2] px-3 py-3 text-[13px] text-[#9a5838]">
                    {checkoutErrorMessage}
                  </div>
                ) : null}

                {pricingError ? (
                  <div className="rounded-[12px] border border-[#f2dfd0] bg-[#fff8f3] px-3 py-3 text-[13px] text-[#8a5a3b]">
                    {t("checkout.pricingUnavailable")}
                  </div>
                ) : null}

                {checkoutAvailabilityMessage &&
                checkoutAvailabilityMessage !== checkoutErrorMessage ? (
                  <div className="rounded-[12px] border border-[#f2dfd0] bg-[#fff8f3] px-3 py-3 text-[13px] text-[#8a5a3b]">
                    {checkoutAvailabilityMessage}
                  </div>
                ) : null}

                <ContactInfoSection
                  mode={normalizedType}
                  formState={formState}
                  updateField={updateField}
                />

                {isAutofilling ? (
                  <div className="rounded-[12px] border border-[#eadfd5] bg-[#fffaf6] px-3 py-3 text-[13px] text-[#7f6c5d]">
                    {t("checkout.loadingSavedDetails")}
                  </div>
                ) : null}

                <CheckoutSection
                  title={t("checkout.deliveryAddress")}
                  actions={
                    <CheckoutAddressControls
                      title={t("checkout.editAddress")}
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
                    title={t("checkout.currentDeliveryAddress")}
                    emptyText={t("checkout.deliveryAddressEmpty")}
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
                  title={t("checkout.invoiceAddress")}
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
                        {t("checkout.useDeliveryForInvoice")}
                      </label>

                      {!formState.invoiceSameAsDelivery ? (
                        <CheckoutAddressControls
                          title={t("checkout.editInvoiceAddress")}
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
                    title={t("checkout.currentInvoiceAddress")}
                    emptyText={t("checkout.invoiceAddressEmpty")}
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
                  onDateChange={handleDateChange}
                  deliverySlots={deliverySlots}
                  isLoadingSlots={isLoadingSlots}
                  minimumPersonCount={requiredMinimumPersonCount}
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
                  canPlaceOrder={hasLivePricing && !hasBlockingAvailabilityIssues}
                  buttonLabel={checkoutActionLabel}
                  buttonHelpText={checkoutAvailabilityMessage}
                  isSubmitting={isSubmittingOrder}
                  isLoadingPricing={isLoadingPricing}
                  onTipChange={handleTipChange}
                  onRemoveItem={handleRemoveItem}
                  onPlaceOrder={handlePlaceOrder}
                />
              ) : (
                <aside className="flex min-h-[360px] items-center justify-center border-l border-[#d8d2ca] bg-white p-6 text-center">
                  <div>
                    <p className="type-h4 text-[#2d2d2d]">{t("checkout.emptyCartTitle")}</p>
                    <p className="type-subpara mt-2 text-[#6f675f]">
                      {t("checkout.emptyCartDescription")}
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
