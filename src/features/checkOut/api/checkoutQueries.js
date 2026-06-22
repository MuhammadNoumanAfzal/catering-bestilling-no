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
