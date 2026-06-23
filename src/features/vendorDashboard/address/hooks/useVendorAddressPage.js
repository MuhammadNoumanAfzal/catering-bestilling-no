import { useMemo, useState, useEffect } from "react";
import { confirmRemoveItem, showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { createEmptyAddressEntry } from "../constants/addressBook";
import { deleteAddress, fetchAddressBook, saveAddressBook } from "../api";

function getDefaultActiveId(addresses) {
  return (
    addresses.find((address) => address.isDefault)?.id ??
    addresses[0]?.id ??
    ""
  );
}

function buildAddressBookSnapshot(deliveryAddresses, invoiceAddresses) {
  return {
    delivery: deliveryAddresses,
    invoice: invoiceAddresses,
  };
}

export function useVendorAddressPage() {
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [invoiceAddresses, setInvoiceAddresses] = useState([]);
  const [activeDeliveryId, setActiveDeliveryId] = useState("");
  const [activeInvoiceId, setActiveInvoiceId] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState({ delivery: [], invoice: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAddressBook() {
      try {
        const addressBook = await fetchAddressBook();

        if (!isMounted) {
          return;
        }

        setDeliveryAddresses(addressBook.delivery);
        setInvoiceAddresses(addressBook.invoice);
        setActiveDeliveryId(getDefaultActiveId(addressBook.delivery));
        setActiveInvoiceId(getDefaultActiveId(addressBook.invoice));
        setSavedSnapshot(addressBook);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setDeliveryAddresses([]);
        setInvoiceAddresses([]);
        setActiveDeliveryId("");
        setActiveInvoiceId("");
        setSavedSnapshot({ delivery: [], invoice: [] });
        await showAuthErrorAlert(
          error instanceof Error
            ? error.message
            : "Unable to load your addresses right now.",
          "Address book unavailable",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAddressBook();

    return () => {
      isMounted = false;
    };
  }, []);

  const isDirty = useMemo(
    () =>
      JSON.stringify(buildAddressBookSnapshot(deliveryAddresses, invoiceAddresses)) !==
      JSON.stringify(savedSnapshot),
    [deliveryAddresses, invoiceAddresses, savedSnapshot],
  );

  function syncAddresses(type, nextAddresses) {
    if (type === "delivery") {
      setDeliveryAddresses(nextAddresses);
      return;
    }

    setInvoiceAddresses(nextAddresses);
  }

  function handleAdd(type) {
    const nextAddress = createEmptyAddressEntry(type);
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const nextAddresses = [...source, nextAddress];

    syncAddresses(type, nextAddresses);

    if (type === "delivery") {
      setActiveDeliveryId(nextAddress.id);
      return;
    }

    setActiveInvoiceId(nextAddress.id);
  }

  function handleSetDefault(type, addressId) {
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const nextAddresses = source.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }));

    syncAddresses(type, nextAddresses);
  }

  function handleChangeField(type, addressId, key, value) {
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const nextAddresses = source.map((address) =>
      address.id === addressId ? { ...address, [key]: value } : address,
    );

    syncAddresses(type, nextAddresses);
  }

  function handleReset() {
    setDeliveryAddresses(savedSnapshot.delivery);
    setInvoiceAddresses(savedSnapshot.invoice);
    setActiveDeliveryId(getDefaultActiveId(savedSnapshot.delivery));
    setActiveInvoiceId(getDefaultActiveId(savedSnapshot.invoice));
  }

  async function handleDelete(type, addressId) {
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const addressToDelete = source.find((address) => address.id === addressId);

    if (!addressToDelete) {
      return;
    }

    const result = await confirmRemoveItem(addressToDelete.label || "address");

    if (!result.isConfirmed) {
      return;
    }

    try {
      if (addressToDelete.id && !`${addressToDelete.id}`.startsWith("local-")) {
        await deleteAddress(addressToDelete.id);
      }

      const nextAddresses = source.filter((address) => address.id !== addressId);
      const normalizedAddresses =
        nextAddresses.length > 0
          ? nextAddresses.some((address) => address.isDefault)
            ? nextAddresses
            : nextAddresses.map((address, index) => ({
                ...address,
                isDefault: index === 0,
              }))
          : [createEmptyAddressEntry(type)];

      syncAddresses(type, normalizedAddresses);

      if (type === "delivery") {
        setActiveDeliveryId(getDefaultActiveId(normalizedAddresses));
      } else {
        setActiveInvoiceId(getDefaultActiveId(normalizedAddresses));
      }

      await showSuccessToast("Address removed successfully");
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to delete this address right now.",
        "Address delete failed",
      );
    }
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      const nextSnapshot = await saveAddressBook({
        delivery: deliveryAddresses,
        invoice: invoiceAddresses,
      });

      setDeliveryAddresses(nextSnapshot.delivery);
      setInvoiceAddresses(nextSnapshot.invoice);
      setActiveDeliveryId(getDefaultActiveId(nextSnapshot.delivery));
      setActiveInvoiceId(getDefaultActiveId(nextSnapshot.invoice));
      setSavedSnapshot(nextSnapshot);
      await showSuccessToast("Addresses updated successfully");
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to update your addresses right now.",
        "Address update failed",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    activeDeliveryId,
    activeInvoiceId,
    deliveryAddresses,
    handleAdd,
    handleChangeField,
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
  };
}
