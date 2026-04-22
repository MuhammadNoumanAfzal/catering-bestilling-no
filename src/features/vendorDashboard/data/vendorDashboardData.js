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
    to: "/vendor-dashboard/settings#profile",
  },
  {
    label: "Password",
    icon: FiLock,
    to: "/vendor-dashboard/settings#password",
  },
  {
    label: "Notification",
    icon: FiShield,
    to: "/vendor-dashboard/settings#notifications",
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

export const vendorOrderStatusSummary = [
  { label: "Total Orders", value: 124 },
  { label: "Completed", value: 73 },
  { label: "Scheduled", value: 22 },
  { label: "Drafts", value: 8 },
];

export const vendorOrders = [
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Annual Dinner",
    date: "05 Mar 2025",
    person: 20,
    total: "$548.73",
    status: "Scheduled",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Annual Dinner",
    date: "04 Mar 2025",
    person: 20,
    total: "$548.73",
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Annual Dinner",
    date: "03 Mar 2025",
    person: 35,
    total: "$548.73",
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Annual Dinner",
    date: "01 Mar 2025",
    person: 15,
    total: "$548.73",
    status: "Draft",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Birthday Party",
    date: "25 Feb 2025",
    person: 20,
    total: "$548.73",
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Office Event",
    date: "20 Feb 2025",
    person: 50,
    total: "$548.73",
    status: "Scheduled",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Family Dinner",
    date: "15 Feb 2025",
    person: 20,
    total: "$548.73",
    status: "Draft",
  },
  {
    id: "#12549",
    vendor: "Flint's Grill",
    eventName: "Annual Dinner",
    date: "05 Feb 2025",
    person: 20,
    total: "$745.23",
    status: "Scheduled",
  },
  {
    id: "#12550",
    vendor: "Nordic Table",
    eventName: "Board Lunch",
    date: "31 Jan 2025",
    person: 18,
    total: "$415.00",
    status: "Delivered",
  },
  {
    id: "#12551",
    vendor: "Fjord Feast",
    eventName: "Seafood Buffet",
    date: "29 Jan 2025",
    person: 42,
    total: "$892.40",
    status: "Completed",
  },
  {
    id: "#12552",
    vendor: "Bergen Bites",
    eventName: "Training Lunch",
    date: "28 Jan 2025",
    person: 24,
    total: "$386.15",
    status: "Completed",
  },
  {
    id: "#12553",
    vendor: "Nordic Table",
    eventName: "Quarterly Meetup",
    date: "26 Jan 2025",
    person: 60,
    total: "$1,148.00",
    status: "Scheduled",
  },
];
