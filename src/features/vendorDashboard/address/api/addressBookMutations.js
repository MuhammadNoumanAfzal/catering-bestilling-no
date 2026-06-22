function escapeGraphqlString(value) {
  return `${value ?? ""}`
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

export function buildAddressMutation(addressType, address) {
  const idLine = address.id && !`${address.id}`.startsWith("local-")
    ? `id: "${escapeGraphqlString(address.id)}"`
    : `id: ""`;

  return `
    mutation SaveAddress {
      addressMutation(input: {
        ${idLine}
        addressType: "${escapeGraphqlString(addressType)}"
        locationName: "${escapeGraphqlString(address.label)}"
        address: "${escapeGraphqlString(address.addressLine1)}"
        unitFloor: "${escapeGraphqlString(address.addressLine2)}"
        city: "${escapeGraphqlString(address.city)}"
        state: "${escapeGraphqlString(address.state)}"
        postCode: "${escapeGraphqlString(address.postalCode)}"
        phone: "${escapeGraphqlString(address.phoneNumber)}"
        receivingName: "${escapeGraphqlString(address.contactName)}"
        instruction: "${escapeGraphqlString(address.instructions)}"
        default: ${address.isDefault ? "true" : "false"}
      }) {
        success
        message
        instance {
          id
          locationName
          address
          unitFloor
          city
          state
          postCode
          addressType
          phone
          receivingName
          instruction
          default
        }
      }
    }
  `;
}
