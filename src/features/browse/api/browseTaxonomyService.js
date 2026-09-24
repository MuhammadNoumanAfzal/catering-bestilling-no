import { toCustomerVatInclusivePrice } from "../../pricing/customerPricing";
import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { hydrateRatingsForItems } from "../../../utils/ratingHydrator";

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

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function resolvePublicVendorSlug(vendor) {
  const apiSlug = `${vendor?.slug ?? ""}`.trim();

  // Avoid exposing a numeric database ID in public vendor URLs.
  return apiSlug && !/^\d+$/.test(apiSlug) ? apiSlug : slugify(vendor?.name);
}

function resolveIconUrl(value) {
  const url = String(value || "").trim();
  if (!url || /^(?:data:|blob:)/i.test(url)) return url;

  const apiUrl = import.meta.env.VITE_GRAPHQL_API_URL ?? import.meta.env.VITE_GRAPHQL_URL ?? "https://api.gocatering.no/graphql/";
  const parsedUrl = new URL(url, apiUrl);
  return parsedUrl.pathname.startsWith("/media/")
    ? new URL(`${parsedUrl.pathname}${parsedUrl.search}`, apiUrl).toString()
    : parsedUrl.toString();
}

const GET_FOOD_TYPES_QUERY = `
  query GetFoodTypes {
    foodTypes {
      id
      name
      slug
      description
      iconUrl
      coverImageUrl
      isActive
      sortOrder
      productsCount
      vendorsCount
    }
  }
`;

const GET_OCCASIONS_QUERY = `
  query GetOccasions {
    occasions {
      id
      name
      slug
      description
      iconUrl
      coverImageUrl
      isActive
      sortOrder
      productsCount
      vendorsCount
    }
  }
`;

