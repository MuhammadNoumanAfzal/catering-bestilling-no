import { buildCheckoutAddressFields } from "../../../utils/customerProfileStorage";
import {
  SALES_TAX_RATE,
  getVendorTotals,
} from "../components/summary/checkoutSummaryUtils";
import { CHECKOUT_MODE_LABELS } from "../constants/checkoutForm";

function normalizeAddressType(addressType) {
  const normalized = `${addressType ?? ""}`.trim().toLowerCase();

  if (normalized.includes("invoice")) {
    return "invoice";
  }

  return "delivery";
}

function mapUserAddress(addressNode, user) {
  return {
    id: addressNode?.id || `${normalizeAddressType(addressNode?.addressType)}-${addressNode?.locationName || "address"}`,
    label: addressNode?.locationName || "Saved address",
    contactName: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    addressLine1: addressNode?.address || "",
    addressLine2: addressNode?.unitFloor || "",
    city: addressNode?.city || "",
    state: "",
    postalCode: addressNode?.postCode || "",
    phoneNumber: user?.phone || "",
    instructions: "",
    isDefault: Boolean(addressNode?.default),
  };
}

function ensureDefaultAddress(addresses) {
  if (addresses.length === 0) {
    return [];
  }

  if (addresses.some((address) => address.isDefault)) {
    return addresses;
  }

  return addresses.map((address, index) => ({
    ...address,
    isDefault: index === 0,
  }));
}

export function mapCurrentUserToCheckoutProfile(user) {
  const rawAddresses = (user?.addresses?.edges || []).map((edge) => edge.node);
  const baseDeliveryAddresses = ensureDefaultAddress(
    rawAddresses
      .filter((address) => normalizeAddressType(address.addressType) === "delivery")
      .map((address) => mapUserAddress(address, user)),
  );
  const baseInvoiceAddresses = ensureDefaultAddress(
    rawAddresses
      .filter((address) => normalizeAddressType(address.addressType) === "invoice")
      .map((address) => mapUserAddress(address, user)),
  );
  const deliveryAddresses =
    baseDeliveryAddresses.length > 0 ? baseDeliveryAddresses : baseInvoiceAddresses;
  const invoiceAddresses =
    baseInvoiceAddresses.length > 0 ? baseInvoiceAddresses : baseDeliveryAddresses;

  const defaultDeliveryAddress =
    deliveryAddresses.find((address) => address.isDefault) ||
    deliveryAddresses[0] ||
    null;
  const defaultInvoiceAddress =
    invoiceAddresses.find((address) => address.isDefault) ||
    invoiceAddresses[0] ||
    defaultDeliveryAddress;

  return {
    settings: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      primaryEmail: user?.email || "",
      mobilePhone: user?.phone || "",
    },
    deliveryAddresses,
    invoiceAddresses,
    formState: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      ...buildCheckoutAddressFields("delivery", defaultDeliveryAddress),
      ...buildCheckoutAddressFields("invoice", defaultInvoiceAddress),
    },
  };
}

function formatEventTime(value) {
  const normalized = `${value ?? ""}`.trim();

  if (!normalized) {
    return "";
  }

  return /^\d{2}:\d{2}$/.test(normalized) ? `${normalized}:00` : normalized;
}

function resolveVendorId(cart) {
  return cart.vendor.id || "";
}

function resolveProductId(item) {
  if (item.productId) {
    return `${item.productId}`;
  }

  const matched = `${item.id ?? ""}`.match(/^(\d+)/);
  return matched ? matched[1] : "";
}

function normalizeSelectedOptions(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, optionValue]) => [`${key ?? ""}`.trim(), `${optionValue ?? ""}`.trim()])
      .filter(([key, optionValue]) => key && optionValue),
  );
}

