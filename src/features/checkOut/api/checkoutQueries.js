export const GET_CURRENT_USER_DETAILS_QUERY = `
  query GetCurrentUserDetails {
    me {
      id
      firstName
      lastName
      email
      phone
      addresses {
        edges {
          node {
            id
            addressType
            locationName
            address
            unitFloor
            city
            postCode
            default
          }
        }
      }
    }
  }
`;

export const GET_AVAILABLE_DELIVERY_SLOTS_QUERY = `
  query GetAvailableDeliverySlots($vendorId: ID!, $date: String!) {
    availableDeliverySlots(vendorId: $vendorId, date: $date) {
      start
      end
      isFullyBooked
      remainingCapacity
    }
  }
`;
