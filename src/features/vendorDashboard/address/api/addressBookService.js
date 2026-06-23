import { graphqlRequest } from "../../../../lib/api/graphqlClient";
import { ADDRESS_FIELD_LIMITS } from "../constants/addressFieldLimits";
import {
  DELETE_ADDRESS_MUTATION,
  SAVE_ADDRESS_BOOK_MUTATION,
} from "./addressBookMutations";
import {
  mapAddressEdgesToAddressBook,
  mapApiAddressToBookEntry,
} from "./addressBookMappers";
import { GET_ADDRESS_BOOK_QUERY } from "./addressBookQueries";

function validateAddress(addressType, address) {
  const missingFields = [];
  const invalidLengthFields = [];

  if (!address.label.trim()) {
    missingFields.push("locationName");
  }
  if (!address.addressLine1.trim()) {
    missingFields.push("address");
  }
  if (!address.city.trim()) {
    missingFields.push("city");
  }
  if (!address.postalCode.trim()) {
    missingFields.push("postCode");
  }

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required ${addressType} address fields: ${missingFields.join(", ")}.`,
    );
  }

  if (address.label.trim().length > ADDRESS_FIELD_LIMITS.label) {
    invalidLengthFields.push(
      `locationName must be at most ${ADDRESS_FIELD_LIMITS.label} characters`,
    );
  }

  if (address.postalCode.trim().length > ADDRESS_FIELD_LIMITS.postalCode) {
    invalidLengthFields.push(
      `postCode must be at most ${ADDRESS_FIELD_LIMITS.postalCode} characters`,
    );
  }

  if (address.contactName.trim().length > ADDRESS_FIELD_LIMITS.contactName) {
    invalidLengthFields.push(
      `receivingName must be at most ${ADDRESS_FIELD_LIMITS.contactName} characters`,
    );
  }

  if (invalidLengthFields.length > 0) {
    throw new Error(
      `Invalid ${addressType} address fields: ${invalidLengthFields.join(", ")}.`,
    );
  }
}

export async function fetchAddressBook() {
  const response = await graphqlRequest({ query: GET_ADDRESS_BOOK_QUERY });

  if (!response?.me) {
    throw new Error("Unable to load address book.");
  }

  return mapAddressEdgesToAddressBook(response.me.addresses?.edges);
}

function normalizeAddressInput(address) {
  return {
    id: address.id && !`${address.id}`.startsWith("local-") ? address.id : null,
    locationName: `${address.label ?? ""}`.trim(),
    address: `${address.addressLine1 ?? ""}`.trim(),
    unitFloor: `${address.addressLine2 ?? ""}`.trim(),
    city: `${address.city ?? ""}`.trim(),
    state: `${address.state ?? ""}`.trim(),
    postCode: `${address.postalCode ?? ""}`.trim(),
    phone: `${address.phoneNumber ?? ""}`.trim(),
    receivingName: `${address.contactName ?? ""}`.trim(),
    instruction: `${address.instructions ?? ""}`.trim(),
    default: Boolean(address.isDefault),
  };
}

export async function saveAddressBook(addressBook) {
  for (const address of addressBook.delivery) {
    validateAddress("delivery", address);
  }

  for (const address of addressBook.invoice) {
    validateAddress("invoice", address);
  }

  const response = await graphqlRequest({
    query: SAVE_ADDRESS_BOOK_MUTATION,
    variables: {
      delivery: addressBook.delivery.map(normalizeAddressInput),
      invoice: addressBook.invoice.map(normalizeAddressInput),
    },
  });

  const result = response?.saveAddressBook;

  if (!result?.success) {
    const firstError = result?.errors?.[0];
    throw new Error(
      firstError?.message || result?.message || "Unable to save address book.",
    );
  }

  return {
    delivery: (result?.delivery || []).map(mapApiAddressToBookEntry),
    invoice: (result?.invoice || []).map(mapApiAddressToBookEntry),
  };
}

export async function deleteAddress(addressId) {
  const response = await graphqlRequest({
    query: DELETE_ADDRESS_MUTATION,
    variables: { addressId },
  });

  const result = response?.deleteAddress;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to delete address.");
  }

  return result;
}
