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
            freeDeliveryOver
            minDeliveryTime
            maxDeliveryTime
            pickupAddress
            pickupInstructions
            deliveryDays
            deliveryTimeSlots {
              start
              end
            }
          }
          businessSettings {
            logoUrl
            coverPhotoUrl
            id
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
          menuCategories {
            id
            name
            description
            vendorProducts {
              id
              name
              productType
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

export const FETCH_VENDOR_BY_SLUG_QUERY = `
  query GetVendorBySlug($slug: String!) {
    vendor(slug: $slug) {
      id
      slug
      name
      rating
      reviewsCount
      canReview
      hasReviewed
      reviewSummary {
        averageRating
        totalCount
        ratingBreakdown {
          stars
          count
        }
      }
      logoUrl
      coverPhotoUrl
      categoryTags
      businessSettings {
        logoUrl
        coverPhotoUrl
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
        id
        baseDeliveryFee
        freeDeliveryOver
        minDeliveryTime
        maxDeliveryTime
        pickupAddress
        pickupInstructions
        deliveryDays
        deliveryTimeSlots {
          start
          end
        }
      }
      menuCategories {
        id
        name
        description
        vendorProducts {
          id
          slug
          name
          productType
          description
          priceWithTax
          averageRating
          ordersCount
          badge
          isPopular
          isFeatured
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
        }
      }
    }
  }
`;

export const FETCH_VENDOR_REVIEWS_QUERY = `
  query GetVendorReviews($vendorSlug: String!, $first: Int, $after: String) {
    vendor(slug: $vendorSlug) {
      id
      slug
      reviews(first: $first, after: $after) {
        edges {
          node {
            id
            rating
            title
            comment
            occasion
            eventDate
            authorName
            createdOn
            status
            orderId
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

export const SUBMIT_VENDOR_REVIEW_MUTATION = `
  mutation SubmitVendorReview($input: VendorReviewInput!) {
    createVendorReview(input: $input) {
      success
      message
      review {
        id
        rating
        title
        comment
        occasion
        eventDate
        authorName
        createdOn
        status
      }
    }
  }
`;

export const FETCH_SAVED_VENDORS_QUERY = `
  query GetSavedVendors {
    savedVendors {
      id
      slug
      name
      logoUrl
      coverPhotoUrl
      rating
    }
  }
`;

export const SAVE_VENDOR_MUTATION = `
  mutation SaveVendor($vendorId: ID!) {
    saveVendor(vendorId: $vendorId) {
      success
      message
    }
  }
`;

export const REMOVE_SAVED_VENDOR_MUTATION = `
  mutation RemoveSavedVendor($vendorId: ID!) {
    removeSavedVendor(vendorId: $vendorId) {
      success
      message
    }
  }
`;
