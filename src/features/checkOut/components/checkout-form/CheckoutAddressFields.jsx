import CheckoutField from "./CheckoutField";
import { CHECKOUT_PLACEHOLDERS } from "../../constants/checkoutForm";

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
        placeholder={CHECKOUT_PLACEHOLDERS.address}
        className="sm:col-span-2"
      />
      <CheckoutField
        label={lineTwoLabel}
        value={formState[`${prefix}AddressLine2`]}
        onChange={(event) =>
          updateField(`${prefix}AddressLine2`, event.target.value)
        }
        placeholder={
          mode === "corporate"
            ? CHECKOUT_PLACEHOLDERS.addressLine2
            : CHECKOUT_PLACEHOLDERS.apartment
        }
      />
      <CheckoutField
        label={firstRowLabel}
        value={formState[firstRowKey]}
        onChange={(event) => updateField(firstRowKey, event.target.value)}
        placeholder={
          mode === "corporate"
            ? CHECKOUT_PLACEHOLDERS.city
            : CHECKOUT_PLACEHOLDERS.postalCode
        }
      />
      <CheckoutField
        label={secondRowLabel}
        value={formState[secondRowKey]}
        onChange={(event) => updateField(secondRowKey, event.target.value)}
        placeholder={
          mode === "corporate"
            ? CHECKOUT_PLACEHOLDERS.postalCode
            : CHECKOUT_PLACEHOLDERS.city
        }
      />
    </div>
  );
}
