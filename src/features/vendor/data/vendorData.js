import {
  foodTypeMenuItems,
  occasionMenuItems,
} from "../../browse/data/browseData";
import {
  featuredVendors,
  popularProducts,
  popularVendors,
} from "../../home/data/homeData";

const DEFAULT_SECTIONS = [
  "All - in - One Order",
  "Appetizers",
  "Catering Packages",
  "Boxed Lunches",
];

const SECTION_SUBCATEGORIES = {
  "All - in - One Order": [
    "Full Meal",
    "Office Combo",
    "Team Lunch",
    "Chef Selection",
  ],
  Appetizers: [
    "Finger Food",
    "Warm Starters",
    "Fresh Sides",
    "Sharing Plates",
  ],
  "Catering Packages": [
    "Individual Packing",
    "Meeting Trays",
    "Party Sets",
    "Premium Package",
  ],
  "Boxed Lunches": [
    "Classic Box",
    "Healthy Box",
    "Wrap Box",
    "Premium Box",
  ],
};

const WEEKDAY_SHORT_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTimeLabel(time) {
  const [rawHours = "0", rawMinutes = "00"] = `${time}`.split(":");
  const hours = Number(rawHours);
  const suffix = hours >= 12 ? "pm" : "am";
  const normalizedHours = hours % 12 || 12;
  const minutes = rawMinutes === "00" ? "" : `:${rawMinutes}`;

  return `${normalizedHours}${minutes}${suffix}`;
}

function formatDayRangeLabel(days = []) {
  if (days.length === 0) {
    return "Unavailable";
  }

  if (days.length === 7) {
    return "Daily";
  }

  const sortedDays = [...days].sort((left, right) => left - right);
  const firstDay = sortedDays[0];
  const lastDay = sortedDays[sortedDays.length - 1];
  const isContinuousRange =
    sortedDays.length > 1 &&
    sortedDays.every((day, index) => day === firstDay + index);

  if (isContinuousRange) {
    return `${WEEKDAY_SHORT_LABELS[firstDay]}-${WEEKDAY_SHORT_LABELS[lastDay]}`;
  }

  return sortedDays.map((day) => WEEKDAY_SHORT_LABELS[day]).join(", ");
}

function createAvailability({
  deliveryDays = [1, 2, 3, 4, 5],
  deliveryStart = "09:00",
  deliveryEnd = "18:00",
  takeoutDays = [1, 2, 3, 4, 5],
  takeoutStart = "09:00",
  takeoutEnd = "20:00",
} = {}) {
  return {
    delivery: {
      days: deliveryDays,
      start: deliveryStart,
      end: deliveryEnd,
      label: `${formatDayRangeLabel(deliveryDays)}: ${formatTimeLabel(
        deliveryStart,
      )}-${formatTimeLabel(deliveryEnd)}`,
    },
    takeout: {
      days: takeoutDays,
      start: takeoutStart,
      end: takeoutEnd,
      label: `${formatDayRangeLabel(takeoutDays)}: ${formatTimeLabel(
        takeoutStart,
      )}-${formatTimeLabel(takeoutEnd)}`,
    },
  };
}

