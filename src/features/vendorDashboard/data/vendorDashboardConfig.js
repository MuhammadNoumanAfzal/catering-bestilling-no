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
    to: "/client-dashboard",
    end: true,
    icon: Grid2x2,
  },
  {
    labelKey: "vendorPanel.nav.orders",
    to: "/client-dashboard/orders",
    icon: ShoppingBag,
  },
  {
    labelKey: "vendorPanel.nav.restaurants",
    to: "/client-dashboard/restaurants",
    icon: Store,
  },
  {
    labelKey: "vendorPanel.nav.invoices",
    to: "/client-dashboard/invoices",
    icon: FileText,
  },
  {
    labelKey: "vendorPanel.nav.notifications",
    to: "/client-dashboard/notifications",
    icon: Bell,
  },
  {
    labelKey: "vendorPanel.nav.support",
    to: "/client-dashboard/support",
    icon: LifeBuoy,
  },
  {
    labelKey: "vendorPanel.nav.address",
    to: "/client-dashboard/address",
    icon: MapPin,
  },
  {
    labelKey: "vendorPanel.nav.settings",
    to: "/client-dashboard/settings",
    icon: Settings,
  },
];

export const vendorSettingsLinks = [
  {
    labelKey: "vendorPanel.settingsLinks.editProfile",
    icon: UserRoundPen,
    to: "/client-dashboard/settings#profile",
  },
  {
    labelKey: "vendorPanel.settingsLinks.notification",
    icon: ShieldCheck,
    to: "/client-dashboard/settings#notifications",
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
