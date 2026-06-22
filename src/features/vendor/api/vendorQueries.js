export const FETCH_VENDORS_QUERY = `
  query FetchVendors {
    vendors {
      edges {
        node {
          id
          name
          rating
          reviewsCount
          logoUrl
          coverPhotoUrl
          categoryTags
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
          menuCategories {
            id
            name
            description
            vendorProducts {
              id
              name
              description
              priceWithTax
              averageRating
              ordersCount
              badge
              isPopular
              isFeatured
              slug
              categoryTags
              contains
              dietaryTags
              allergens
              minLeadTimeDays
              minLeadTimeHours
              minimumGuests
              pricingType
              isAvailabilityWindowEnabled
              availableFrom
              availableUntil
              coverImage {
                id
                fileUrl
              }
            }
          }
        }
      }
    }
  }
`;
