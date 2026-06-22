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

// Mappers
export function adaptApiProductToMenuItem(prod, subcategory = "Menu Item") {
  if (!prod) return null;
  const price = parseFloat(prod.priceWithTax || 0);
  const serves = prod.minimumGuests || 1;

  const detailLines = [
    prod.description || "",
    prod.allergens?.length ? `Allergens: ${prod.allergens.join(", ")}` : "",
  ].filter(Boolean);

  const optionalSelections = (prod.optionalAddOns || []).map((group) => ({
    title: group.name || group.title || "Add-ons",
    options: (group.options || group.items || []).map((opt) => ({
      label: opt.name || opt.label,
      price: parseFloat(opt.price || 0),
    })),
  }));

  return {
    id: prod.id,
    title: prod.name,
    image: prod.coverImage?.fileUrl || "",
    serves,
    subcategory,
    tag: prod.isPopular ? "Popular" : prod.isFeatured ? "Featured" : "",
    description: prod.description || "",
    detailLines,
    dietaryLabels: prod.dietaryTags || [],
    allergens: prod.allergens || [],
    price,
    menuItems: prod.menuItems || [],
    modal: {
      heading: prod.name,
      pricePerPerson: prod.pricingType === "per-person" ? (price / Math.max(serves, 1)).toFixed(2) : price.toFixed(2),
      badge: subcategory,
      quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
      requiredSelection: null,
      optionalSelections,
      instructionPlaceholder: "",
    },
  };
}