function normalizeSelectedAddons(items, parentProductId) {
  return items
    .filter(
      (item) =>
        item?.isAddOn &&
        `${item.parentMenuItemId ?? ""}` === `${parentProductId ?? ""}`,
    )
    .map((item) => {
      const quantity = Math.max(1, Number(item.quantity ?? 1));

      return {
        name: quantity > 1 ? `${item.name || "Add-on"} x${quantity}` : item.name || "Add-on",
        price: Number(item.unitPrice ?? item.price ?? 0),
      };
    })
    .filter((item) => item.name && Number.isFinite(item.price));
}

function validateRequiredFields(payload, requiredKeys) {
  const missingKeys = requiredKeys.filter((key) => !`${payload[key] ?? ""}`.trim());

  if (missingKeys.length > 0) {
    throw new Error(`Missing required checkout fields: ${missingKeys.join(", ")}.`);
  }
}

function buildOrderItems(items) {
  return items
    .filter((item) => !item?.isAddOn)
    .map((item) => {
      const productId = resolveProductId(item);

      if (!productId) {
        throw new Error(
          `Cart item "${item.name || item.id}" is missing a valid product id.`,
        );
      }

      const selectedOptions = normalizeSelectedOptions(item.selectedOptions);
      const selectedAddons = normalizeSelectedAddons(items, productId);
      const specialInstructions = `${item.specialInstructions ?? ""}`.trim();

      return {
        product: productId,
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        ...(Object.keys(selectedOptions).length > 0
          ? { selectedOptions }
          : {}),
        ...(selectedAddons.length > 0 ? { selectedAddons } : {}),
        ...(specialInstructions ? { specialInstructions } : {}),
      };
    });
}

export function buildPlaceOrderPayload({ cart, checkoutType, formState }) {
  const vendorId = resolveVendorId(cart);

  if (!vendorId) {
    throw new Error(`Unable to resolve vendor id for ${cart.vendor.name}.`);
  }

  const items = buildOrderItems(cart.orderSummary.items);

  if (items.length === 0) {
    throw new Error(`No valid order items found for ${cart.vendor.name}.`);
  }

  const totals = getVendorTotals(cart);
  const payload = {
    vendorId,
    customerType: CHECKOUT_MODE_LABELS[checkoutType],
    invoiceReference: formState.invoiceReference,
    email: formState.email,
    phone: formState.phone,
    deliveryAddress: formState.deliveryAddress,
    deliverySuite: formState.deliveryAddressLine2,
    deliveryPostalCode: formState.deliveryPostalCode,
    deliveryCity: formState.deliveryCity,
    invoiceAddress: formState.invoiceAddress,
    invoiceSuite: formState.invoiceAddressLine2,
    invoicePostalCode: formState.invoicePostalCode,
    invoiceCity: formState.invoiceCity,
    eventDate: formState.date,
    eventTime: formatEventTime(formState.time),
    personCount: Number(cart.orderSummary.personCount ?? formState.personCount ?? 1),
    tipAmount: totals.tipValue.toFixed(2),
    taxPercent: (SALES_TAX_RATE * 100).toFixed(1),
    orderNotes: formState.additionalInfo,
    items,
  };

  validateRequiredFields(payload, [
    "invoiceReference",
    "email",
    "phone",
    "deliveryAddress",
    "deliveryPostalCode",
    "deliveryCity",
    "invoiceAddress",
    "invoicePostalCode",
    "invoiceCity",
    "eventDate",
    "eventTime",
  ]);

  if (checkoutType === "corporate") {
    const corporatePayload = {
      ...payload,
      corporateName: formState.companyName,
      organizationNumber: formState.organizationNumber,
      eventName: formState.eventName,
    };

    validateRequiredFields(corporatePayload, [
      "corporateName",
      "organizationNumber",
      "eventName",
    ]);

    return corporatePayload;
  }

  const privatePayload = {
    ...payload,
    occasion: formState.occasion,
  };

  validateRequiredFields(privatePayload, ["occasion"]);

  return privatePayload;
}
