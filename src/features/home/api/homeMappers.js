const FALLBACK_VENDOR_IMAGES = [
  "/home/v.webp",
  "/home/hero1.webp",
  "/home/hero2.webp",
  "/home/hero3.webp",
];

const FALLBACK_PRODUCT_IMAGES = [
  "/home/hero1.webp",
  "/home/hero2.webp",
  "/home/hero3.webp",
  "/home/v.webp",
];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function formatRating(value) {
  return parseFloat(value || 0).toFixed(1);
}

function formatDeliveryFee(value) {
  return `${parseFloat(value || 0)} NOK Delivery fee`;
}

function formatDeliveryTime(minTime, maxTime, fallback = "15-45 minutes") {
  if (
    Number.isFinite(minTime) &&
    Number.isFinite(maxTime) &&
    minTime > 0 &&
    maxTime > 0
  ) {
    return `${minTime}-${maxTime} minutes`;
  }

  return fallback;
}

function normalizeTags(tags, fallback = []) {
  return Array.isArray(tags) && tags.length > 0 ? tags : fallback;
}

export function mapVendorNode(node, index) {
  const name = node?.name || "Vendor";
  const minTime = node?.deliverySettings?.minDeliveryTime;
  const maxTime = node?.deliverySettings?.maxDeliveryTime;
  const fee = node?.deliverySettings?.baseDeliveryFee ?? 0;

  return {
    id: node?.id || `vendor-${index}`,
    slug: slugify(name),
    name,
    image:
      node?.coverPhotoUrl ||
      node?.logoUrl ||
      FALLBACK_VENDOR_IMAGES[index % FALLBACK_VENDOR_IMAGES.length],
    rating: formatRating(node?.rating),
    deliveryTime: formatDeliveryTime(minTime, maxTime),
    deliveryFee: formatDeliveryFee(fee),
    discount:
      Number(node?.discountPercentage) > 0
        ? `${node.discountPercentage}% Discount`
        : null,
    categoryTags: normalizeTags(node?.categoryTags),
  };
}

export function mapProductNode(node, index) {
  const name = node?.name || "Product";
  const vendorName = node?.vendor?.name || "";

  return {
    id: node?.id || `product-${index}`,
    slug: slugify(name),
    vendorSlug: slugify(vendorName),
    name,
    title: name,
    vendorName,
    image:
      node?.coverImage?.fileUrl ||
      FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length],
    rating: formatRating(node?.averageRating),
    deliveryTime: node?.deliveryTime || "15-45 minutes",
    deliveryFee: formatDeliveryFee(node?.deliveryFee),
    discount: node?.badge || null,
    categoryTags: normalizeTags(node?.categoryTags),
    dietaryTags: normalizeTags(node?.dietaryTags),
    minimumGuests: node?.minimumGuests ?? 0,
  };
}

export function mapHomeResponse(response) {
  return {
    featuredVendors: (response?.featured?.edges || []).map((edge, index) =>
      mapVendorNode(edge.node, index),
    ),
    popularVendors: (response?.popularVendors?.edges || []).map(
      (edge, index) => mapVendorNode(edge.node, index + 10),
    ),
    popularProducts: (response?.popularProducts?.edges || []).map(
      (edge, index) => mapProductNode(edge.node, index),
    ),
  };
}
