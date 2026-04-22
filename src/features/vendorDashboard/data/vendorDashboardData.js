import {
  FiAward,
  FiCreditCard,
  FiEdit3,
  FiGrid,
  FiLock,
  FiMapPin,
  FiPackage,
  FiSettings,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
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
    label: "Reward",
    to: "/vendor-dashboard/rewards",
    icon: FiAward,
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

export const vendorStats = [
  {
    label: "Total Orders",
    value: 124,
    icon: FiTruck,
  },
  {
    label: "Pending Invoice",
    value: 73,
    icon: FiCreditCard,
  },
  {
    label: "Reward Points",
    value: 22,
    icon: FiStar,
  },
];

export const vendorRecentOrders = [
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Scheduled",
  },
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Draft",
  },
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Delivered",
  },
];

export const vendorInvoices = [
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Pending",
    amount: "$548.73",
  },
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Completed",
    amount: "$548.73",
  },
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Pending",
    amount: "$548.73",
  },
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Completed",
    amount: "$548.73",
  },
  {
    id: "#12549",
    date: "05 Mar 2025",
    status: "Pending",
    amount: "$548.73",
  },
];

export const vendorSettingsLinks = [
  {
    label: "Edit Profile",
    icon: FiEdit3,
  },
  {
    label: "Password",
    icon: FiLock,
  },
  {
    label: "Notification",
    icon: FiShield,
  },
];

export const vendorRestaurants = [
  {
    id: "bergen-bites",
    name: "Bergen Bites",
    cuisine: "Norwegian Lunch",
    orders: 48,
    status: "Active",
    address: "Bryggen 12, Bergen",
  },
  {
    id: "fjord-feast",
    name: "Fjord Feast",
    cuisine: "Seafood Catering",
    orders: 31,
    status: "Busy",
    address: "Nygardsgaten 21, Bergen",
  },
  {
    id: "nordic-table",
    name: "Nordic Table",
    cuisine: "Corporate Buffet",
    orders: 19,
    status: "Paused",
    address: "Marken 8, Bergen",
  },
];