const BROWSE_PRODUCTS_BY_FOOD_TYPE_QUERY = `
  query BrowseProductsByFoodType(
    $foodTypeSlug: String
    $postCode: String
    $areaName: String
    $search: String
    $sortBy: String
    $priceMin: Float
    $priceMax: Float
    $minRating: Float
    $dietaryTagSlugs: [String!]
    $freeDelivery: Boolean
    $deliveryFeeMin: Float
    $deliveryFeeMax: Float
    $first: Int
    $after: String
  ) {
    dietaryTags {
      id
      name
      slug
      isActive
      sortOrder
    }
    products(
      foodTypeSlug: $foodTypeSlug
      postCode: $postCode
      areaName: $areaName
      search: $search
      productType: "menu"
      menuStatus: "published"
      sortBy: $sortBy
      priceMin: $priceMin
      priceMax: $priceMax
      minRating: $minRating
      dietaryTagSlugs: $dietaryTagSlugs
      freeDelivery: $freeDelivery
      deliveryFeeMin: $deliveryFeeMin
      deliveryFeeMax: $deliveryFeeMax
      first: $first
      after: $after
    ) {
      totalCount
      edges {
        cursor
        node {
          id
          slug
          name
          productType
          description
          priceWithTax
          pricingType
          averageRating
          ordersCount
          badge
          isPopular
          isFeatured
          minimumGuests
          createdOn
          coverImage {
            id
            fileUrl
          }
          vendor {
            id
            slug
            name
            postCode
            logoUrl
            rating
            reviewsCount
            serviceAreas {
              id
              name
              postCode
              isActive
            }
            businessSettings {
              businessAddress
            }
            specialClosures {
              edges {
                node {
                  id
                  startDate
                  endDate
                  reason
                  status
                }
              }
            }
            deliverySettings {
              baseDeliveryFee
              freeDeliveryOver
              pickupAddress
              pickupInstructions
              deliveryDays
              deliveryTimeSlots {
                day
                start
                end
              }
            }
          }
          foodTypes {
            id
            name
            slug
          }
          occasions {
            id
            name
            slug
          }
          dietaryTags {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const BROWSE_PRODUCTS_BY_OCCASION_QUERY = `
  query BrowseProductsByOccasion(
    $occasionSlug: String
    $postCode: String
    $areaName: String
    $search: String
    $sortBy: String
    $priceMin: Float
    $priceMax: Float
    $minRating: Float
    $dietaryTagSlugs: [String!]
    $freeDelivery: Boolean
    $deliveryFeeMin: Float
    $deliveryFeeMax: Float
    $first: Int
    $after: String
  ) {
    dietaryTags {
      id
      name
      slug
      isActive
      sortOrder
    }
    products(
      occasionSlug: $occasionSlug
      postCode: $postCode
      areaName: $areaName
      search: $search
      productType: "menu"
      menuStatus: "published"
      sortBy: $sortBy
      priceMin: $priceMin
      priceMax: $priceMax
      minRating: $minRating
      dietaryTagSlugs: $dietaryTagSlugs
      freeDelivery: $freeDelivery
      deliveryFeeMin: $deliveryFeeMin
      deliveryFeeMax: $deliveryFeeMax
      first: $first
      after: $after
    ) {
      totalCount
      edges {
        cursor
        node {
          id
          slug
          name
          productType
          description
          priceWithTax
          pricingType
          averageRating
          ordersCount
          badge
          minimumGuests
          createdOn
          coverImage {
            id
            fileUrl
          }
          vendor {
            id
            slug
            name
            postCode
            logoUrl
            rating
            reviewsCount
            serviceAreas {
              id
              name
              postCode
              isActive
            }
            businessSettings {
              businessAddress
            }
            specialClosures {
              edges {
                node {
                  id
                  startDate
                  endDate
                  reason
                  status
                }
              }
            }
            deliverySettings {
              baseDeliveryFee
              freeDeliveryOver
              pickupAddress
              pickupInstructions
              deliveryDays
              deliveryTimeSlots {
                day
                start
                end
              }
            }
          }
          foodTypes {
            id
            name
            slug
          }
          occasions {
            id
            name
            slug
          }
          dietaryTags {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function formatKrAmount(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  return `${new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}
function formatPriceWithLabel(price, pricingType) {
  const amount = toCustomerVatInclusivePrice(price);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  return `${formatKrAmount(amount)} ${
    pricingType === "per-person" ? "per person" : "per order"
  }`;
}

function formatRating(value) {
  return Number(value ?? 0).toFixed(1);
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

function formatDeliveryFee(value) {
  const amount = Number.parseFloat(value || 0);
  return Number.isFinite(amount) ? `${amount} Delivery fee` : "";
}

function normalizeDeliverySlots(deliveryTimeSlots = []) {
  return deliveryTimeSlots
    .map((slot) => {
      const dayKey = `${slot?.day ?? ""}`.trim().toLowerCase();
      const day = DAY_MAP[dayKey] === undefined ? dayKey : ["su", "mo", "tu", "we", "th", "fr", "sa"][DAY_MAP[dayKey]];
      const start = `${slot?.start ?? ""}`.trim();
      const end = `${slot?.end ?? ""}`.trim();

      if (!start || !end) {
        return null;
      }

      return { day, start, end };
    })
    .filter(Boolean);
}

function normalizeSpecialClosures(specialClosures) {
  const closureNodes = Array.isArray(specialClosures?.edges)
    ? specialClosures.edges.map((edge) => edge?.node).filter(Boolean)
    : Array.isArray(specialClosures)
      ? specialClosures
      : [];

  return closureNodes
    .map((closure) => {
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
      };
    })
    .filter(Boolean);
}

function mapBrowseVendor(vendor) {
  if (!vendor) {
    return null;
  }

  const address = vendor?.businessSettings?.businessAddress || "";
  const deliveryDays = (vendor?.deliverySettings?.deliveryDays || [])
    .map((day) => DAY_MAP[`${day}`.toLowerCase()])
    .filter((day) => day !== undefined);
  const deliverySlots = normalizeDeliverySlots(vendor?.deliverySettings?.deliveryTimeSlots || []);

  return {
    id: vendor.id || "",
    slug: resolvePublicVendorSlug(vendor),
    name: vendor.name || "Catering partner",
    rating: formatRating(vendor.rating),
    reviewCount: Number(vendor.reviewsCount || 0),
    logo: vendor.logoUrl || "",
    addressLine: address,
    city: extractCityFromAddress(address),
    primaryPostalCode: `${vendor?.postCode ?? ""}`.trim(),
    serviceAreas: (vendor?.serviceAreas || [])
      .filter((area) => area?.isActive)
      .map((area) => ({
        id: area.id || `${area.postCode}`,
        name: area.name || "",
        postCode: `${area?.postCode ?? ""}`.trim(),
      })),
    servicePostalCodes: (vendor?.serviceAreas || [])
      .filter((area) => area?.isActive)
      .map((area) => `${area?.postCode ?? ""}`.trim())
      .filter(Boolean),
    deliveryFee: formatDeliveryFee(vendor?.deliverySettings?.baseDeliveryFee),
    freeDeliveryOver:
      vendor?.deliverySettings?.freeDeliveryOver !== "" &&
      vendor?.deliverySettings?.freeDeliveryOver != null
        ? Number.parseFloat(vendor.deliverySettings.freeDeliveryOver || 0).toFixed(0)
        : "",
    pickupAddress: vendor?.deliverySettings?.pickupAddress || "",
    pickupInstructions: vendor?.deliverySettings?.pickupInstructions || "",
    specialClosures: normalizeSpecialClosures(vendor?.specialClosures),
    availability: {
      delivery: {
        days: deliveryDays,
        slots: deliverySlots,
        start: deliverySlots[0]?.start || "",
        end: deliverySlots[deliverySlots.length - 1]?.end || "",
      },
    },
  };
}

function normalizeCatalogText(value) {
  return `${value ?? ""}`.trim().toLowerCase();
}

function isAddOnCatalogItem(node) {
  const productType = normalizeCatalogText(node?.productType || node?.type || node?.itemType);

  if (["add-on", "addon", "add_on", "extra", "tillegg"].includes(productType)) {
    return true;
  }

  const label = normalizeCatalogText([node?.title, node?.name, node?.slug].filter(Boolean).join(" "));
  return /(^|[\s(-])(add-on|addon|add_on|tillegg)([\s)-]|$)/.test(label);
}

function isPrimaryMenuProduct(node) {
  const productType = normalizeCatalogText(node?.productType || node?.type || node?.itemType || "menu");

  if (isAddOnCatalogItem(node)) {
    return false;
  }

  return !productType || ["menu", "package", "catering", "menu_item", "menu-item"].includes(productType);
}

function mapProductNode(node, mode) {
  const vendor = node?.vendor || {};
  const mappedVendor = mapBrowseVendor(vendor);
  const categoryTags =
    mode === "occasion"
      ? (node?.occasions || []).map((item) => item.slug).filter(Boolean)
      : (node?.foodTypes || []).map((item) => item.slug).filter(Boolean);
  const dietaryTags = Array.isArray(node?.dietaryTags)
    ? node.dietaryTags
        .map((tag) => {
          if (typeof tag === "string") {
            return tag;
          }

          return tag?.slug || tag?.name || "";
        })
        .filter(Boolean)
    : [];

  return {
    id: node?.id || "",
    slug: node?.slug || "",
    title: node?.name || "Menu Item",
    name: node?.name || "Menu Item",
    description: node?.description || "",
    vendor: vendor.name || "Catering partner",
    vendorName: vendor.name || "Catering partner",
    vendorSlug: mappedVendor?.slug || "",
    vendorData: mappedVendor,
    image: node?.coverImage?.fileUrl || vendor.logoUrl || "/home/hero1.webp",
    rating: formatRating(node?.averageRating || vendor?.rating),
    price: formatPriceWithLabel(node?.priceWithTax, node?.pricingType),
    discount: node?.badge || "",
    categoryTags,
    dietaryTags,
    offerTags: [],
    pricingTier: "",
    individualPackaging: false,
    newlyAdded: false,
    smallBusiness: false,
    minimumOrderValue: toCustomerVatInclusivePrice(node?.priceWithTax),
    distanceKm: 0,
    popularityScore: Number(node?.ordersCount ?? 0) || 0,
    minimumGuests: Number(node?.minimumGuests ?? 0) || 0,
  };
}

function mapConnectionPayload(connection, mode) {
  const filteredEdges = (connection?.edges || []).filter((edge) =>
    isPrimaryMenuProduct(edge?.node),
  );

  return {
    totalCount: Number(connection?.totalCount ?? filteredEdges.length),
    items: filteredEdges.map((edge) =>
      mapProductNode(edge.node, mode),
    ),
    pageInfo: {
      hasNextPage: Boolean(connection?.pageInfo?.hasNextPage),
      endCursor: connection?.pageInfo?.endCursor || null,
    },
  };
}

export async function fetchFoodTypes() {
  const data = await graphqlRequest({ query: GET_FOOD_TYPES_QUERY });
  return Array.isArray(data?.foodTypes)
    ? data.foodTypes.map((item) => ({ ...item, iconUrl: resolveIconUrl(item?.iconUrl) }))
    : [];
}

export async function fetchOccasions() {
  const data = await graphqlRequest({ query: GET_OCCASIONS_QUERY });
  return Array.isArray(data?.occasions)
    ? data.occasions.map((item) => ({ ...item, iconUrl: resolveIconUrl(item?.iconUrl) }))
    : [];
}

export async function browseProductsByFoodType(variables) {
  const data = await graphqlRequest({
    query: BROWSE_PRODUCTS_BY_FOOD_TYPE_QUERY,
    variables,
  });

  const payload = mapConnectionPayload(data?.products, "food-type");
  payload.dietaryTags = Array.isArray(data?.dietaryTags) ? data.dietaryTags.filter((tag) => tag?.isActive !== false) : [];
  payload.items = await hydrateRatingsForItems(payload.items);
  return payload;
}

export async function browseProductsByOccasion(variables) {
  const data = await graphqlRequest({
    query: BROWSE_PRODUCTS_BY_OCCASION_QUERY,
    variables,
  });

  const payload = mapConnectionPayload(data?.products, "occasion");
  payload.dietaryTags = Array.isArray(data?.dietaryTags) ? data.dietaryTags.filter((tag) => tag?.isActive !== false) : [];
  payload.items = await hydrateRatingsForItems(payload.items);
  return payload;
}

const BROWSE_FILTER_OPTIONS_QUERY = `
  query BrowseFilterOptions {
    browseFilterOptions {
      foodTypes { id name slug iconUrl }
      occasions { id name slug iconUrl }
      dietaryOptions { id name slug iconUrl }
    }
  }
`;

const BROWSE_MENUS_QUERY = `
  query BrowseMenus($foodTypeSlug: String, $occasionSlug: String, $sort: BrowseMenuSort, $priceRange: PriceRange, $minRating: Float, $dietaryOptionIds: [ID!], $deliveryFilter: DeliveryFilter, $first: Int, $after: String) {
    browseMenus(foodTypeSlug: $foodTypeSlug, occasionSlug: $occasionSlug, sort: $sort, priceRange: $priceRange, minRating: $minRating, dietaryOptionIds: $dietaryOptionIds, deliveryFilter: $deliveryFilter, first: $first, after: $after) {
      edges { cursor node {
        id slug title description imageUrl priceFrom currency publishedAt
        vendor { id slug name logoUrl city postCode averageRating reviewCount completedOrdersCount serviceAreas { id name postCode isActive } }
        foodTypes { id name slug }
        occasions { id name slug }
        dietaryOptions { id name slug iconUrl }
        delivery { fee isFree available }
      } }
      pageInfo { hasNextPage endCursor }
      totalCount
    }
  }
`;

export async function fetchBrowseFilterOptions() {
  const data = await graphqlRequest({ query: BROWSE_FILTER_OPTIONS_QUERY });
  const options = data?.browseFilterOptions || {};
  return {
    foodTypes: Array.isArray(options.foodTypes) ? options.foodTypes.map((item) => ({ ...item, iconUrl: resolveIconUrl(item?.iconUrl) })) : [],
    occasions: Array.isArray(options.occasions) ? options.occasions.map((item) => ({ ...item, iconUrl: resolveIconUrl(item?.iconUrl) })) : [],
    dietaryOptions: Array.isArray(options.dietaryOptions) ? options.dietaryOptions.map((item) => ({ ...item, iconUrl: resolveIconUrl(item?.iconUrl) })) : [],
  };
}

function mapBrowseMenuNode(node, mode) {
  const vendor = node?.vendor || {};
  const delivery = node?.delivery || {};
  const price = Number(node?.priceFrom || 0);
  const dietaryTags = (node?.dietaryOptions || []).map((item) => item?.slug || item?.name).filter(Boolean);
  const categories = mode === "occasion" ? node?.occasions : node?.foodTypes;

  return {
    id: node?.id || "",
    slug: node?.slug || "",
    title: node?.title || "Menu Item",
    name: node?.title || "Menu Item",
    description: node?.description || "",
    vendor: vendor?.name || "Catering partner",
    vendorName: vendor?.name || "Catering partner",
    vendorSlug: resolvePublicVendorSlug(vendor),
    vendorData: mapBrowseVendor({ ...vendor, deliverySettings: { baseDeliveryFee: delivery?.fee } }),
    image: node?.imageUrl || vendor?.logoUrl || "/home/hero1.webp",
    rating: formatRating(vendor?.averageRating),
    price: formatKrAmount(price),
    discount: "",
    categoryTags: (categories || []).map((item) => item?.slug).filter(Boolean),
    dietaryTags,
    offerTags: delivery?.isFree ? ["Free Delivery"] : [],
    minimumOrderValue: price,
    popularityScore: Number(vendor?.completedOrdersCount || 0),
    minimumGuests: 0,
  };
}

export async function browseMenus(variables, mode) {
  const data = await graphqlRequest({ query: BROWSE_MENUS_QUERY, variables });
  const connection = data?.browseMenus || {};
  const items = (connection?.edges || [])
    .map((edge) => edge?.node)
    .filter(isPrimaryMenuProduct)
    .map((node) => mapBrowseMenuNode(node, mode))
    .filter((item) => item.id);
  const payload = {
    totalCount: items.length,
    items,
    pageInfo: { hasNextPage: Boolean(connection?.pageInfo?.hasNextPage), endCursor: connection?.pageInfo?.endCursor || null },
  };
  payload.items = await hydrateRatingsForItems(payload.items);
  return payload;
}
