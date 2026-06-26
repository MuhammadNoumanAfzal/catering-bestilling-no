import AddressBookSection from "../address/components/AddressBookSection";
import AddressPageActions from "../address/components/AddressPageActions";
import DashboardPageHero from "../components/DashboardPageHero";
import { useVendorAddressPage } from "../address/hooks/useVendorAddressPage";

export default function VendorAddressPage() {
  const {
    activeDeliveryId,
    activeInvoiceId,
    deliveryAddresses,
    handleAdd,
    handleChangeField,
    handleCopyDeliveryToInvoice,
    handleDelete,
    handleReset,
    handleSave,
    handleSetDefault,
    invoiceAddresses,
    isDirty,
    isLoading,
    isSaving,
    setActiveDeliveryId,
    setActiveInvoiceId,
  } = useVendorAddressPage();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHero
        eyebrow="Address book"
        title="Delivery & Invoice Addresses"
        description="Keep your default delivery and billing locations organized so checkout forms can autofill correctly every time."
        stats={[
          {
            label: "Delivery",
            value: deliveryAddresses.length,
            note: "Saved delivery locations available.",
          },
          {
            label: "Invoice",
            value: invoiceAddresses.length,
            note: "Saved billing addresses ready to use.",
          },
          {
            label: "Changes",
            value: isDirty ? "Unsaved" : "Saved",
            note: isDirty
              ? "Address edits are waiting to be saved."
              : "Address book is synced.",
          },
          {
            label: "Status",
            value: isSaving ? "Saving" : "Ready",
            note: "Current address book sync state.",
          },
        ]}
      />

      <AddressBookSection
        type="delivery"
        title="Delivery Addresses"
        description="Save multiple delivery locations and choose which one should autofill first during checkout."
        addresses={deliveryAddresses}
        activeId={activeDeliveryId}
        onSelect={setActiveDeliveryId}
        onAdd={() => handleAdd("delivery")}
        onDelete={(addressId) => handleDelete("delivery", addressId)}
        onSetDefault={(addressId) => handleSetDefault("delivery", addressId)}
        onChangeField={(addressId, key, value) =>
          handleChangeField("delivery", addressId, key, value)
        }
      />

      <AddressBookSection
        type="invoice"
        title="Invoice Addresses"
        description="Keep separate billing locations ready so the checkout form can pull the right invoice address automatically."
        addresses={invoiceAddresses}
        activeId={activeInvoiceId}
        onSelect={setActiveInvoiceId}
        onAdd={() => handleAdd("invoice")}
        onDelete={(addressId) => handleDelete("invoice", addressId)}
        onSetDefault={(addressId) => handleSetDefault("invoice", addressId)}
        onChangeField={(addressId, key, value) =>
          handleChangeField("invoice", addressId, key, value)
        }
        extraActionLabel="Copy from delivery"
        onExtraAction={handleCopyDeliveryToInvoice}
        isExtraActionDisabled={deliveryAddresses.length === 0}
      />

      <AddressPageActions
        isDirty={isDirty}
        isSaving={isSaving}
        onReset={handleReset}
        onSave={handleSave}
      />
    </div>
  );
}
