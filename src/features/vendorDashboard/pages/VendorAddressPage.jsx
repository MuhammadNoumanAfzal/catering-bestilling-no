import { useMemo, useState } from "react";
import { FiMapPin, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import {
  createBlankSavedAddress,
  readSavedAddresses,
  writeSavedAddresses,
} from "../../../utils/customerProfileStorage";

function AddressField({ label, value, onChange, placeholder, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="type-para mb-2 block text-[#8a8279]">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-subpara h-10 w-full rounded-[10px] border border-[#dad2ca] bg-white px-3 text-[#2d2d2d] outline-none placeholder:text-[#b2aaa1]"
      />
    </label>
  );
}

function AddressTextarea({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="type-subpara mb-2 block text-[#8a8279]">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-subpara min-h-[100px] w-full rounded-[10px] border border-[#dad2ca] bg-white px-3 py-2 text-[#2d2d2d] outline-none placeholder:text-[#b2aaa1]"
      />
    </label>
  );
}

function AddressCard({ address, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "rounded-[18px] border p-4 text-left transition",
        isActive
          ? "border-[#cf6e38] bg-[#fff4ed] shadow-[0_14px_30px_rgba(207,110,56,0.12)]"
          : "border-[#e5ddd5] bg-white hover:border-[#d7c6b7]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e5] text-[#cf6e38]">
            <FiMapPin className="text-[16px]" />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[#1f1f1f]">
              {address.label || "Untitled address"}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#6a625b]">
              {[address.addressLine1, address.city, address.postalCode]
                .filter(Boolean)
                .join(", ") || "No address added yet"}
            </p>
          </div>
        </div>

        {address.isDefault ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#cf6e38] px-2.5 py-1 text-[11px] font-semibold text-white">
            <FiStar className="text-[11px]" />
            Default
          </span>
        ) : null}
      </div>
    </button>
  );
}

function AddressBookSection({
  type,
  title,
  description,
  addresses,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onSetDefault,
  onChangeField,
}) {
  const activeAddress =
    addresses.find((address) => address.id === activeId) ?? addresses[0];
  const canDelete = addresses.length > 1;
  const typeLabel = type === "delivery" ? "delivery" : "invoice";

  if (!activeAddress) {
    return null;
  }

  return (
    <section className="rounded-[26px] border border-[#dfd6ce] bg-white p-4 shadow-[0_18px_40px_rgba(28,24,20,0.05)] md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="type-h2 text-[#191919]">{title}</h2>
          <p className="mt-2 type-para text-[#6e655d]">{description}</p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-1 self-start whitespace-nowrap rounded-full border border-[#efcdb7] bg-[#fff5ee] px-2.5 py-1.5 text-[12px] font-semibold leading-none text-[#c86434] transition hover:bg-[#fff0e6] sm:self-auto"
        >
          <FiPlus className="text-[15px]" />
          Add {typeLabel} address
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isActive={address.id === activeAddress.id}
            onSelect={() => onSelect(address.id)}
          />
        ))}
      </div>

      <div className="mt-5 rounded-[22px] border border-[#eadfd5] bg-[#fffdfa] p-4 md:p-5">
        <div className="flex flex-col gap-3 border-b border-[#ece2d9] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[16px] font-semibold text-[#1f1f1f]">
              Edit {activeAddress.label || `${typeLabel} address`}
            </p>
            <p className="mt-1 text-[13px] text-[#7b7269]">
              Changes here update your saved address book and checkout autofill.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSetDefault(activeAddress.id)}
              className="rounded-full border border-[#dfd5cb] bg-white px-4 py-2 text-sm font-semibold text-[#3a352f] transition hover:bg-[#faf6f2]"
            >
              {activeAddress.isDefault ? "Default address" : "Set as default"}
            </button>
            <button
              type="button"
              onClick={() => onDelete(activeAddress.id)}
              disabled={!canDelete}
              className="inline-flex items-center gap-2 rounded-full border border-[#f2d5cf] bg-white px-4 py-2 text-sm font-semibold text-[#d35648] transition hover:bg-[#fff6f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 className="text-[14px]" />
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <AddressField
            label="Location name"
            value={activeAddress.label}
            onChange={(event) =>
              onChangeField(activeAddress.id, "label", event.target.value)
            }
            placeholder="Main office"
            className="sm:col-span-2 lg:col-span-6"
          />

          <AddressField
            label="Street address"
            value={activeAddress.addressLine1}
            onChange={(event) =>
              onChangeField(activeAddress.id, "addressLine1", event.target.value)
            }
            placeholder="123 Main St."
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressField
            label="Unit/Floor"
            value={activeAddress.addressLine2}
            onChange={(event) =>
              onChangeField(activeAddress.id, "addressLine2", event.target.value)
            }
            placeholder="Floor 2"
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressField
            label="City"
            value={activeAddress.city}
            onChange={(event) =>
              onChangeField(activeAddress.id, "city", event.target.value)
            }
            placeholder="Bergen"
            className="lg:col-span-2"
          />

          <AddressField
            label="State"
            value={activeAddress.state}
            onChange={(event) =>
              onChangeField(activeAddress.id, "state", event.target.value)
            }
            placeholder="Vestland"
            className="lg:col-span-2"
          />

          <AddressField
            label="Postal code"
            value={activeAddress.postalCode}
            onChange={(event) =>
              onChangeField(activeAddress.id, "postalCode", event.target.value)
            }
            placeholder="5003"
            className="lg:col-span-2"
          />

          <AddressField
            label="Phone number"
            value={activeAddress.phoneNumber}
            onChange={(event) =>
              onChangeField(activeAddress.id, "phoneNumber", event.target.value)
            }
            placeholder="+47 123 45 678"
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressField
            label="Ask for"
            value={activeAddress.contactName}
            onChange={(event) =>
              onChangeField(activeAddress.id, "contactName", event.target.value)
            }
            placeholder="Reception"
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressTextarea
            label="Instructions"
            value={activeAddress.instructions}
            onChange={(event) =>
              onChangeField(activeAddress.id, "instructions", event.target.value)
            }
            placeholder="Buzz 124 and take the elevator to the 13th floor"
            className="sm:col-span-2 lg:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}

export default function VendorAddressPage() {
  const initialDeliveryAddresses = readSavedAddresses("delivery");
  const initialInvoiceAddresses = readSavedAddresses("invoice");
  const [deliveryAddresses, setDeliveryAddresses] = useState(initialDeliveryAddresses);
  const [invoiceAddresses, setInvoiceAddresses] = useState(initialInvoiceAddresses);
  const [activeDeliveryId, setActiveDeliveryId] = useState(
    () =>
      initialDeliveryAddresses.find((address) => address.isDefault)?.id ??
      initialDeliveryAddresses[0]?.id,
  );
  const [activeInvoiceId, setActiveInvoiceId] = useState(
    () =>
      initialInvoiceAddresses.find((address) => address.isDefault)?.id ??
      initialInvoiceAddresses[0]?.id,
  );

  const initialSnapshot = useMemo(
    () => ({
      delivery: initialDeliveryAddresses,
      invoice: initialInvoiceAddresses,
    }),
    [],
  );

  function syncAddresses(type, nextAddresses) {
    writeSavedAddresses(type, nextAddresses);

    if (type === "delivery") {
      setDeliveryAddresses(nextAddresses);
      return;
    }

    setInvoiceAddresses(nextAddresses);
  }

  function handleAdd(type) {
    const nextAddress = createBlankSavedAddress(type);
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const nextAddresses = [...source, nextAddress];

    syncAddresses(type, nextAddresses);

    if (type === "delivery") {
      setActiveDeliveryId(nextAddress.id);
      return;
    }

    setActiveInvoiceId(nextAddress.id);
  }

  function handleDelete(type, addressId) {
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;

    if (source.length <= 1) {
      return;
    }

    const nextAddresses = source.filter((address) => address.id !== addressId);

    if (!nextAddresses.some((address) => address.isDefault)) {
      nextAddresses[0].isDefault = true;
    }

    syncAddresses(type, nextAddresses);

    if (type === "delivery") {
      setActiveDeliveryId(nextAddresses[0].id);
      return;
    }

    setActiveInvoiceId(nextAddresses[0].id);
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

  function handleCancel() {
    setDeliveryAddresses(initialSnapshot.delivery);
    setInvoiceAddresses(initialSnapshot.invoice);
    writeSavedAddresses("delivery", initialSnapshot.delivery);
    writeSavedAddresses("invoice", initialSnapshot.invoice);
    setActiveDeliveryId(
      initialSnapshot.delivery.find((address) => address.isDefault)?.id ??
        initialSnapshot.delivery[0]?.id,
    );
    setActiveInvoiceId(
      initialSnapshot.invoice.find((address) => address.isDefault)?.id ??
        initialSnapshot.invoice[0]?.id,
    );
  }

  function handleSave() {
    writeSavedAddresses("delivery", deliveryAddresses);
    writeSavedAddresses("invoice", invoiceAddresses);
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
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="type-h6 w-full cursor-pointer rounded-full border border-[#cfc6bd] bg-white px-5 py-2.5 text-[#1f1f1f] transition hover:bg-[#f8f4ef] sm:w-auto"
        >
          Reset saved addresses
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="type-h6 w-full cursor-pointer rounded-full bg-[#cf5c2f] px-5 py-2.5 text-white transition hover:bg-[#b95127] sm:w-auto"
        >
          Save addresses
        </button>
      </div>
    </div>
  );
}
