import {
  FiBell,
  FiCreditCard,
  FiEdit3,
  FiGrid,
  FiHeadphones,
  FiMapPin,
  FiPackage,
  FiSettings,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";

export const vendorNavigationItems = [
  {
    labelKey: "vendorPanel.nav.dashboard",
    to: "/vendor-dashboard",
    end: true,
    icon: FiGrid,
  },
  {
    labelKey: "vendorPanel.nav.orders",
    to: "/vendor-dashboard/orders",
    icon: FiShoppingBag,
  },
  {
    labelKey: "vendorPanel.nav.restaurants",
    to: "/vendor-dashboard/restaurants",
    icon: FiPackage,
  },
  {
    labelKey: "vendorPanel.nav.invoices",
    to: "/vendor-dashboard/invoices",
    icon: FiCreditCard,
  },
  {
    labelKey: "vendorPanel.nav.notifications",
    to: "/vendor-dashboard/notifications",
    icon: FiBell,
  },
  {
    labelKey: "vendorPanel.nav.support",
    to: "/vendor-dashboard/support",
    icon: FiHeadphones,
  },
  {
    labelKey: "vendorPanel.nav.address",
    to: "/vendor-dashboard/address",
    icon: FiMapPin,
  },
  {
    labelKey: "vendorPanel.nav.settings",
    to: "/vendor-dashboard/settings",
    icon: FiSettings,
  },
];

export const vendorSettingsLinks = [
  {
    labelKey: "vendorPanel.settingsLinks.editProfile",
    icon: FiEdit3,
    to: "/vendor-dashboard/settings#profile",
  },
  {
    labelKey: "vendorPanel.settingsLinks.notification",
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
