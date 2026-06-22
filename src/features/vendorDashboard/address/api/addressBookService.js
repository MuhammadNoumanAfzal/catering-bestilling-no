import { graphqlRequest } from "../../../../lib/api/graphqlClient";
import { buildAddressMutation } from "./addressBookMutations";
import {
  mapAddressEdgesToAddressBook,
  mapApiAddressToBookEntry,
} from "./addressBookMappers";
import { GET_ADDRESS_BOOK_QUERY } from "./addressBookQueries";

function validateAddress(addressType, address) {
  const missingFields = [];

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
}

export async function fetchAddressBook() {
  const response = await graphqlRequest({ query: GET_ADDRESS_BOOK_QUERY });

  if (!response?.me) {
    throw new Error("Unable to load address book.");
  }

  return mapAddressEdgesToAddressBook(response.me.addresses?.edges);
}

async function saveAddress(addressType, address) {
  validateAddress(addressType, address);

  const query = buildAddressMutation(addressType, address);
  const response = await graphqlRequest({ query });
  const result = response?.addressMutation;

  if (!result?.success || !result?.instance) {
    throw new Error(result?.message || `Unable to save ${addressType} address.`);
  }

  return mapApiAddressToBookEntry(result.instance);
}

export async function saveAddressBook(addressBook) {
  const savedAddressBook = {
    delivery: [],
    invoice: [],
  };

  for (const address of addressBook.delivery) {
    savedAddressBook.delivery.push(await saveAddress("delivery", address));
  }

  for (const address of addressBook.invoice) {
    savedAddressBook.invoice.push(await saveAddress("invoice", address));
  }

  return savedAddressBook;
}
