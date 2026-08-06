import AddressBookSection from "../address/components/AddressBookSection";
import AddressPageActions from "../address/components/AddressPageActions";
import { translateAddress } from "../address/addressI18n";
import { useVendorAddressPage } from "../address/hooks/useVendorAddressPage";
import { useTranslation } from "react-i18next";

export default function VendorAddressPage() {
  const { t, i18n } = useTranslation();
  const at = (key, options) => translateAddress(t, i18n, key, options);
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
      <AddressBookSection
        type="delivery"
        title={at("deliveryTitle")}
        description={at("deliveryDescription")}
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
        title={at("invoiceTitle")}
        description={at("invoiceDescription")}
        addresses={invoiceAddresses}
        activeId={activeInvoiceId}
        onSelect={setActiveInvoiceId}
        onAdd={() => handleAdd("invoice")}
        onDelete={(addressId) => handleDelete("invoice", addressId)}
        onSetDefault={(addressId) => handleSetDefault("invoice", addressId)}
        onChangeField={(addressId, key, value) =>
          handleChangeField("invoice", addressId, key, value)
        }
        extraActionLabel={at("copyFromDelivery")}
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
