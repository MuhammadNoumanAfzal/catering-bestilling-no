export const ADDRESS_TYPES = ["delivery", "invoice"];

export function createEmptyAddressEntry(type) {
  return {
    id: `local-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: "",
    contactName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    instructions: "",
    isDefault: false,
  };
}
