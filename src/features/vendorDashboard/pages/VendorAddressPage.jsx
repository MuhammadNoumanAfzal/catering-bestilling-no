import AddressBookSection from "../address/components/AddressBookSection";
import AddressPageActions from "../address/components/AddressPageActions";
import { useVendorAddressPage } from "../address/hooks/useVendorAddressPage";

export default function VendorAddressPage() {
  const {
    activeDeliveryId,
    activeInvoiceId,
    deliveryAddresses,
    handleAdd,
    handleChangeField,
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
      <AddressBookSection
        type="delivery"
        title="Delivery Addresses"
        description="Save multiple delivery locations and choose which one should autofill first during checkout."
        addresses={deliveryAddresses}
        activeId={activeDeliveryId}
        onSelect={setActiveDeliveryId}
        onAdd={() => handleAdd("delivery")}
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
        onSetDefault={(addressId) => handleSetDefault("invoice", addressId)}
        onChangeField={(addressId, key, value) =>
          handleChangeField("invoice", addressId, key, value)
        }
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
