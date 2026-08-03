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
    $first: Int
    $after: String
  ) {
    products(
      foodTypeSlug: $foodTypeSlug
      postCode: $postCode
      areaName: $areaName
      search: $search
      sortBy: $sortBy
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
          dietaryTags
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
    $first: Int
    $after: String
  ) {
    products(
      occasionSlug: $occasionSlug
      postCode: $postCode
      areaName: $areaName
      search: $search
      sortBy: $sortBy
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
          dietaryTags
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function formatPriceWithLabel(price, pricingType) {
  const amount = Number(price ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  return `NOK ${amount.toFixed(2)} ${
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
  return Number.isFinite(amount) ? `${amount} NOK Delivery fee` : "";
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
    slug: vendor.slug || "",
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
    servicePostalCodes: [
      `${vendor?.postCode ?? ""}`.trim(),
      ...(vendor?.serviceAreas || [])
        .filter((area) => area?.isActive)
        .map((area) => `${area?.postCode ?? ""}`.trim()),
    ].filter(Boolean),
    deliveryFee: formatDeliveryFee(vendor?.deliverySettings?.baseDeliveryFee),
    freeDeliveryOver:
      vendor?.deliverySettings?.freeDeliveryOver !== "" &&
      vendor?.deliverySettings?.freeDeliveryOver != null
        ? `NOK ${Number.parseFloat(vendor.deliverySettings.freeDeliveryOver || 0).toFixed(0)}`
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

function isPrimaryMenuProduct(node) {
  return `${node?.productType ?? "menu"}`.toLowerCase() === "menu";
}

function mapProductNode(node, mode) {
  const vendor = node?.vendor || {};
  const mappedVendor = mapBrowseVendor(vendor);
  const categoryTags =
    mode === "occasion"
      ? (node?.occasions || []).map((item) => item.slug).filter(Boolean)
      : (node?.foodTypes || []).map((item) => item.slug).filter(Boolean);

  return {
    id: node?.id || "",
    slug: node?.slug || "",
    title: node?.name || "Menu Item",
    name: node?.name || "Menu Item",
    description: node?.description || "",
    vendor: vendor.name || "Catering partner",
    vendorName: vendor.name || "Catering partner",
    vendorSlug: vendor.slug || "",
    vendorData: mappedVendor,
    image: node?.coverImage?.fileUrl || vendor.logoUrl || "/home/hero1.webp",
    rating: formatRating(node?.averageRating || vendor?.rating),
    price: formatPriceWithLabel(node?.priceWithTax, node?.pricingType),
    discount: node?.badge || "",
    categoryTags,
    dietaryTags: Array.isArray(node?.dietaryTags) ? node.dietaryTags : [],
    offerTags: [],
    pricingTier: "",
    individualPackaging: false,
    newlyAdded: false,
    smallBusiness: false,
    minimumOrderValue: Number(node?.priceWithTax ?? 0) || 0,
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
    totalCount: filteredEdges.length,
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
  return Array.isArray(data?.foodTypes) ? data.foodTypes : [];
}

export async function fetchOccasions() {
  const data = await graphqlRequest({ query: GET_OCCASIONS_QUERY });
  return Array.isArray(data?.occasions) ? data.occasions : [];
}

export async function browseProductsByFoodType(variables) {
  const data = await graphqlRequest({
    query: BROWSE_PRODUCTS_BY_FOOD_TYPE_QUERY,
    variables,
  });

  const payload = mapConnectionPayload(data?.products, "food-type");
  payload.items = await hydrateRatingsForItems(payload.items);
  return payload;
}

export async function browseProductsByOccasion(variables) {
  const data = await graphqlRequest({
    query: BROWSE_PRODUCTS_BY_OCCASION_QUERY,
    variables,
  });

  const payload = mapConnectionPayload(data?.products, "occasion");
  payload.items = await hydrateRatingsForItems(payload.items);
  return payload;
}
