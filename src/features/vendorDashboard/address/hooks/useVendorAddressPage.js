import { useMemo, useState, useEffect } from "react";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import {
  readSavedAddresses,
  writeSavedAddresses,
} from "../../../../utils/customerProfileStorage";
import { createEmptyAddressEntry } from "../constants/addressBook";
import { fetchAddressBook, saveAddressBook } from "../api";

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

        writeSavedAddresses("delivery", addressBook.delivery);
        writeSavedAddresses("invoice", addressBook.invoice);
        setDeliveryAddresses(addressBook.delivery);
        setInvoiceAddresses(addressBook.invoice);
        setActiveDeliveryId(getDefaultActiveId(addressBook.delivery));
        setActiveInvoiceId(getDefaultActiveId(addressBook.invoice));
        setSavedSnapshot(addressBook);
      } catch {
        if (!isMounted) {
          return;
        }

        const localDelivery = readSavedAddresses("delivery");
        const localInvoice = readSavedAddresses("invoice");
        const fallbackSnapshot = buildAddressBookSnapshot(localDelivery, localInvoice);

        setDeliveryAddresses(localDelivery);
        setInvoiceAddresses(localInvoice);
        setActiveDeliveryId(getDefaultActiveId(localDelivery));
        setActiveInvoiceId(getDefaultActiveId(localInvoice));
        setSavedSnapshot(fallbackSnapshot);
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

  async function handleSave() {
    setIsSaving(true);

    try {
      const nextSnapshot = await saveAddressBook({
        delivery: deliveryAddresses,
        invoice: invoiceAddresses,
      });

      writeSavedAddresses("delivery", nextSnapshot.delivery);
      writeSavedAddresses("invoice", nextSnapshot.invoice);
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
