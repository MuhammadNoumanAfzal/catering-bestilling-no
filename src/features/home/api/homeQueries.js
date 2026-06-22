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
          deliverySettings {
            minDeliveryTime
            maxDeliveryTime
            baseDeliveryFee
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
          deliverySettings {
            minDeliveryTime
            maxDeliveryTime
            baseDeliveryFee
          }
        }
      }
    }
    popularProducts: products(isPopular: true) {
      edges {
        node {
          id
          name
          averageRating
          ordersCount
          badge
          deliveryFee
          deliveryTime
          categoryTags
          dietaryTags
          minimumGuests
          coverImage {
            fileUrl
          }
          vendor {
            id
            name
          }
        }
      }
    }
  }
`;
