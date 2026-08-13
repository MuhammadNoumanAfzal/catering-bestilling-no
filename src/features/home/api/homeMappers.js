import {
  getPublicMenuCount,
  isCustomerVisibleMenuProduct,
  isPrimaryMenuProduct,
  isPublicVendorVisible,
} from "../../vendor/api/publicVisibility";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

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

function normalizeTaxonomyTags(items = [], fallback = []) {
  const mappedItems = Array.isArray(items)
    ? items
        .map((item) => item?.slug || item?.name || "")
        .filter(Boolean)
    : [];

  return mappedItems.length > 0 ? mappedItems : fallback;
}

function getFirstVendorMenuImage(node) {
  const categories = Array.isArray(node?.menuCategories) ? node.menuCategories : [];

  for (const category of categories) {
    const products = Array.isArray(category?.vendorProducts) ? category.vendorProducts : [];

    for (const product of products) {
      if (!isCustomerVisibleMenuProduct(product)) {
        continue;
      }

      const fileUrl = `${product?.coverImage?.fileUrl ?? ""}`.trim();
      if (fileUrl) {
        return fileUrl;
      }
    }
  }

  return "";
}

function mapVendorNode(node) {
  if (!isPublicVendorVisible(node)) {
    return null;
  }

  const name = node?.name || "Vendor";
  const fee = node?.deliverySettings?.baseDeliveryFee ?? 0;
  const freeDeliveryOver = node?.deliverySettings?.freeDeliveryOver ?? "";
  const address = node?.businessSettings?.businessAddress || "";
  const pickupAddress = node?.deliverySettings?.pickupAddress || "";
  const pickupInstructions = node?.deliverySettings?.pickupInstructions || "";
  const deliveryDays = (node?.deliverySettings?.deliveryDays || [])
    .map((day) => DAY_MAP[`${day}`.toLowerCase()])
    .filter((day) => day !== undefined);
  const deliverySlots = Array.isArray(node?.deliverySettings?.deliveryTimeSlots)
    ? node.deliverySettings.deliveryTimeSlots
    : [];
  const firstMenuImage = getFirstVendorMenuImage(node);
  const primaryImage =
    node?.coverPhotoUrl ||
    node?.businessSettings?.coverPhotoUrl ||
    firstMenuImage ||
    node?.logoUrl ||
    node?.businessSettings?.logoUrl ||
    "";

  return {
    id: node?.id || "",
    slug: node?.slug || slugify(name),
    name,
    isPopular: Boolean(node?.isPopular),
    isFeatured: Boolean(node?.isFeatured),
    image: primaryImage,
    logo: node?.logoUrl || node?.businessSettings?.logoUrl || "",
    banner: primaryImage,
    heroSideImage: primaryImage,
    rating: formatRating(node?.rating),
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
    isPubliclyVisible:
      typeof node?.isPubliclyVisible === "boolean"
        ? node.isPubliclyVisible
        : isPublicVendorVisible(node),
    hasPublicActiveMenus:
      typeof node?.hasPublicActiveMenus === "boolean"
        ? node.hasPublicActiveMenus
        : getPublicMenuCount(node) > 0,
    publicActiveMenuCount:
      Number.isFinite(Number(node?.publicActiveMenuCount))
        ? Number(node.publicActiveMenuCount)
        : getPublicMenuCount(node),
    addressLine: address,
    city: extractCityFromAddress(address),
    pickupAddress,
    pickupInstructions,
    freeDeliveryOver:
      freeDeliveryOver !== "" && freeDeliveryOver != null
        ? `NOK ${Number.parseFloat(freeDeliveryOver || 0).toFixed(0)}`
        : "",
    primaryPostalCode: `${node?.postCode ?? ""}`.trim(),
    serviceAreas: (node?.serviceAreas || [])
      .filter((area) => area?.isActive)
      .map((area) => ({
        id: area.id || `${area.postCode}`,
        name: area.name || "",
        postCode: `${area?.postCode ?? ""}`.trim(),
      })),
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

  if (!vendor) {
    return null;
  }

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
    isPopular: Boolean(node?.isPopular),
    isFeatured: Boolean(node?.isFeatured),
    description: node?.description || "",
    vendorName: vendor?.name || "",
    vendor: vendor?.name || "",
    vendorData: vendor,
    image: node?.coverImage?.fileUrl || vendor?.image || "",
    rating: formatRating(node?.averageRating || node?.vendor?.rating),
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

function uniqueById(items = []) {
  const seen = new Set();

  return items.filter((item) => {
    const id = item?.id || item?.slug;

    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

function flattenVendorProducts(vendors = []) {
  return vendors.flatMap((vendorEdge) => {
    const vendorNode = vendorEdge?.node;
    const categories = Array.isArray(vendorNode?.menuCategories)
      ? vendorNode.menuCategories
      : [];

    return categories.flatMap((category) => {
      const products = Array.isArray(category?.vendorProducts)
        ? category.vendorProducts
        : [];

      return products.map((product) => ({
        ...product,
        vendor: vendorNode,
      }));
    });
  });
}

export function mapHomeResponse(response) {
  const allVendorNodes = (response?.allVendors?.edges || []).map((edge) => edge?.node);
  const mappedAllVendors = allVendorNodes
    .map((node) => mapVendorNode(node))
    .filter(Boolean);
  const mappedSearchedVendors = (response?.searchVendors?.edges || [])
    .map((edge) => mapVendorNode(edge.node))
    .filter(Boolean);
  const mappedFeaturedVendors = (response?.featured?.edges || [])
    .map((edge) => mapVendorNode(edge.node))
    .filter(Boolean);
  const mappedPopularVendors = (response?.popularVendors?.edges || [])
    .map((edge) => mapVendorNode(edge.node))
    .filter(Boolean);
  const fallbackFeaturedVendors = mappedAllVendors.filter((vendor) => vendor.isFeatured);
  const fallbackPopularVendors = mappedAllVendors.filter((vendor) => vendor.isPopular);
  const mappedPopularProducts = (response?.popularProducts?.edges || [])
    .filter(
      (edge) =>
        isPrimaryMenuProduct(edge?.node) && isCustomerVisibleMenuProduct(edge?.node),
    )
    .map((edge) => mapProductNode(edge.node))
    .filter(Boolean);
  const fallbackPopularProducts = flattenVendorProducts(response?.allVendors?.edges || [])
    .filter(
      (product) =>
        Boolean(product?.isPopular) &&
        isPrimaryMenuProduct(product) &&
        isCustomerVisibleMenuProduct(product),
    )
    .map((product) => mapProductNode(product))
    .filter(Boolean);

  return {
    allVendors: mappedAllVendors,
    searchedVendors: mappedSearchedVendors,
    featuredVendors: uniqueById(
      mappedFeaturedVendors.length > 0 ? mappedFeaturedVendors : fallbackFeaturedVendors,
    ),
    popularVendors: uniqueById(
      mappedPopularVendors.length > 0 ? mappedPopularVendors : fallbackPopularVendors,
    ),
    popularProducts: uniqueById(
      mappedPopularProducts.length > 0 ? mappedPopularProducts : fallbackPopularProducts,
    ),
  };
}