const vendorDirectory = [
  {
    slug: "flints-grill",
    name: "Flint's Grill",
    logo: "/home/vendorLogo.png",
    banner: "/home/hero1.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 4.8,
    reviewCount: 450,
    cuisine: "Grill",
    addressLine: "45 Storgata, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 30 Delivery fee",
    leadTime: "30-45 min",
    availability: createAvailability(),
  },
  {
    slug: "the-queens-kebab",
    name: "The Queen's Kebab",
    logo: "/home/vendorLogo.png",
    banner: "/home/v.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.9,
    reviewCount: 410,
    cuisine: "Kebab & Grill",
    addressLine: "8 Strandgaten, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 35 Delivery fee",
    leadTime: "25-40 min",
    availability: createAvailability({
      deliveryStart: "10:00",
      deliveryEnd: "19:00",
      takeoutEnd: "21:00",
    }),
  },
  {
    slug: "brobekk-grill-pizza",
    name: "Brobekk Grill & Pizza",
    logo: "/home/logo.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 4.0,
    reviewCount: 198,
    cuisine: "Pizza & Grill",
    addressLine: "11 Sentrum, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 0 Delivery fee",
    leadTime: "20-40 min",
    availability: createAvailability({
      deliveryDays: [1, 2, 3, 4, 5, 6],
      takeoutDays: [1, 2, 3, 4, 5, 6],
      deliveryEnd: "20:00",
      takeoutEnd: "22:00",
    }),
  },
  {
    slug: "mcdonalds-main-street",
    name: "McDonald's Main Street",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 3.9,
    reviewCount: 260,
    cuisine: "Fast Food",
    addressLine: "22 Main Street, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 40 Delivery fee",
    leadTime: "20-35 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "08:00",
      deliveryEnd: "23:00",
      takeoutStart: "08:00",
      takeoutEnd: "23:30",
    }),
  },
  {
    slug: "talormade-bispevika",
    name: "Talormade Bispevika",
    logo: "/home/logo2.png",
    banner: "/home/v.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.0,
    reviewCount: 305,
    cuisine: "Bakery & Lunch",
    addressLine: "12 Bryggen, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 20 Delivery fee",
    leadTime: "20-30 min",
    availability: createAvailability({
      deliveryStart: "08:30",
      deliveryEnd: "17:30",
      takeoutStart: "08:00",
      takeoutEnd: "18:30",
    }),
  },
  {
    slug: "eckers-frogner",
    name: "Eckers Frogner",
    logo: "/home/logo.png",
    banner: "/home/hero1.webp",
    heroSideImage: "/home/v.webp",
    rating: 3.5,
    reviewCount: 156,
    cuisine: "Cafe",
    addressLine: "7 Frognerveien, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 45 Delivery fee",
    leadTime: "25-40 min",
    availability: createAvailability({
      deliveryStart: "09:30",
      deliveryEnd: "17:00",
      takeoutEnd: "19:00",
    }),
  },
  {
    slug: "nordic-lunch-house",
    name: "Nordic Lunch House",
    logo: "/home/logo2.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.8,
    reviewCount: 335,
    cuisine: "Nordic Lunch",
    addressLine: "31 Harbour Street, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 29 Delivery fee",
    leadTime: "20-30 min",
    availability: createAvailability({
      deliveryStart: "07:30",
      deliveryEnd: "16:30",
      takeoutStart: "07:00",
      takeoutEnd: "18:00",
    }),
  },
  {
    slug: "urban-salad-kitchen",
    name: "Urban Salad Kitchen",
    logo: "/home/logo.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/v.webp",
    rating: 4.7,
    reviewCount: 287,
    cuisine: "Healthy Bowls",
    addressLine: "17 Marken, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 32 Delivery fee",
    leadTime: "15-25 min",
    availability: createAvailability({
      deliveryDays: [1, 2, 3, 4, 5, 6],
      takeoutDays: [1, 2, 3, 4, 5, 6],
      deliveryStart: "08:00",
      deliveryEnd: "18:30",
      takeoutEnd: "20:00",
    }),
  },
  {
    slug: "pizza-corner",
    name: "Pizza Corner",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.6,
    reviewCount: 344,
    cuisine: "Pizza",
    addressLine: "4 Torget, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 38 Delivery fee",
    leadTime: "20-35 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "11:00",
      deliveryEnd: "22:00",
      takeoutStart: "11:00",
      takeoutEnd: "23:00",
    }),
  },
  {
    slug: "morning-bite-cafe",
    name: "Morning Bite Cafe",
    logo: "/home/logo2.png",
    banner: "/home/v.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.5,
    reviewCount: 208,
    cuisine: "Breakfast & Cafe",
    addressLine: "29 Nygardsgaten, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 25 Delivery fee",
    leadTime: "15-20 min",
    availability: createAvailability({
      deliveryStart: "07:00",
      deliveryEnd: "15:00",
      takeoutStart: "06:30",
      takeoutEnd: "16:00",
    }),
  },
  {
    slug: "oslo-wrap-house",
    name: "Oslo Wrap House",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero2.webp",
    rating: 4.4,
    reviewCount: 243,
    cuisine: "Wraps",
    addressLine: "13 Strandkaien, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 35 Delivery fee",
    leadTime: "20-30 min",
    availability: createAvailability({
      deliveryStart: "10:30",
      deliveryEnd: "19:30",
      takeoutEnd: "20:30",
    }),
  },
  {
    slug: "golden-fork-kitchen",
    name: "Golden Fork Kitchen",
    logo: "/home/logo2.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 4.3,
    reviewCount: 276,
    cuisine: "Catering",
    addressLine: "21 City Center, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 39 Delivery fee",
    leadTime: "20-40 min",
    availability: createAvailability({
      deliveryDays: [1, 2, 3, 4, 5, 6],
      takeoutDays: [1, 2, 3, 4, 5, 6],
      deliveryStart: "09:00",
      deliveryEnd: "19:00",
      takeoutEnd: "21:00",
    }),
  },
  {
    slug: "max-egertorget",
    name: "Max - Egertorget",
    logo: "/home/logo.png",
    banner: "/home/hero1.webp",
    heroSideImage: "/home/hero3.webp",
    rating: 3.9,
    reviewCount: 302,
    cuisine: "Burgers",
    addressLine: "Egertorget 5, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 20 Delivery fee",
    leadTime: "15-30 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "10:00",
      deliveryEnd: "22:00",
      takeoutStart: "10:00",
      takeoutEnd: "23:00",
    }),
  },
  {
    slug: "fly-chicken-steen",
    name: "Fly Chicken - Steen",
    logo: "/home/logo.png",
    banner: "/home/hero3.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.9,
    reviewCount: 187,
    cuisine: "Chicken",
    addressLine: "Steen Avenue 3, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 20 Delivery fee",
    leadTime: "10-20 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "11:00",
      deliveryEnd: "22:30",
      takeoutStart: "11:00",
      takeoutEnd: "23:30",
    }),
  },
  {
    slug: "dominos-pizza-storo",
    name: "Domino's Pizza Storo",
    logo: "/home/logo2.png",
    banner: "/home/hero2.webp",
    heroSideImage: "/home/hero1.webp",
    rating: 4.5,
    reviewCount: 268,
    cuisine: "Pizza",
    addressLine: "Storo 18, Bergen",
    city: "Bergen",
    deliveryFee: "NOK 45 Delivery fee",
    leadTime: "20-35 min",
    availability: createAvailability({
      deliveryDays: [0, 1, 2, 3, 4, 5, 6],
      takeoutDays: [0, 1, 2, 3, 4, 5, 6],
      deliveryStart: "11:00",
      deliveryEnd: "22:00",
      takeoutStart: "11:00",
      takeoutEnd: "23:00",
    }),
  },
];

