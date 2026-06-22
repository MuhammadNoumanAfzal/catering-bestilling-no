export function formatCheckoutAddressPreview(formState, prefix) {
  return [
    formState[`${prefix}Address`],
    formState[`${prefix}AddressLine2`],
    formState[`${prefix}City`],
    formState[`${prefix}PostalCode`],
  ]
    .filter(Boolean)
    .join(", ");
}
