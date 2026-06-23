export const FETCH_PRODUCT_QUERY = `
  query FetchProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      priceWithTax
      pricingType
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
      optionalAddOns {
        id
        name
        minSelect
        maxSelect
        isRequired
        options {
          id
          name
          price
        }
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
        slug
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
