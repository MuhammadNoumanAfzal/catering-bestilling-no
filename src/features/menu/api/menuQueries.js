export const FETCH_PRODUCT_QUERY = `
  query FetchProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      priceWithTax
      averageRating
      minimumGuests
      isAvailabilityWindowEnabled
      availableFrom
      availableUntil
      dietaryTags
      allergens
      coverImage {
        id
        fileUrl
      }
      menuItems {
        id
        title
        description
        imageUrl
        allergens
      }
      vendor {
        id
        name
        logoUrl
        coverPhotoUrl
        rating
        reviewsCount
        deliverySettings {
          id
          baseDeliveryFee
          minDeliveryTime
          maxDeliveryTime
          deliveryDays
          deliveryTimeSlots
        }
        businessSettings {
          id
          businessAddress
          businessHours
        }
        serviceAreas {
          id
          name
          postCode
          isActive
        }
      }
    }
  }
`;

export const FETCH_ADD_ONS_QUERY = `
  query FetchAddOns {
    products(productType: "add-on") {
      edges {
        node {
          id
          name
          priceWithTax
          coverImage {
            fileUrl
          }
        }
      }
    }
  }
`;
