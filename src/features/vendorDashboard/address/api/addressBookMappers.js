function normalizeAddressType(addressType) {
  return `${addressType ?? ""}`.trim().toLowerCase() === "invoice"
    ? "invoice"
    : "delivery";
}

function ensureDefaultAddress(addresses) {
  if (addresses.length === 0) {
    return [];
  }

  if (addresses.some((address) => address.isDefault)) {
    return addresses;
  }

  return addresses.map((address, index) => ({
    ...address,
    isDefault: index === 0,
  }));
}

export function mapApiAddressToBookEntry(addressNode) {
  return {
    id: addressNode?.id || "",
    label: addressNode?.locationName || "",
    contactName: addressNode?.receivingName || "",
    addressLine1: addressNode?.address || "",
    addressLine2: addressNode?.unitFloor || "",
    city: addressNode?.city || "",
    state: addressNode?.state || "",
    postalCode: addressNode?.postCode || "",
    phoneNumber: addressNode?.phone || "",
    instructions: addressNode?.instruction || "",
    isDefault: Boolean(addressNode?.default),
  };
}

export function mapAddressEdgesToAddressBook(edges) {
  const rawAddresses = (edges || []).map((edge) => edge.node);
  const deliveryAddresses = ensureDefaultAddress(
    rawAddresses
      .filter((address) => normalizeAddressType(address.addressType) === "delivery")
      .map(mapApiAddressToBookEntry),
  );
  const invoiceAddresses = ensureDefaultAddress(
    rawAddresses
      .filter((address) => normalizeAddressType(address.addressType) === "invoice")
      .map(mapApiAddressToBookEntry),
  );

  return {
    delivery: deliveryAddresses,
    invoice: invoiceAddresses,
  };
}
