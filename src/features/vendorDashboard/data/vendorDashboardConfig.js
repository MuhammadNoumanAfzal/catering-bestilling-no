import {
  FiCreditCard,
  FiEdit3,
  FiGrid,
  FiHelpCircle,
  FiMapPin,
  FiPackage,
  FiSettings,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";

export const vendorNavigationItems = [
  {
    label: "Home",
    to: "/vendor-dashboard",
    end: true,
    icon: FiGrid,
  },
  {
    label: "Orders",
    to: "/vendor-dashboard/orders",
    icon: FiShoppingBag,
  },
  {
    label: "Restaurants",
    to: "/vendor-dashboard/restaurants",
    icon: FiPackage,
  },
  {
    label: "Invoice",
    to: "/vendor-dashboard/invoices",
    icon: FiCreditCard,
  },
  {
    label: "Notifications",
    to: "/vendor-dashboard/notifications",
    icon: FiHelpCircle,
  },
  {
    label: "Support",
    to: "/vendor-dashboard/support",
    icon: FiHelpCircle,
  },
  {
    label: "Address",
    to: "/vendor-dashboard/address",
    icon: FiMapPin,
  },
  {
    label: "Setting",
    to: "/vendor-dashboard/settings",
    icon: FiSettings,
  },
];

export const vendorSettingsLinks = [
  {
    label: "Edit Profile",
    icon: FiEdit3,
    to: "/vendor-dashboard/settings#profile",
  },
  {
    label: "Notification",
    icon: FiShield,
    to: "/vendor-dashboard/settings#notifications",
  },
];

export const vendorAddressInitialState = {
  deliveryLocationName: "",
  deliveryStreetAddress: "",
  deliveryUnitFloor: "",
  deliveryCity: "",
  deliveryState: "",
  deliveryZipCode: "",
  deliveryPhoneNumber: "",
  deliveryAskFor: "",
  deliveryInstructions: "",
  invoiceLocationName: "",
  invoiceStreetAddress: "",
  invoiceUnitFloor: "",
  invoiceCity: "",
  invoiceState: "",
  invoiceZipCode: "",
  invoicePhoneNumber: "",
  invoiceAskFor: "",
  invoiceInstructions: "",
};
