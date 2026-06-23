export const SAVE_ADDRESS_BOOK_MUTATION = `
  mutation SaveAddressBook(
    $delivery: [AddressInput!]!
    $invoice: [AddressInput!]!
  ) {
    saveAddressBook(delivery: $delivery, invoice: $invoice) {
      success
      message
      delivery {
        id
        addressType
        locationName
        address
        unitFloor
        city
        state
        postCode
        phone
        receivingName
        instruction
        default
      }
      invoice {
        id
        addressType
        locationName
        address
        unitFloor
        city
        state
        postCode
        phone
        receivingName
        instruction
        default
      }
      errors {
        field
        message
        addressType
        addressId
      }
    }
  }
`;

export const DELETE_ADDRESS_MUTATION = `
  mutation DeleteAddress($addressId: ID!) {
    deleteAddress(addressId: $addressId) {
      success
      message
    }
  }
`;
