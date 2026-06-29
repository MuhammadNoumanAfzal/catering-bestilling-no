function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const DAY_MAP = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };

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

function formatRating(value) {
  return parseFloat(value || 0).toFixed(1);
}

function formatDeliveryFee(value) {
  const amount = Number.parseFloat(value || 0);
  return Number.isFinite(amount) ? `${amount} NOK Delivery fee` : "";
}

function formatDeliveryTime(minTime, maxTime) {
  if (
    Number.isFinite(minTime) &&
    Number.isFinite(maxTime) &&
    minTime > 0 &&
    maxTime > 0
  ) {
    return `${minTime}-${maxTime} minutes`;
  }

  return "";
}

function normalizeTags(tags, fallback = []) {
  return Array.isArray(tags) && tags.length > 0 ? tags : fallback;
}

function normalizeTaxonomyTags(items = [], fallback = []) {
  const mappedItems = Array.isArray(items)
    ? items
        .map((item) => item?.slug || item?.name || "")
        .filter(Boolean)
    : [];

  return mappedItems.length > 0 ? mappedItems : fallback;
}

function isPrimaryMenuProduct(node) {
  return `${node?.productType ?? "menu"}`.toLowerCase() === "menu";
}

function mapVendorNode(node) {
  const name = node?.name || "Vendor";
  const minTime = node?.deliverySettings?.minDeliveryTime;
  const maxTime = node?.deliverySettings?.maxDeliveryTime;
  const fee = node?.deliverySettings?.baseDeliveryFee ?? 0;
  const address = node?.businessSettings?.businessAddress || "";
  const deliveryDays = (node?.deliverySettings?.deliveryDays || [])
    .map((day) => DAY_MAP[`${day}`.toLowerCase()])
    .filter((day) => day !== undefined);
  const deliverySlots = Array.isArray(node?.deliverySettings?.deliveryTimeSlots)
    ? node.deliverySettings.deliveryTimeSlots
    : [];

  return {
    id: node?.id || "",
    slug: slugify(name),
    name,
    image: node?.coverPhotoUrl || node?.logoUrl || "",
    logo: node?.logoUrl || "",
    banner: node?.coverPhotoUrl || node?.logoUrl || "",
    heroSideImage: node?.coverPhotoUrl || node?.logoUrl || "",
    rating: formatRating(node?.rating),
    deliveryTime: formatDeliveryTime(minTime, maxTime),
    deliveryFee: formatDeliveryFee(fee),
    discount:
      Number(node?.discountPercentage) > 0
        ? `${node.discountPercentage}% Discount`
        : null,
    categoryTags: normalizeTaxonomyTags(
      node?.foodTypes,
      normalizeTags(node?.categoryTags),
    ),
    reviewCount: Number(node?.reviewsCount || 0),
    addressLine: address,
    city: extractCityFromAddress(address),
    primaryPostalCode: `${node?.postCode ?? ""}`.trim(),
    servicePostalCodes: [
      `${node?.postCode ?? ""}`.trim(),
      ...(node?.serviceAreas || [])
        .filter((area) => area?.isActive)
        .map((area) => `${area?.postCode ?? ""}`.trim()),
    ].filter(Boolean),
    availability: {
      delivery: {
        days: deliveryDays,
        slots: deliverySlots,
        start: deliverySlots[0]?.start || "",
        end: deliverySlots[deliverySlots.length - 1]?.end || "",
      },
    },
    orderSummary: {
      items: [],
      deliveryDate: "",
      deliveryTime: "",
      personCount: 1,
      deliveryAddress: "",
      invoiceAddress: "",
      total: "0.00",
    },
  };
}

export function mapProductNode(node) {
  const name = node?.name || "Product";
  const vendor = node?.vendor ? mapVendorNode(node.vendor) : null;
  const basePrice = Number.parseFloat(node?.priceWithTax || 0);
  const guestCount = Math.max(1, Number(node?.minimumGuests ?? 1));
  const displayPrice =
    node?.pricingType === "per-person" ? basePrice / guestCount : basePrice;

  return {
    id: node?.id || "",
    slug: slugify(name),
    vendorSlug: vendor?.slug || "",
    name,
    title: name,
    description: node?.description || "",
    vendorName: vendor?.name || "",
    vendor: vendor?.name || "",
    vendorData: vendor,
    image: node?.coverImage?.fileUrl || vendor?.image || "",
    rating: formatRating(node?.averageRating),
    deliveryTime:
      node?.deliveryTime || vendor?.deliveryTime || "",
    deliveryFee:
      formatDeliveryFee(node?.deliveryFee) || vendor?.deliveryFee || "",
    discount: node?.badge || null,
    categoryTags: normalizeTaxonomyTags(
      node?.foodTypes,
      normalizeTags(node?.categoryTags),
    ),
    dietaryTags: normalizeTags(node?.dietaryTags),
    minimumGuests: node?.minimumGuests ?? 0,
    price: Number.isFinite(displayPrice) ? `NOK ${displayPrice.toFixed(2)}` : "",
  };
}

export function mapHomeResponse(response) {
  return {
    featuredVendors: (response?.featured?.edges || []).map((edge) =>
      mapVendorNode(edge.node),
    ),
    popularVendors: (response?.popularVendors?.edges || []).map(
      (edge) => mapVendorNode(edge.node),
    ),
    popularProducts: (response?.popularProducts?.edges || [])
      .filter((edge) => isPrimaryMenuProduct(edge?.node))
      .map((edge) => mapProductNode(edge.node)),
  };
}
