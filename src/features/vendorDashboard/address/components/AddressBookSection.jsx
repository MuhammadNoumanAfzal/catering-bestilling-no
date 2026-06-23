import { FiPlus } from "react-icons/fi";
import { ADDRESS_FIELD_LIMITS } from "../constants/addressFieldLimits";
import AddressCard from "./AddressCard";
import AddressField from "./AddressField";
import AddressTextarea from "./AddressTextarea";

export default function AddressBookSection({
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
            onDelete={() => onDelete(address.id)}
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
              Save multiple addresses and choose which one should autofill first.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSetDefault(activeAddress.id)}
            className="rounded-full border border-[#dfd5cb] bg-white px-4 py-2 text-sm font-semibold text-[#3a352f] transition hover:bg-[#faf6f2]"
          >
            {activeAddress.isDefault ? "Default address" : "Set as default"}
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <AddressField
            label="Location name"
            maxLength={ADDRESS_FIELD_LIMITS.label}
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
            maxLength={ADDRESS_FIELD_LIMITS.postalCode}
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
            label="Receiving name"
            maxLength={ADDRESS_FIELD_LIMITS.contactName}
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
