const DAY_MAP = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };
const DAY_NAMES_SHORT = {
  mo: "Mon",
  tu: "Tue",
  we: "Wed",
  th: "Thu",
  fr: "Fri",
  sa: "Sat",
  su: "Sun",
};

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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
    (day) => DAY_NAMES_SHORT[day.toLowerCase()] || day,
  );

  if (capitalized.length <= 2) {
    return capitalized.join(", ");
  }

  const indices = days.map((day) => DAY_MAP[day.toLowerCase()]);
  let isConsecutive = true;

  for (let index = 1; index < indices.length; index += 1) {
    if (indices[index] !== indices[index - 1] + 1) {
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

function buildMenuItem(product, subcategory = "Menu Item", fallbackId) {
  const price = parseFloat(product.priceWithTax || 0);
  const serves = product.minimumGuests || 1;
  const pricingType = product.pricingType === "per-person" ? "per-person" : "fixed";
  const unitPrice =
    pricingType === "per-person" ? price / Math.max(serves, 1) : price;
  const detailLines = [
    product.description || "",
    product.allergens?.length
      ? `Allergens: ${product.allergens.join(", ")}`
      : "",
  ].filter(Boolean);

  return {
    id: product.id || fallbackId,
    title: product.name,
    image: product.coverImage?.fileUrl || "",
    serves,
    subcategory,
    tag: product.isPopular ? "Popular" : product.isFeatured ? "Featured" : "",
    description: product.description || "",
    detailLines,
    dietaryLabels: product.dietaryTags || [],
    allergens: product.allergens || [],
    price,
    pricingType,
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
  if (!product) {
    return null;
  }

  return buildMenuItem(product, subcategory, product.id);
}

export function adaptApiVendorToProfile(apiVendor) {
  if (!apiVendor) {
    return null;
  }

  const slug = apiVendor.slug || slugify(apiVendor.name);
  const minTime = apiVendor.deliverySettings?.minDeliveryTime ?? 0;
  const maxTime = apiVendor.deliverySettings?.maxDeliveryTime ?? 0;
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

  const deliveryDays =
    apiVendor.deliverySettings?.deliveryDays || [
      "mo",
      "tu",
      "we",
      "th",
      "fr",
      "sa",
      "su",
    ];
  const deliverySlots = [
    ...(apiVendor.deliverySettings?.deliveryTimeSlots || []),
  ];
  const deliveryDayIndexes = deliveryDays
    .map((day) => DAY_MAP[day.toLowerCase()])
    .filter((value) => value !== undefined);

  let deliveryStart = "08:00";
  let deliveryEnd = "17:00";

  if (deliverySlots.length > 0) {
    const sortedStarts = deliverySlots.map((slot) => slot.start).sort();
    const sortedEnds = deliverySlots.map((slot) => slot.end).sort();
    deliveryStart = sortedStarts[0];
    deliveryEnd = sortedEnds[sortedEnds.length - 1];
  } else {
    deliverySlots.push({ start: deliveryStart, end: deliveryEnd });
  }

  const deliveryDaysLabel = formatDaysRange(deliveryDays);
  const deliverySlotsLabel = deliverySlots
    .map((slot) => `${slot.start} - ${slot.end}`)
    .join(", ");
  const deliveryLabel = deliveryDaysLabel
    ? `${deliveryDaysLabel}: ${deliverySlotsLabel}`
    : "Closed / Not available";

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

  const menuSections = (apiVendor.menuCategories || [])
    .map((category, categoryIndex) => {
      const primaryProducts = (category.vendorProducts || []).filter(
        isPrimaryMenuProduct,
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
    deliveryFee: `NOK ${parseFloat(fee).toFixed(0)} Delivery fee`,
    freeDeliveryOver: freeDeliveryOver ? `NOK ${parseFloat(freeDeliveryOver).toFixed(0)}` : "",
    leadTime: minTime || maxTime ? `${minTime}-${maxTime} min` : "",
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
