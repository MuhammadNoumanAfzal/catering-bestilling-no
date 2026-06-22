export const GET_ADDRESS_BOOK_QUERY = `
  query GetAddressBook {
    me {
      id
      addresses {
        edges {
          node {
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
        }
      }
    }
  }
`;