const sectionDescriptions = {
  "All - in - One Order":
    "A full spread with hot mains, fresh sides, and ready-to-serve setup.",
  Appetizers: "Quick bites and warm starters that work well for sharing.",
  "Catering Packages":
    "Ready-made bundles for meetings, events, and office lunches.",
  "Boxed Lunches": "Easy individual meals packaged for smooth team delivery.",
};

function formatVendorName(vendorName = "") {
  return vendorName.replace(/^By\s+/, "").trim();
}

function parsePrice(price) {
  const matched = `${price}`.match(/(\d+)/);
  return matched ? Number(matched[1]) : 120;
}

function createRequiredOptions(title, index) {
  return [
    "Grilled Chicken",
    "Carnitas",
    "Grilled Veggies",
    "Al Pastor",
    "Chili Verde",
    "Rice & Beans",
    `${title} Special`,
    `Chef Pick ${index + 1}`,
  ];
}

function createOptionalGroup(title, offset) {
  return {
    title,
    subtitle: "Optional",
    options: [
      { label: "Guacamole", price: 1.8 + offset },
      { label: "Sour Cream", price: 0.5 + offset },
      { label: "Extra Protein", price: 3.25 + offset },
      { label: "Extra Cheese", price: 1.65 + offset },
    ],
  };
}

function createItemFromSeed(seed, sectionTitle, index) {
  const sectionOffset = DEFAULT_SECTIONS.indexOf(sectionTitle) * 12;
  const price = parsePrice(seed.price) + sectionOffset;
  const serves = 5 + ((index + sectionOffset) % 4) * 5;
  const subcategory =
    SECTION_SUBCATEGORIES[sectionTitle]?.[index] ?? sectionTitle;

  return {
    id: `${seed.slug}-${sectionTitle}-${index}`,
    title: index === 0 ? seed.title : `${subcategory}`,
    image: seed.image,
    serves,
    subcategory,
    tag:
      index === 0 && sectionTitle === "Catering Packages" ? "Most ordered" : "",
    description:
      sectionDescriptions[sectionTitle] ??
      "Freshly prepared menu designed for office lunches and catered events.",
    price,
    modal: {
      heading: seed.title,
      pricePerPerson: (price / Math.max(serves, 1)).toFixed(2),
      badge: subcategory,
      quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
      requiredSelection: {
        title: "Select protein or vegetables:",
        subtitle: "Required · 1 option",
        options: createRequiredOptions(seed.title, index),
      },
      optionalSelections: [
        createOptionalGroup("Add:", index * 0.15),
        {
          title: "Add extra side:",
          subtitle: "Optional",
          options: [
            { label: "Side Salad", price: 1.2 + index * 0.1 },
            { label: "Chips", price: 0.9 + index * 0.1 },
            { label: "Fresh Fruit", price: 1.4 + index * 0.1 },
          ],
        },
      ],
      instructionPlaceholder:
        "Let the restaurant know of any allergies or preparation instructions.",
    },
  };
}

