const DAY_MAP = {
  su: 0,
  sun: 0,
  sunday: 0,
  mo: 1,
  mon: 1,
  monday: 1,
  tu: 2,
  tue: 2,
  tuesday: 2,
  we: 3,
  wed: 3,
  wednesday: 3,
  th: 4,
  thu: 4,
  thursday: 4,
  fr: 5,
  fri: 5,
  friday: 5,
  sa: 6,
  sat: 6,
  saturday: 6,
};
const DAY_NAMES_SHORT = {
  su: "Sun",
  mo: "Mon",
  tu: "Tue",
  we: "Wed",
  th: "Thu",
  fr: "Fri",
  sa: "Sat",
};
const DAY_CODE_BY_INDEX = ["su", "mo", "tu", "we", "th", "fr", "sa"];

function normalizeDayCode(day) {
  const normalized = `${day ?? ""}`.trim().toLowerCase();
  const dayIndex = DAY_MAP[normalized];
  return dayIndex === undefined ? "" : DAY_CODE_BY_INDEX[dayIndex];
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeTags(tags, fallback = []) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return fallback;
  }

  return tags
    .map((tag) => {
      if (typeof tag === "string") {
        return tag;
      }

      return tag?.name || tag?.slug || "";
    })
    .filter(Boolean);
}

function extractCityFromAddress(address) {
  const segments = `${address ?? ""}`
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length >= 2) {
    return segments[segments.length - 2];
  }

  return segments[0] || "";
}

