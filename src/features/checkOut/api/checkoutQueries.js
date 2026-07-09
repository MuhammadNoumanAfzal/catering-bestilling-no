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

export const GET_AVAILABLE_DELIVERY_SLOTS_QUERY = `
  query GetAvailableDeliverySlots($vendorId: ID!, $date: String!) {
    availableDeliverySlots(vendorId: $vendorId, date: $date) {
      start
      end
      isFullyBooked
      remainingCapacity
    }
  }
`;

export const GET_CHECKOUT_PREVIEW_QUERY = `
  query CheckoutPreview($input: CheckoutPreviewInput!) {
    checkoutPreview(input: $input) {
      currency
      availability {
        isValid
        errors
        warnings
      }
      pricing {
        subtotal
        taxRate
        taxAmount
        deliveryFee
        addOnsTotal
        tipAmount
        discountAmount
        serviceFee
        grandTotal
      }
      items {
        productId
        productName
        pricingType
        unitPrice
        quantity
        serves
        lineSubtotal
        lineTax
        lineTotal
        selectedOptions
        selectedAddons {
          name
          unitPrice
          quantity
          totalPrice
        }
      }
    }
  }
`;
