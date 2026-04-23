import { useState } from "react";

const initialAddressState = {
  deliveryLocationName: "New York Office",
  deliveryStreetAddress: "123 Main St.",
  deliveryUnitFloor: "Unit 1",
  deliveryCity: "City name",
  deliveryState: "State name",
  deliveryZipCode: "001",
  deliveryPhoneNumber: "111-222-33",
  deliveryAskFor: "Receiving name",
  deliveryInstructions: "BUZZ 124 and take the elevator to the 13th floor",
  invoiceLocationName: "New York Office",
  invoiceStreetAddress: "123 Main St.",
  invoiceUnitFloor: "Unit 1",
  invoiceCity: "City name",
  invoiceState: "State name",
  invoiceZipCode: "001",
  invoicePhoneNumber: "111-222-33",
  invoiceAskFor: "Receiving name",
  invoiceInstructions: "BUZZ 124 and take the elevator to the 13th floor",
};

function AddressField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="type-subpara mb-2 block text-[#8a8279]">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-subpara h-10 w-full rounded-[4px] border border-[#dad2ca] bg-white px-3 text-[#2d2d2d] outline-none placeholder:text-[#b2aaa1]"
      />
    </label>
  );
}

function AddressTextarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="type-subpara mb-2 block text-[#8a8279]">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-subpara min-h-[44px] w-full rounded-[4px] border border-[#dad2ca] bg-white px-3 py-2 text-[#2d2d2d] outline-none placeholder:text-[#b2aaa1]"
      />
    </label>
  );
}

function AddressSection({
  title,
  description,
  prefix,
  formState,
  updateField,
}) {
  return (
    <section>
      <h2 className="type-h3 text-[#191919]">{title}</h2>
      <p className="mt-1 type-subpara text-[#8a8279]">{description}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <AddressField
          label="Location name"
          value={formState[`${prefix}LocationName`]}
          onChange={(event) =>
            updateField(`${prefix}LocationName`, event.target.value)
          }
          placeholder="New York Office"
          className="sm:col-span-2 lg:col-span-6"
        />

        <AddressField
          label="Street address"
          value={formState[`${prefix}StreetAddress`]}
          onChange={(event) =>
            updateField(`${prefix}StreetAddress`, event.target.value)
          }
          placeholder="123 Main St."
          className="sm:col-span-1 lg:col-span-3"
        />

        <AddressField
          label="Unit/Floor"
          value={formState[`${prefix}UnitFloor`]}
          onChange={(event) => updateField(`${prefix}UnitFloor`, event.target.value)}
          placeholder="Unit 1"
          className="sm:col-span-1 lg:col-span-3"
        />

        <AddressField
          label="City"
          value={formState[`${prefix}City`]}
          onChange={(event) => updateField(`${prefix}City`, event.target.value)}
          placeholder="City name"
          className="lg:col-span-2"
        />

        <AddressField
          label="State"
          value={formState[`${prefix}State`]}
          onChange={(event) => updateField(`${prefix}State`, event.target.value)}
          placeholder="State name"
          className="lg:col-span-2"
        />

        <AddressField
          label="Zip code"
          value={formState[`${prefix}ZipCode`]}
          onChange={(event) => updateField(`${prefix}ZipCode`, event.target.value)}
          placeholder="001"
          className="lg:col-span-2"
        />

        <AddressField
          label="Phone number"
          value={formState[`${prefix}PhoneNumber`]}
          onChange={(event) =>
            updateField(`${prefix}PhoneNumber`, event.target.value)
          }
          placeholder="111-222-33"
          className="sm:col-span-1 lg:col-span-3"
        />

        <AddressField
          label="Upon delivery ask for"
          value={formState[`${prefix}AskFor`]}
          onChange={(event) => updateField(`${prefix}AskFor`, event.target.value)}
          placeholder="Receiving name"
          className="sm:col-span-1 lg:col-span-3"
        />

        <AddressTextarea
          label="Delivery instructions"
          value={formState[`${prefix}Instructions`]}
          onChange={(event) =>
            updateField(`${prefix}Instructions`, event.target.value)
          }
          placeholder="BUZZ 124 and take the elevator to the 13th floor"
        />
      </div>
    </section>
  );
}

export default function VendorAddressPage() {
  const [formState, setFormState] = useState(initialAddressState);

  function updateField(key, value) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function handleCancel() {
    setFormState(initialAddressState);
  }

  function handleSave() {
    return formState;
  }

  return (
    <div className="space-y-8">
      <AddressSection
        title="Delivery Address"
        description="Add a address where your order will be delivered"
        prefix="delivery"
        formState={formState}
        updateField={updateField}
      />

      <AddressSection
        title="Invoice Address"
        description="Add a address where your invoice will be delivered"
        prefix="invoice"
        formState={formState}
        updateField={updateField}
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="type-h6 cursor-pointer rounded-full border border-[#cfc6bd] bg-white px-5 py-2.5 text-[#1f1f1f] transition hover:bg-[#f8f4ef]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="type-h6 cursor-pointer rounded-full bg-[#cf5c2f] px-5 py-2.5 text-white transition hover:bg-[#b95127]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
