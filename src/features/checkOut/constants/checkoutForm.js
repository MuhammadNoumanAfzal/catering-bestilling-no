import {
  buildCheckoutAddressFields,
  getDefaultSavedAddress,
  readSavedSettings,
} from "../../../utils/customerProfileStorage";

export const VALID_CHECKOUT_TYPES = ["corporate", "private"];

export const CHECKOUT_MODE_LABELS = {
  corporate: "Corporate",
  private: "Private",
};

export const CHECKOUT_PLACEHOLDERS = {
  companyName: "Firmanavn",
  organizationNumber: "123 456 789",
  invoiceReference: "PO-nummer / referanse (valgfritt)",
  firstName: "Fornavn",
  lastName: "Etternavn",
  email: "navn@eksempel.no",
  phone: "+4788888888",
  address: "Gateadresse",
  addressLine2: "Leilighet / etasje (valgfritt)",
  apartment: "Leilighet / etasje (valgfritt)",
  city: "By",
  postalCode: "1234",
  eventName: "Arrangementsnavn",
  occasion: "Anledning (valgfritt)",
  additionalInfo: "Legg til notater...",
};

export function createInitialCheckoutFormState(primaryCart) {
  const orderSummary = primaryCart?.orderSummary;
  const savedSettings = readSavedSettings();
  const defaultDeliveryAddress = getDefaultSavedAddress("delivery");
  const defaultInvoiceAddress = getDefaultSavedAddress("invoice");

  return {
    companyName: savedSettings.company ?? "",
    organizationNumber: "",
    invoiceReference: "",
    firstName: savedSettings.firstName ?? "",
    lastName: savedSettings.lastName ?? "",
    email: savedSettings.primaryEmail ?? "",
    phone: savedSettings.mobilePhone ?? "",
    ...buildCheckoutAddressFields(
      "delivery",
      defaultDeliveryAddress,
      orderSummary?.deliveryAddress ?? "",
    ),
    ...buildCheckoutAddressFields(
      "invoice",
      defaultInvoiceAddress,
      orderSummary?.invoiceAddress ?? "",
    ),
    invoiceSameAsDelivery: true,
    eventName: "",
    occasion: "",
    date: orderSummary?.deliveryDate ?? "",
    time: orderSummary?.deliveryTime ?? "",
    personCount: orderSummary?.personCount ?? 20,
    additionalInfo: "",
  };
}