function formatDaysRange(days) {
  if (!days || days.length === 0) {
    return "";
  }

  const capitalized = days.map(
    (day) => DAY_NAMES_SHORT[normalizeDayCode(day)] || `${day}`,
  );

  const normalizedIndices = days
    .map((day) => DAY_MAP[`${day}`.trim().toLowerCase()])
    .filter((value) => value !== undefined);

  if (capitalized.length <= 2) {
    return capitalized.join(", ");
  }

  let isConsecutive = true;

  for (let index = 1; index < normalizedIndices.length; index += 1) {
    if (normalizedIndices[index] !== normalizedIndices[index - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive) {
    return `${capitalized[0]} - ${capitalized[capitalized.length - 1]}`;
  }

  return capitalized.join(", ");
}

function buildOptionalSelections(product) {
  return (product.optionalAddOns || []).map((group) => ({
    title: group.name || group.title || "Add-ons",
    options: (group.options || group.items || []).map((option) => ({
      label: option.name || option.label,
      price: parseFloat(option.price || 0),
    })),
  }));
}

function isPrimaryMenuProduct(product) {
  return `${product?.productType ?? "menu"}`.toLowerCase() === "menu";
}

function normalizeDeliverySlot(slot) {
  const day = normalizeDayCode(slot?.day);
  const start = `${slot?.start ?? ""}`.trim();
  const end = `${slot?.end ?? ""}`.trim();

  if (!start || !end) {
    return null;
  }

  return { day, start, end };
}

function normalizeSpecialClosure(closure) {
  const startDate = `${closure?.startDate ?? ""}`.trim();
  const endDate = `${closure?.endDate ?? ""}`.trim();

  if (!startDate || !endDate) {
    return null;
  }

  return {
    id: closure?.id || `${startDate}-${endDate}`,
    startDate,
    endDate,
    reason: closure?.reason || "",
    status: closure?.status || "",
    type: {
      id: closure?.type?.id || "",
      name: closure?.type?.name || "",
      slug: closure?.type?.slug || "",
    },
  };
}

function unwrapSpecialClosures(specialClosures) {
  if (Array.isArray(specialClosures)) {
    return specialClosures;
  }

  if (Array.isArray(specialClosures?.edges)) {
    return specialClosures.edges.map((edge) => edge?.node).filter(Boolean);
  }

  return [];
}

function isCustomerVisibleMenuProduct(product) {
  return `${product?.menuStatus ?? "active"}`.toLowerCase() === "active";
}

function hasPublicActiveMenuProducts(vendor) {
  const categories = Array.isArray(vendor?.menuCategories) ? vendor.menuCategories : [];

  return categories.some((category) =>
    Array.isArray(category?.vendorProducts) &&
    category.vendorProducts.some(
      (product) =>
        isPrimaryMenuProduct(product) && isCustomerVisibleMenuProduct(product),
    ),
  );
}

function isExplicitlyVisibleVendorStatus(vendor) {
  const status = `${vendor?.status ?? ""}`.trim().toUpperCase();
  const applicationStatus = `${vendor?.applicationStatus ?? ""}`.trim().toUpperCase();

  if (applicationStatus) {
    if (["ACTIVE", "APPROVED"].includes(applicationStatus)) {
      return true;
    }

    if (
      [
        "PENDING_APPROVAL",
        "REVIEWING",
        "CHANGES_REQUESTED",
        "REJECTED",
        "SUSPENDED",
        "DEACTIVATED",
        "INACTIVE",
      ].includes(applicationStatus)
    ) {
      return false;
    }
  }

  if (status) {
    if (["ACTIVE", "APPROVED", "PUBLISHED"].includes(status)) {
      return true;
    }

    if (
      [
        "PENDING",
        "PENDING_APPROVAL",
        "REVIEWING",
        "REJECTED",
        "SUSPENDED",
        "DEACTIVATED",
        "INACTIVE",
      ].includes(status)
    ) {
      return false;
    }
  }

  if (typeof vendor?.isActive === "boolean") {
    return vendor.isActive;
  }

  return null;
}

function isPublicVendorVisible(vendor) {
  const statusVisibility = isExplicitlyVisibleVendorStatus(vendor);

  if (statusVisibility === false) {
    return false;
  }

  if (!hasPublicActiveMenuProducts(vendor)) {
    return false;
  }

  return true;
}

function buildMenuItem(product, subcategory = "Menu Item", fallbackId) {
  const price = parseFloat(product.priceWithTax || 0);
  const serves = product.minimumGuests || 1;
  const pricingType = product.pricingType === "per-person" ? "per-person" : "fixed";
  // Backend checkout pricing treats per-person items as:
  // unitPrice × personCount × quantity
  // so the menu should display the actual unit price directly.
  const unitPrice = price;
  const detailLines = [
    product.description || "",
    normalizeTags(product.allergens).length
      ? `Allergens: ${normalizeTags(product.allergens).join(", ")}`
      : "",
  ].filter(Boolean);
  const availableDays = Array.isArray(product.availableDays)
    ? product.availableDays
    : [];
  const minLeadTimeHours = Number(product.minLeadTimeHours || 0);
  const minLeadTimeDays = Number(product.minLeadTimeDays || 0);

  return {
    id: product.id || fallbackId,
    title: product.name,
    image: product.coverImage?.fileUrl || "",
    serves,
    subcategory,
    tag: product.isPopular ? "Popular" : product.isFeatured ? "Featured" : "",
    description: product.description || "",
    detailLines,
    dietaryLabels: normalizeTags(product.dietaryTags),
    allergens: normalizeTags(product.allergens),
    price,
    pricingType,
    availableDays,
    minLeadTimeHours,
    minLeadTimeDays,
    isAvailabilityWindowEnabled: Boolean(product.isAvailabilityWindowEnabled),
    availableFrom: product.availableFrom || "",
    availableUntil: product.availableUntil || "",
    menuItems: product.menuItems || [],
    modal: {
      heading: product.name,
      pricingType,
      unitPrice: unitPrice.toFixed(2),
      pricePerPerson: unitPrice.toFixed(2),
      priceLabel: pricingType === "per-person" ? "per person" : "per order",
      badge: subcategory,
      quantityOptions: ["1 order", "2 orders", "5 orders", "10 orders"],
      requiredSelection: null,
      optionalSelections: buildOptionalSelections(product),
      instructionPlaceholder: "",
    },
  };
}

export function adaptApiProductToMenuItem(product, subcategory = "Menu Item") {
  if (!product || !isCustomerVisibleMenuProduct(product)) {
    return null;
  }

  return buildMenuItem(product, subcategory, product.id);
}

export function adaptApiVendorToProfile(apiVendor) {
  if (!apiVendor) {
    return null;
  }

  if (!isPublicVendorVisible(apiVendor)) {
    return null;
  }

  const slug = apiVendor.slug || slugify(apiVendor.name);
  const fee = apiVendor.deliverySettings?.baseDeliveryFee ?? "0";
  const freeDeliveryOver = apiVendor.deliverySettings?.freeDeliveryOver ?? "";
  const pickupAddress = apiVendor.deliverySettings?.pickupAddress || "";
  const pickupInstructions = apiVendor.deliverySettings?.pickupInstructions || "";
  const banner =
    apiVendor.coverPhotoUrl ||
    apiVendor.businessSettings?.coverPhotoUrl ||
    "";
  const logo =
    apiVendor.logoUrl ||
    apiVendor.businessSettings?.logoUrl ||
    "";
  const rating = parseFloat(apiVendor.rating || 0);
  const address = apiVendor.businessSettings?.businessAddress || "";
  const cuisine = apiVendor.categoryTags?.[0] || "";
  const city = extractCityFromAddress(address);

  const deliveryDays = Array.isArray(apiVendor.deliverySettings?.deliveryDays)
    ? apiVendor.deliverySettings.deliveryDays
      .map((day) => normalizeDayCode(day))
      .filter(Boolean)
    : [];
  const deliverySlots = Array.isArray(apiVendor.deliverySettings?.deliveryTimeSlots)
    ? apiVendor.deliverySettings.deliveryTimeSlots
      .map(normalizeDeliverySlot)
      .filter(Boolean)
    : [];
  const deliveryDayIndexes = deliveryDays
    .map((day) => DAY_MAP[day])
    .filter((value) => value !== undefined);

  let deliveryStart = "";
  let deliveryEnd = "";

  if (deliverySlots.length > 0) {
    const sortedStarts = deliverySlots.map((slot) => slot.start).sort();
    const sortedEnds = deliverySlots.map((slot) => slot.end).sort();
    deliveryStart = sortedStarts[0];
    deliveryEnd = sortedEnds[sortedEnds.length - 1];
  }

  const deliveryDaysLabel = formatDaysRange(deliveryDays);
  const deliverySlotsLabel = deliverySlots
    .map((slot) => {
      const dayName = DAY_NAMES_SHORT[slot.day] || slot.day;
      return dayName
        ? `${dayName}: ${slot.start} - ${slot.end}`
        : `${slot.start} - ${slot.end}`;
    })
    .join(" | ");
  const deliveryLabel =
    deliverySlotsLabel
      ? deliveryDaysLabel
        ? `${deliveryDaysLabel}: ${deliverySlotsLabel}`
        : deliverySlotsLabel
      : "Delivery schedule not set";

  const businessHours = apiVendor.businessSettings?.businessHours || [];
  const activeBusinessHours = businessHours.filter((hours) => hours.enabled);
  const businessDayIndexes = activeBusinessHours
    .map((hours) => DAY_MAP[hours.day.toLowerCase()])
    .filter((value) => value !== undefined);
  const takeoutLabel = activeBusinessHours
    .map((hours) => {
      const dayName = DAY_NAMES_SHORT[hours.day.toLowerCase()] || hours.day;
      const slots =
        hours.openTime && hours.closeTime
          ? `${hours.openTime} - ${hours.closeTime}`
          : "";
      return `${dayName}: ${slots}`;
    })
    .filter(Boolean)
    .join(" | ") || "Closed / Not available";

  const availability = {
    delivery: {
      days: deliveryDayIndexes,
      start: deliveryStart,
      end: deliveryEnd,
      slots: deliverySlots,
      label: deliveryLabel,
    },
    takeout: {
      days: businessDayIndexes,
      label: takeoutLabel,
    },
  };

  const serviceAreas = (apiVendor.serviceAreas || [])
    .filter((area) => area.isActive)
    .map((area) => ({
      id: area.id || `${area.postCode}`,
      name: area.name || "",
      postCode: String(area.postCode).padStart(4, "0"),
    }));

  const servicePostalCodes = serviceAreas.map((area) => area.postCode);
  const specialClosures = unwrapSpecialClosures(apiVendor.specialClosures)
    .map(normalizeSpecialClosure)
    .filter(Boolean);

  const menuSections = (apiVendor.menuCategories || [])
    .map((category, categoryIndex) => {
      const primaryProducts = (category.vendorProducts || []).filter(
        (product) => isPrimaryMenuProduct(product) && isCustomerVisibleMenuProduct(product),
      );

      return {
        id: category.id || `${slug}-${categoryIndex}`,
        title: category.name,
        description: category.description || "",
        items: primaryProducts.map((product, productIndex) =>
          buildMenuItem(
            product,
            category.name,
            `${slug}-${category.id}-${productIndex}`,
          ),
        ),
      };
    })
    .filter((section) => section.items.length > 0);

  const categories = menuSections.map((category) => category.title);

  return {
    id: apiVendor.id,
    slug,
    name: apiVendor.name,
    canReview: Boolean(apiVendor.canReview),
    hasReviewed: Boolean(apiVendor.hasReviewed),
    reviewSummary: apiVendor.reviewSummary || null,
    logo,
    banner,
    heroSideImage: banner,
    rating: rating.toFixed(1),
    reviewCount: apiVendor.reviewsCount || 0,
    cuisine,
    addressLine: address,
    city,
    pickupAddress,
    pickupInstructions,
    serviceAreas,
    servicePostalCodes,
    specialClosures,
    deliveryFee: `NOK ${parseFloat(fee).toFixed(0)} Delivery fee`,
    freeDeliveryOver: freeDeliveryOver ? `NOK ${parseFloat(freeDeliveryOver).toFixed(0)}` : "",
    availability,
    categories,
    menuSections,
    reviews: [],
    orderSummary: {
      items: [],
      breakdown: [],
      deliveryDate: "",
      personCount: 1,
      deliveryAddress: "",
      invoiceAddress: "",
      total: "0.00",
    },
  };
}

export function adaptApiVendorReview(review) {
  return {
    id: review?.id || "",
    rating: Number(review?.rating || 0),
    title: review?.title || "Untitled review",
    comment: review?.comment || "",
    occasion: review?.occasion || "",
    author: review?.authorName || "Anonymous",
    date: review?.eventDate || review?.createdOn || "",
    createdOn: review?.createdOn || "",
    status: review?.status || "",
    orderId: review?.orderId || "",
    vendorReply: review?.vendorReply
      ? {
          id: review.vendorReply.id || "",
          message: review.vendorReply.message || "",
          createdOn: review.vendorReply.createdOn || "",
        }
      : null,
  };
}
