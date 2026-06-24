export const FETCH_HOME_DATA_QUERY = `
  query FetchHomeData($postCode: String, $areaName: String) {
    featured: vendors(
      isFeatured: true
      postCode: $postCode
      areaName: $areaName
    ) {
      edges {
        node {
          id
          name
          postCode
          rating
          discountPercentage
          logoUrl
          coverPhotoUrl
          categoryTags
          foodTypes {
            id
            name
            slug
          }
          occasions {
            id
            name
            slug
          }
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
    popularVendors: vendors(
      isPopular: true
      postCode: $postCode
      areaName: $areaName
    ) {
      edges {
        node {
          id
          name
          postCode
          rating
          discountPercentage
          logoUrl
          coverPhotoUrl
          categoryTags
          foodTypes {
            id
            name
            slug
          }
          occasions {
            id
            name
            slug
          }
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
          foodTypes {
            id
            name
            slug
          }
          occasions {
            id
            name
            slug
          }
          dietaryTags
          minimumGuests
          coverImage {
            fileUrl
          }
          vendor {
            id
            name
            postCode
            rating
            reviewsCount
            logoUrl
            coverPhotoUrl
            categoryTags
            foodTypes {
              id
              name
              slug
            }
            occasions {
              id
              name
              slug
            }
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
