import CheckoutField from "./CheckoutField";
import { PLACEHOLDERS } from "./checkoutPage.constants";

export default function CheckoutAddressFields({
  mode,
  prefix,
  formState,
  updateField,
}) {
  const lineTwoLabel =
    mode === "corporate" ? "Suite/Floor(optional)" : "Apartment/Floor (Optional)";
  const firstRowLabel = mode === "corporate" ? "City" : "Postal Code";
  const secondRowLabel = mode === "corporate" ? "Postal Code" : "City";
  const firstRowKey = mode === "corporate" ? `${prefix}City` : `${prefix}PostalCode`;
  const secondRowKey =
    mode === "corporate" ? `${prefix}PostalCode` : `${prefix}City`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CheckoutField
        label="Address"
        value={formState[`${prefix}Address`]}
        onChange={(event) => updateField(`${prefix}Address`, event.target.value)}
        placeholder={PLACEHOLDERS.address}
        className="sm:col-span-2"
      />
      <CheckoutField
        label={lineTwoLabel}
        value={formState[`${prefix}AddressLine2`]}
        onChange={(event) =>
          updateField(`${prefix}AddressLine2`, event.target.value)
        }
        placeholder={
          mode === "corporate" ? PLACEHOLDERS.addressLine2 : PLACEHOLDERS.apartment
        }
      />
      <CheckoutField
        label={firstRowLabel}
        value={formState[firstRowKey]}
        onChange={(event) => updateField(firstRowKey, event.target.value)}
        placeholder={
          mode === "corporate" ? PLACEHOLDERS.city : PLACEHOLDERS.postalCode
        }
      />
      <CheckoutField
        label={secondRowLabel}
        value={formState[secondRowKey]}
        onChange={(event) => updateField(secondRowKey, event.target.value)}
        placeholder={
          mode === "corporate" ? PLACEHOLDERS.postalCode : PLACEHOLDERS.city
        }
      />
    </div>
  );
}
