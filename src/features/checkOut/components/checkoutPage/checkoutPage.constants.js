export const VALID_TYPES = ["corporate", "private"];

export const MODE_LABELS = {
  corporate: "Corporate",
  private: "Private",
};

export const PLACEHOLDERS = {
  companyName: "ABC Company",
  organizationNumber: "123 456 789",
  invoiceReference: "Reference",
  firstName: "First name",
  lastName: "Last name",
  email: "name@example.com",
  phone: "XX-XX-XXX",
  address: "xxx-xxx-xxx",
  addressLine2: "Suite / Floor",
  apartment: "Apartment / Floor",
  city: "Bergen",
  postalCode: "1235",
  eventName: "Event name",
  occasion: "Occasion",
  additionalInfo: "Add notes...",
};

export function createInitialFormState(primaryCart) {
  const orderSummary = primaryCart?.orderSummary;

  return {
    companyName: "",
    organizationNumber: "",
    invoiceReference: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    deliveryAddress: orderSummary?.deliveryAddress ?? "",
    deliveryAddressLine2: "",
    deliveryCity: "",
    deliveryPostalCode: "",
    invoiceAddress: orderSummary?.invoiceAddress ?? "",
    invoiceAddressLine2: "",
    invoiceCity: "",
    invoicePostalCode: "",
    eventName: "",
    occasion: "",
    date: orderSummary?.deliveryDate ?? "2026-03-25",
    time: orderSummary?.deliveryTime ?? "14:30",
    personCount: orderSummary?.personCount ?? 20,
    additionalInfo: "",
  };
}
