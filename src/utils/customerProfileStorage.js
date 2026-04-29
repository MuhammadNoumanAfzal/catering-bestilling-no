import {
  vendorAddressInitialState,
  vendorSettingsInitialState,
} from "../features/vendorDashboard/data/vendorDashboardData";

const STORAGE_KEY = "customer-profile-storage";

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createAddressEntry(prefix, values, isDefault = false) {
  return {
    id: createId(prefix),
    label: values.locationName || `${prefix} address`,
    contactName: values.askFor || "",
    addressLine1: values.streetAddress || "",
    addressLine2: values.unitFloor || "",
    city: values.city || "",
    state: values.state || "",
    postalCode: values.zipCode || "",
    phoneNumber: values.phoneNumber || "",
    instructions: values.instructions || "",
    isDefault,
  };
}

function createInitialStorageState() {
  return {
    settings: { ...vendorSettingsInitialState },
    addresses: {
      delivery: [
        createAddressEntry(
          "delivery",
          {
            locationName: vendorAddressInitialState.deliveryLocationName,
            streetAddress: vendorAddressInitialState.deliveryStreetAddress,
            unitFloor: vendorAddressInitialState.deliveryUnitFloor,
            city: vendorAddressInitialState.deliveryCity,
            state: vendorAddressInitialState.deliveryState,
            zipCode: vendorAddressInitialState.deliveryZipCode,
            phoneNumber: vendorAddressInitialState.deliveryPhoneNumber,
            askFor: vendorAddressInitialState.deliveryAskFor,
            instructions: vendorAddressInitialState.deliveryInstructions,
          },
          true,
        ),
      ],
      invoice: [
        createAddressEntry(
          "invoice",
          {
            locationName: vendorAddressInitialState.invoiceLocationName,
            streetAddress: vendorAddressInitialState.invoiceStreetAddress,
            unitFloor: vendorAddressInitialState.invoiceUnitFloor,
            city: vendorAddressInitialState.invoiceCity,
            state: vendorAddressInitialState.invoiceState,
            zipCode: vendorAddressInitialState.invoiceZipCode,
            phoneNumber: vendorAddressInitialState.invoicePhoneNumber,
            askFor: vendorAddressInitialState.invoiceAskFor,
            instructions: vendorAddressInitialState.invoiceInstructions,
          },
          true,
        ),
      ],
    },
  };
}

function normalizeAddresses(addresses, type) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return createInitialStorageState().addresses[type];
  }

  const normalized = addresses.map((address, index) => ({
    id: address?.id || createId(type),
    label: address?.label || `${type} address ${index + 1}`,
    contactName: address?.contactName || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    phoneNumber: address?.phoneNumber || "",
    instructions: address?.instructions || "",
    isDefault: Boolean(address?.isDefault),
  }));

  if (!normalized.some((address) => address.isDefault)) {
    normalized[0].isDefault = true;
  }

  return normalized.map((address, index) => ({
    ...address,
    isDefault: index === normalized.findIndex((item) => item.isDefault),
  }));
}

function normalizeStorageState(value) {
  const initialState = createInitialStorageState();

  return {
    settings: {
      ...initialState.settings,
      ...(value?.settings ?? {}),
    },
    addresses: {
      delivery: normalizeAddresses(value?.addresses?.delivery, "delivery"),
      invoice: normalizeAddresses(value?.addresses?.invoice, "invoice"),
    },
  };
}

export function readCustomerProfileStorage() {
  if (typeof window === "undefined") {
    return createInitialStorageState();
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      const initialState = createInitialStorageState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
      return initialState;
    }

    return normalizeStorageState(JSON.parse(storedValue));
  } catch {
    return createInitialStorageState();
  }
}

export function writeCustomerProfileStorage(value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizeStorageState(value)),
  );
}

export function readSavedSettings() {
  return readCustomerProfileStorage().settings;
}

export function writeSavedSettings(settings) {
  const current = readCustomerProfileStorage();
  writeCustomerProfileStorage({
    ...current,
    settings: {
      ...current.settings,
      ...settings,
    },
  });
}

export function readSavedAddresses(type) {
  return readCustomerProfileStorage().addresses[type] ?? [];
}

export function writeSavedAddresses(type, addresses) {
  const current = readCustomerProfileStorage();
  writeCustomerProfileStorage({
    ...current,
    addresses: {
      ...current.addresses,
      [type]: normalizeAddresses(addresses, type),
    },
  });
}

export function getDefaultSavedAddress(type) {
  const addresses = readSavedAddresses(type);
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}

export function createBlankSavedAddress(type) {
  return {
    id: createId(type),
    label: "",
    contactName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    instructions: "",
    isDefault: false,
  };
}

export function buildCheckoutAddressFields(type, address, fallbackAddress = "") {
  const normalizedType = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

  return {
    [`selected${normalizedType}AddressId`]: address?.id ?? "",
    [`${type}Address`]: address?.addressLine1 || fallbackAddress || "",
    [`${type}AddressLine2`]: address?.addressLine2 || "",
    [`${type}City`]: address?.city || "",
    [`${type}PostalCode`]: address?.postalCode || "",
    [`${type}AddressLabel`]: address?.label || "",
    [`${type}ContactName`]: address?.contactName || "",
    [`${type}PhoneNumber`]: address?.phoneNumber || "",
    [`${type}Instructions`]: address?.instructions || "",
  };
}
