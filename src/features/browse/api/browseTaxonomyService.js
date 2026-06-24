import { graphqlRequest } from "../../../lib/api/graphqlClient";

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
    $foodTypeSlug: String!
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
            logoUrl
            rating
            reviewsCount
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
    $occasionSlug: String!
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
            logoUrl
            rating
            reviewsCount
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

function mapProductNode(node, mode) {
  const vendor = node?.vendor || {};
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
    vendorData: {
      id: vendor.id || "",
      slug: vendor.slug || "",
      name: vendor.name || "Catering partner",
    },
    image: node?.coverImage?.fileUrl || vendor.logoUrl || "/home/hero1.webp",
    rating: formatRating(node?.averageRating ?? vendor?.rating),
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
  return {
    totalCount: connection?.totalCount ?? 0,
    items: (connection?.edges || []).map((edge) =>
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

  return mapConnectionPayload(data?.products, "food-type");
}

export async function browseProductsByOccasion(variables) {
  const data = await graphqlRequest({
    query: BROWSE_PRODUCTS_BY_OCCASION_QUERY,
    variables,
  });

  return mapConnectionPayload(data?.products, "occasion");
}
