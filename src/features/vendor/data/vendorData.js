export const freshBitesKitchenPayload = {
  id: "8",
  name: "Fresh Bites Kitchen",
  logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdrEAgRBptuEGkDenW-UkBRrWFgwCnTgn89q0rHIELshGNDS9Gpn7mibBn&s=10",
  coverPhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4uwcPXm4Q1OvgdJizrYTSw2_XWBI4AUvQp4CZmpdpEmtNsOTu_kD-VBqQ&s=10",
  rating: "0.0",
  reviewsCount: 0,
  categoryTags: [
    "All-in-one",
    "Catering Packages"
  ],
  deliverySettings: {
    id: "7",
    baseDeliveryFee: "0",
    minDeliveryTime: 15,
    maxDeliveryTime: 45
  },
  businessSettings: {
    id: "7",
    businessAddress: "Grünerløkka Plaza, Oslo, Norway"
  },
  menuCategories: [
    {
      id: "9",
      name: "Catering Packages",
      description: "Main catering packages for weddings, corporate, and private parties",
      vendorProducts: [
        {
          id: "49",
          name: "Royal Wedding Grand Buffet",
          description: "General details about this catering package, including the culinary experience, key highlights, and service style.",
          priceWithTax: "120.00",
          averageRating: "0.0",
          ordersCount: 0,
          badge: null,
          isPopular: false,
          isFeatured: false,
          slug: "royal-wedding-grand-buffet",
          categoryTags: [
            "Catering Packages",
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          contains: null,
          dietaryTags: [
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          allergens: [
            "Gluten",
            "Eggs",
            "Vegess"
          ],
          minLeadTimeDays: 24,
          minLeadTimeHours: 24,
          minimumGuests: 20,
          pricingType: "per-person",
          isAvailabilityWindowEnabled: true,
          availableFrom: "2026-06-25",
          availableUntil: "2026-07-25",
          coverImage: {
            id: "109",
            fileUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80"
          },
          menuItems: [
            {
              id: "1",
              title: "Grilled Chicken",
              description: null,
              imageUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80",
              allergens: [
                "Eggs"
              ]
            },
            {
              id: "2",
              title: "Penne Pasta",
              description: null,
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR4OcTwtNZJtp6y8QY5TwulzzahHuYTH9iwQ&s",
              allergens: [
                "Gluten"
              ]
            },
            {
              id: "3",
              title: "Garden Fresh Salad",
              description: null,
              imageUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80",
              allergens: [
                "Vegess"
              ]
            }
          ],
          optionalAddOns: []
        }
      ]
    },
    {
      id: "10",
      name: "All-in-one",
      description: "All pakages for weddings, corporate, and private parties",
      vendorProducts: [
        {
          id: "50",
          name: "Grand Corporate Gala Buffet",
          description: "Ek shandaar corporate event ke liye premium buffet, jismein shamil hain gourmet main courses, artisanal sides, aur professional presentation.",
          priceWithTax: "150.00",
          averageRating: "0.0",
          ordersCount: 0,
          badge: null,
          isPopular: false,
          isFeatured: false,
          slug: "grand-corporate-gala-buffet",
          categoryTags: [
            "All-in-one",
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          contains: null,
          dietaryTags: [
            "Vegetarian",
            "Halal",
            "Gluten-Free",
            "Vegan"
          ],
          allergens: [
            "None"
          ],
          minLeadTimeDays: 48,
          minLeadTimeHours: 24,
          minimumGuests: 35,
          pricingType: "per-person",
          isAvailabilityWindowEnabled: true,
          availableFrom: "2026-07-01",
          availableUntil: "2026-09-01",
          coverImage: {
            id: "112",
            fileUrl: "https://img.magnific.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80"
          },
          menuItems: [],
          optionalAddOns: []
        }
      ]
    }
  ]
};

// Mappers are now decoupled and imported from vendorNormalization.js
import {
  adaptApiProductToMenuItem,
  adaptApiVendorToProfile,
} from "../api/vendorNormalization";

export { adaptApiProductToMenuItem, adaptApiVendorToProfile };

export const vendorProfiles = [
  adaptApiVendorToProfile(freshBitesKitchenPayload)
];

// Utility functions
const WEEKDAY_SHORT_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function normalizePostalCode(postalCode = "") {
  return `${postalCode}`.replace(/\D/g, "").slice(0, 4);
}

function normalizeLocationQuery(locationQuery = "") {
  return `${locationQuery}`.trim().toLowerCase();
}

export function getVendorProfileBySlug(slug) {
  return vendorProfiles.find((vendor) => vendor.slug === slug) ?? null;
}

export function getVendorMenuItemById(vendorSlug, itemId) {
  const vendor = getVendorProfileBySlug(vendorSlug);

  if (!vendor) {
    return null;
  }

  return (
    vendor.menuSections
      .flatMap((section) => section.items)
      .find((item) => item.id === itemId) ?? null
  );
}

export function getVendorProfileByName(name) {
  const formatVendorName = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const cleanedName = formatVendorName(name);

  return (
    vendorProfiles.find(
      (vendor) => vendor.slug === cleanedName,
    ) ?? null
  );
}

export function getVendorReviewsBySlug(slug) {
  return getVendorProfileBySlug(slug)?.reviews ?? [];
}

function resolveVendorReference(vendor) {
  if (!vendor) {
    return null;
  }

  if (vendor.slug) {
    return vendorProfiles.find((candidate) => candidate.slug === vendor.slug) ?? null;
  }

  return getVendorProfileByName(vendor.name);
}

function resolveVendorPostalCoverage(vendor) {
  if ((vendor?.servicePostalCodes ?? []).length > 0) {
    return vendor.servicePostalCodes;
  }

  const matchedVendor = resolveVendorReference(vendor);

  return matchedVendor?.servicePostalCodes ?? [];
}

export function isVendorAvailableForPostalCode(vendor, postalCode) {
  const normalizedInput = normalizePostalCode(postalCode);

  if (!normalizedInput) {
    return true;
  }

  return resolveVendorPostalCoverage(vendor).some((candidate) =>
    candidate.startsWith(normalizedInput),
  );
}

export function filterVendorsByPostalCode(vendors, postalCode) {
  return vendors.filter((vendor) =>
    isVendorAvailableForPostalCode(vendor, postalCode),
  );
}

export function isVendorAvailableForLocation(vendor, locationQuery) {
  const normalizedPostalCode = normalizePostalCode(locationQuery);
  const matchedVendor = resolveVendorReference(vendor);

  if (normalizedPostalCode) {
    return isVendorAvailableForPostalCode(vendor, normalizedPostalCode);
  }

  const normalizedQuery = normalizeLocationQuery(locationQuery);

  if (!normalizedQuery) {
    return true;
  }

  return [
    vendor?.city ?? matchedVendor?.city,
    vendor?.addressLine ?? matchedVendor?.addressLine,
    vendor?.name ?? matchedVendor?.name,
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function filterVendorsByLocation(vendors, locationQuery) {
  return vendors.filter((vendor) =>
    isVendorAvailableForLocation(vendor, locationQuery),
  );
}

export function filterItemsByVendorLocation(
  items,
  locationQuery,
  getVendorSlug = (item) => item?.vendorSlug,
) {
  return items.filter((item) => {
    const vendorSlug = getVendorSlug(item);
    const vendor = vendorSlug ? getVendorProfileBySlug(vendorSlug) : null;

    return vendor ? isVendorAvailableForLocation(vendor, locationQuery) : true;
  });
}

export function filterVendorsByDeliverySlot(vendors, date, time) {
  if (!date && !time) {
    return vendors;
  }

  return vendors.filter((vendor) =>
    isVendorDeliverySlotAvailable(vendor, date, time),
  );
}

function isDateValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

function normalizeSelectedDate(date) {
  if (!date || !isDateValid(date)) {
    return null;
  }

  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const normalizedDate = `${date}`.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    const [year, month, day] = normalizedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(normalizedDate);
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
}

export function isVendorDeliverySlotAvailable(vendor, date, time) {
  const matchedVendor = resolveVendorReference(vendor);
  const deliverySchedule =
    vendor?.availability?.delivery ?? matchedVendor?.availability?.delivery;

  if (!deliverySchedule) {
    return true;
  }

  const selectedDate = normalizeSelectedDate(date);
  const matchesDay = selectedDate
    ? deliverySchedule.days.includes(selectedDate.getDay())
    : true;

  let matchesTime = true;
  if (time) {
    if (Array.isArray(deliverySchedule.slots) && deliverySchedule.slots.length > 0) {
      matchesTime = deliverySchedule.slots.some(
        (slot) => time >= slot.start && time <= slot.end
      );
    } else {
      matchesTime = time >= deliverySchedule.start && time <= deliverySchedule.end;
    }
  }

  return matchesDay && matchesTime;
}

export function getAvailableVendorsForSlot(date, time, excludedVendorSlug) {
  return vendorProfiles.filter(
    (vendor) =>
      vendor.slug !== excludedVendorSlug &&
      isVendorDeliverySlotAvailable(vendor, date, time),
  );
}
