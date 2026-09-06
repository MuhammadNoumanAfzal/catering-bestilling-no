import {
  Bell,
  FileText,
  Grid2x2,
  LifeBuoy,
  MapPin,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRoundPen,
} from "lucide-react";

export const vendorNavigationItems = [
  {
    labelKey: "vendorPanel.nav.dashboard",
    to: "/vendor-dashboard",
    end: true,
    icon: Grid2x2,
  },
  {
    labelKey: "vendorPanel.nav.orders",
    to: "/vendor-dashboard/orders",
    icon: ShoppingBag,
  },
  {
    labelKey: "vendorPanel.nav.restaurants",
    to: "/vendor-dashboard/restaurants",
    icon: Store,
  },
  {
    labelKey: "vendorPanel.nav.invoices",
    to: "/vendor-dashboard/invoices",
    icon: FileText,
  },
  {
    labelKey: "vendorPanel.nav.notifications",
    to: "/vendor-dashboard/notifications",
    icon: Bell,
  },
  {
    labelKey: "vendorPanel.nav.support",
    to: "/vendor-dashboard/support",
    icon: LifeBuoy,
  },
  {
    labelKey: "vendorPanel.nav.address",
    to: "/vendor-dashboard/address",
    icon: MapPin,
  },
  {
    labelKey: "vendorPanel.nav.settings",
    to: "/vendor-dashboard/settings",
    icon: Settings,
  },
];

export const vendorSettingsLinks = [
  {
    labelKey: "vendorPanel.settingsLinks.editProfile",
    icon: UserRoundPen,
    to: "/vendor-dashboard/settings#profile",
  },
  {
    labelKey: "vendorPanel.settingsLinks.notification",
    icon: ShieldCheck,
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
