export const PLACE_CLIENT_ORDER_MUTATION = `
  mutation PlaceClientOrder(
    $vendorId: ID!
    $customerType: String!
    $items: [ClientOrderItemInput]!
    $corporateName: String
    $deliveryAddress: String
    $deliveryCity: String
    $deliveryPostalCode: String
    $deliverySuite: String
    $email: String
    $eventDate: Date
    $eventName: String
    $eventTime: Time
    $invoiceAddress: String
    $invoiceCity: String
    $invoicePostalCode: String
    $invoiceReference: String
    $invoiceSuite: String
    $occasion: String
    $orderNotes: String
    $organizationNumber: String
    $personCount: Int
    $phone: String
    $taxPercent: Decimal
    $tipAmount: Decimal
  ) {
    placeClientOrder(
      vendorId: $vendorId
      customerType: $customerType
      items: $items
      corporateName: $corporateName
      deliveryAddress: $deliveryAddress
      deliveryCity: $deliveryCity
      deliveryPostalCode: $deliveryPostalCode
      deliverySuite: $deliverySuite
      email: $email
      eventDate: $eventDate
      eventName: $eventName
      eventTime: $eventTime
      invoiceAddress: $invoiceAddress
      invoiceCity: $invoiceCity
      invoicePostalCode: $invoicePostalCode
      invoiceReference: $invoiceReference
      invoiceSuite: $invoiceSuite
      occasion: $occasion
      orderNotes: $orderNotes
      organizationNumber: $organizationNumber
      personCount: $personCount
      phone: $phone
      taxPercent: $taxPercent
      tipAmount: $tipAmount
    ) {
      success
      message
      orderId
    }
  }
`;

export function buildPlaceClientOrderVariables(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === "string") {
        return value !== "";
      }

      return true;
    }),
  );
}
