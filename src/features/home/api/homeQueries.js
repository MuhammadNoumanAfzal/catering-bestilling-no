export const FETCH_HOME_DATA_QUERY = `
  query FetchHomeData($postCode: String, $areaName: String, $includeSearchVendors: Boolean! = false) {
    allVendors: vendors {
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
            businessHours {
              id
              day
              enabled
              openTime
              closeTime
            }
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
            freeDeliveryOver
            pickupAddress
            pickupInstructions
            deliveryDays
            deliveryTimeSlots {
              start
              end
            }
          }
        }
      }
    }
    searchVendors: vendors(
      postCode: $postCode
      areaName: $areaName
    ) @include(if: $includeSearchVendors) {
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
            businessHours {
              id
              day
              enabled
              openTime
              closeTime
            }
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
            freeDeliveryOver
            pickupAddress
            pickupInstructions
            deliveryDays
            deliveryTimeSlots {
              start
              end
            }
          }
        }
      }
    }
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
            businessHours {
              id
              day
              enabled
              openTime
              closeTime
            }
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
            freeDeliveryOver
            pickupAddress
            pickupInstructions
            deliveryDays
            deliveryTimeSlots {
              start
              end
            }
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
            businessHours {
              id
              day
              enabled
              openTime
              closeTime
            }
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
            freeDeliveryOver
            pickupAddress
            pickupInstructions
            deliveryDays
            deliveryTimeSlots {
              start
              end
            }
          }
        }
      }
    }
    popularProducts: products(isPopular: true) {
      edges {
        node {
          id
          name
          menuStatus
          productType
          description
          averageRating
          ordersCount
          badge
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
              businessHours {
                id
                day
                enabled
                openTime
                closeTime
              }
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
              freeDeliveryOver
              pickupAddress
              pickupInstructions
              deliveryDays
              deliveryTimeSlots {
                start
                end
              }
            }
          }
        }
      }
    }
  }
`;