function createFallbackSeed(vendor) {
  return [
    {
      slug: `${vendor.slug}-signature-platter`,
      title: `${vendor.name} Signature Platter`,
      image: vendor.banner,
      price: "NOK 189",
    },
    {
      slug: `${vendor.slug}-chef-special`,
      title: `${vendor.cuisine} Chef Special`,
      image: vendor.heroSideImage,
      price: "NOK 149",
    },
  ];
}

const menuSeedByVendor = [
  ...foodTypeMenuItems,
  ...occasionMenuItems,
  ...popularProducts,
].reduce((accumulator, item) => {
  const key = item.vendorSlug;
  if (!key) {
    return accumulator;
  }

  accumulator[key] = [...(accumulator[key] ?? []), item];
  return accumulator;
}, {});

export const vendorPreviewCards = [...popularVendors, ...featuredVendors];

function buildMenuSections(vendor) {
  const seeds = menuSeedByVendor[vendor.slug] ?? createFallbackSeed(vendor);

  return DEFAULT_SECTIONS.map((sectionTitle, sectionIndex) => ({
    id: `${vendor.slug}-${sectionIndex}`,
    title: sectionTitle,
    items: Array.from({ length: 4 }, (_, itemIndex) =>
      createItemFromSeed(
        {
          ...seeds[itemIndex % seeds.length],
          title:
            sectionIndex === 0 || itemIndex === 0
              ? seeds[itemIndex % seeds.length].title
              : `${vendor.name} ${sectionIndex + 1}`,
        },
        sectionTitle,
        itemIndex,
      ),
    ),
  }));
}

function createOrderSummary(menuSections) {
  const selectedItems = menuSections
    .flatMap((section) => section.items)
    .slice(0, 2)
    .map((item, index) => ({
      id: item.id,
      quantity: index === 0 ? 15 : 1,
      name: item.title,
      price: index === 0 ? item.price + 15 : item.price,
      details: [`Serves ${item.serves}`, "Tax Included"],
    }));

  const itemsTotal = selectedItems.reduce(
    (total, item) => total + item.price,
    0,
  );
  const deliveryFee = 32.83;
  const tip = 0;

  return {
    items: selectedItems,
    breakdown: [
      { label: "Food & beverage", value: itemsTotal.toFixed(2) },
      { label: "Restaurant delivery fee", value: itemsTotal.toFixed(2) },
      { label: "30% Sales tax", value: deliveryFee.toFixed(2) },
      { label: "Tip", value: tip.toFixed(2) },
    ],
    deliveryDate: "25. Mar, 2026 | 02:30 PM",
    personCount: 20,
    deliveryAddress: "House # 22 Bergen",
    invoiceAddress: "House # 22 Bergen",
    total: (itemsTotal + itemsTotal + deliveryFee + tip).toFixed(2),
  };
}

export const vendorProfiles = vendorDirectory.map((vendor) => {
  const previewCard = vendorPreviewCards.find(
    (item) => item.slug === vendor.slug,
  );
  const menuSections = buildMenuSections(vendor);

  return {
    ...vendor,
    logo: vendor.logo ?? previewCard?.image,
    categories: DEFAULT_SECTIONS,
    menuSections,
    orderSummary: createOrderSummary(menuSections),
  };
});

export function getVendorProfileBySlug(slug) {
  return vendorProfiles.find((vendor) => vendor.slug === slug) ?? null;
}

export function getVendorProfileByName(name) {
  const cleanedName = formatVendorName(name).toLowerCase();

  return (
    vendorProfiles.find(
      (vendor) => vendor.name.toLowerCase() === cleanedName,
    ) ?? null
  );
}

function isDateValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

export function isVendorDeliverySlotAvailable(vendor, date, time) {
  const deliverySchedule = vendor?.availability?.delivery;

  if (!deliverySchedule || !date || !time || !isDateValid(date)) {
    return true;
  }

  const selectedDate = new Date(`${date}T00:00:00`);
  const selectedDay = selectedDate.getDay();

  return (
    deliverySchedule.days.includes(selectedDay) &&
    time >= deliverySchedule.start &&
    time <= deliverySchedule.end
  );
}

export function getAvailableVendorsForSlot(date, time, excludedVendorSlug) {
  return vendorProfiles.filter(
    (vendor) =>
      vendor.slug !== excludedVendorSlug &&
      isVendorDeliverySlotAvailable(vendor, date, time),
  );
}
