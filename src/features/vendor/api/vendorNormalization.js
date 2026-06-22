// Day Name Mapping and Formatting Helpers
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
