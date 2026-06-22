export const FETCH_HOME_DATA_QUERY = `
  query FetchHomeData {
    featured: vendors(isFeatured: true) {
      edges {
        node {
          id
          name
          rating
          discountPercentage
          logoUrl
          coverPhotoUrl
          categoryTags
          reviewsCount
          businessSettings {
            businessAddress
            businessHours
          }
          serviceAreas {
            id
            name
            postCode
            isActive
          }
          deliverySettings {
            minDeliveryTime
            maxDeliveryTime
            baseDeliveryFee
            deliveryDays
            deliveryTimeSlots
          }
        }
      }
    }
    popularVendors: vendors(isPopular: true) {
      edges {
        node {
          id
          name
          rating
          discountPercentage
          logoUrl
          coverPhotoUrl
          categoryTags
          reviewsCount
          businessSettings {
            businessAddress
            businessHours
          }
          serviceAreas {
            id
            name
            postCode
            isActive
          }
          deliverySettings {
            minDeliveryTime
            maxDeliveryTime
            baseDeliveryFee
            deliveryDays
            deliveryTimeSlots
          }
        }
      }
    }
    popularProducts: products(isPopular: true) {
      edges {
        node {
          id
          name
          description
          averageRating
          ordersCount
          badge
          deliveryFee
          deliveryTime
          priceWithTax
          pricingType
          categoryTags
          dietaryTags
          minimumGuests
          coverImage {
            fileUrl
          }
          vendor {
            id
            name
            rating
            reviewsCount
            logoUrl
            coverPhotoUrl
            categoryTags
            businessSettings {
              businessAddress
              businessHours
            }
            serviceAreas {
              id
              name
              postCode
              isActive
            }
            deliverySettings {
              minDeliveryTime
              maxDeliveryTime
              baseDeliveryFee
              deliveryDays
              deliveryTimeSlots
            }
          }
        }
      }
    }
  }
`;