export function adaptApiVendorToProfile(apiVendor) {
  if (!apiVendor) return null;

  const slug = String(apiVendor.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const minTime = apiVendor.deliverySettings?.minDeliveryTime ?? 0;
  const maxTime = apiVendor.deliverySettings?.maxDeliveryTime ?? 0;
  const fee = apiVendor.deliverySettings?.baseDeliveryFee ?? "0";

  const banner = apiVendor.coverPhotoUrl || "";
  const logo = apiVendor.logoUrl || "";
  const rating = parseFloat(apiVendor.rating || 0);

  const address = apiVendor.businessSettings?.businessAddress || "";
  const cuisine = apiVendor.categoryTags?.[0] || "";

  // Day Name Mapping and Formatting Helper
  const DAY_MAP = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };
  const DAY_NAMES_SHORT = {
    mo: "Mon",
    tu: "Tue",
    we: "Wed",
    th: "Thu",
    fr: "Fri",
    sa: "Sat",
    su: "Sun"
  };

  function formatDaysRange(days) {
    if (!days || days.length === 0) return "";
    const capitalized = days.map(d => DAY_NAMES_SHORT[d.toLowerCase()] || d);
    if (capitalized.length <= 2) {
      return capitalized.join(", ");
    }
    const indices = days.map(d => DAY_MAP[d.toLowerCase()]);
    let isConsecutive = true;
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        isConsecutive = false;
        break;
      }
    }
    if (isConsecutive) {
      return `${capitalized[0]} - ${capitalized[capitalized.length - 1]}`;
    }
    return capitalized.join(", ");
  }

  // Parse Delivery Settings
  const deliveryDays = apiVendor.deliverySettings?.deliveryDays || ["mo", "tu", "we", "th", "fr", "sa", "su"];
  const deliverySlots = apiVendor.deliverySettings?.deliveryTimeSlots || [];
  const delDays = deliveryDays.map(d => DAY_MAP[d.toLowerCase()]).filter(n => n !== undefined);
  
  let delStart = "08:00";
  let delEnd = "17:00";
  if (deliverySlots.length > 0) {
    const sortedStarts = [...deliverySlots].map(s => s.start).sort();
    const sortedEnds = [...deliverySlots].map(s => s.end).sort();
    delStart = sortedStarts[0];
    delEnd = sortedEnds[sortedEnds.length - 1];
  } else {
    // If no slots exist, populate one default slot from business hours or default
    deliverySlots.push({ start: delStart, end: delEnd });
  }

  const delDaysLabel = formatDaysRange(deliveryDays);
  const delSlotsLabel = deliverySlots.map(s => `${s.start} - ${s.end}`).join(", ");
  const deliveryLabel = delDaysLabel ? `${delDaysLabel}: ${delSlotsLabel}` : "Closed / Not available";

  // Parse Business Hours (Takeout)
  const businessHours = apiVendor.businessSettings?.businessHours || [];
  const activeBusinessHours = businessHours.filter(h => h.enabled);
  const busDays = activeBusinessHours.map(h => DAY_MAP[h.day.toLowerCase()]).filter(n => n !== undefined);

  const takeoutLabelParts = activeBusinessHours.map(h => {
    const dayName = DAY_NAMES_SHORT[h.day.toLowerCase()] || h.day;
    const slotsStr = (h.slots || []).map(s => `${s.start} - ${s.end}`).join(", ");
    return `${dayName}: ${slotsStr}`;
  });
  const takeoutLabel = takeoutLabelParts.join(" | ") || "Closed / Not available";

  const availability = {
    delivery: {
      days: delDays,
      start: delStart,
      end: delEnd,
      slots: deliverySlots,
      label: deliveryLabel,
    },
    takeout: {
      days: busDays,
      label: takeoutLabel,
    }
  };

  // Map Service Areas to Postal Codes ( Norway: 4-digit code )
  const servicePostalCodes = (apiVendor.serviceAreas || [])
    .filter((area) => area.isActive)
    .map((area) => String(area.postCode).padStart(4, "0"));

  const categories = (apiVendor.menuCategories || []).map((cat) => cat.name);

  const menuSections = (apiVendor.menuCategories || []).map((cat, catIdx) => {
    const items = (cat.vendorProducts || []).map((prod, prodIdx) => {
      const price = parseFloat(prod.priceWithTax || 0);
      const serves = prod.minimumGuests || 1;
      const subcategory = cat.name;

      const detailLines = [
        prod.description || "",
        prod.allergens?.length ? `Allergens: ${prod.allergens.join(", ")}` : "",
      ].filter(Boolean);

      const optionalSelections = (prod.optionalAddOns || []).map((group) => ({
        title: group.name || group.title || "Add-ons",
        options: (group.options || group.items || []).map((opt) => ({
          label: opt.name || opt.label,
          price: parseFloat(opt.price || 0),
        })),
      }));

      return {
        id: prod.id || `${slug}-${cat.id}-${prodIdx}`,
        title: prod.name,
        image: prod.coverImage?.fileUrl || "",
        serves,
        subcategory,
        tag: prod.isPopular ? "Popular" : prod.isFeatured ? "Featured" : "",
        description: prod.description || "",
        detailLines,
        dietaryLabels: prod.dietaryTags || [],
        allergens: prod.allergens || [],
        price,
        menuItems: prod.menuItems || [],
        modal: {
          heading: prod.name,
          pricePerPerson: prod.pricingType === "per-person" ? (price / Math.max(serves, 1)).toFixed(2) : price.toFixed(2),
          badge: subcategory,
          quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
          requiredSelection: null,
          optionalSelections,
          instructionPlaceholder: "",
        },
      };
    });

    return {
      id: cat.id || `${slug}-${catIdx}`,
      title: cat.name,
      items,
    };
  });

  const reviews = [];

  const orderSummary = {
    items: [],
    breakdown: [],
    deliveryDate: "",
    personCount: 1,
    deliveryAddress: "",
    invoiceAddress: "",
    total: "0.00",
  };

  return {
    slug,
    name: apiVendor.name,
    logo,
    banner,
    heroSideImage: banner,
    rating: rating.toFixed(1),
    reviewCount: apiVendor.reviewsCount || 0,
    cuisine,
    addressLine: address,
    city: "",
    servicePostalCodes,
    deliveryFee: `NOK ${parseFloat(fee).toFixed(0)} Delivery fee`,
    leadTime: minTime || maxTime ? `${minTime}-${maxTime} min` : "",
    availability,
    categories,
    menuSections,
    reviews,
    orderSummary,
  };
}

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
