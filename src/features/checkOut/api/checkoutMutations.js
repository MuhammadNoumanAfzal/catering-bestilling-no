export const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        id
        orderNumber
        status
        placedAt
        eventDate
        vendor {
          id
          name
        }
        customer {
          id
          fullName
          email
        }
        amount {
          subtotal
          tax
          deliveryFee
          serviceFee
          total
          currency
          formatted
        }
      }
      invoice {
        id
        invoiceNumber
        status
        issueDate
        dueDate
        paymentMethod
        paymentReference
        pdfUrl
        pricing {
          subtotal
          taxAmount
          deliveryFee
          grandTotal
          amountPaid
          amountDue
        }
        bankDetails {
          accountName
          accountNumber
          iban
          swiftCode
          bankName
          instructions
        }
      }
    }
  }
`;

export function buildCreateOrderVariables(payload) {
  const input = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === "string") {
        return value !== "";
      }

      return true;
    }),
  );

  return { input };
}
