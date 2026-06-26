import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  adaptApiProductToMenuItem,
  adaptApiVendorToProfile,
} from "../../vendor";
import { fetchVendorReviews } from "../../vendor/api/vendorService";
import { attachAddOnsToMenuItem } from "./menuMappers";
import {
  FETCH_PRODUCT_QUERY,
  FETCH_VENDOR_ADD_ONS_QUERY,
} from "./menuQueries";

function mapVendorAddOns(edges) {
  return (edges || [])
    .map((edge) => edge?.node)
    .filter(
      (node) =>
        node &&
        `${node.menuStatus ?? ""}`.toLowerCase() === "active",
    )
    .map((node) => {
      return {
        id: node.id,
        name: node.title || node.name,
        description: node.description || "",
        priceWithTax: node.priceWithTax,
        dietaryTags: node.dietaryTags || [],
        coverImage: node.coverImage
          ? {
              fileUrl: node.coverImage.fileUrl || "",
            }
          : null,
      };
    });
}

async function fetchVendorAddOns(vendorId) {
  if (!vendorId) {
    return [];
  }

  try {
    const response = await graphqlRequest({
      query: FETCH_VENDOR_ADD_ONS_QUERY,
      variables: { vendorId: `${vendorId}` },
    });

    return mapVendorAddOns(response?.products?.edges);
  } catch {
    return [];
  }
}

async function hydrateMenuVendorRating(vendorProfile, vendorSlug) {
  const reviewCount = Number(vendorProfile?.reviewCount ?? 0);
  const rating = Number(vendorProfile?.rating ?? 0);

  if (!vendorProfile || !vendorSlug || reviewCount <= 0 || rating > 0) {
    return vendorProfile;
  }

  try {
    const reviewConnection = await fetchVendorReviews(vendorSlug, { first: 50 });
    const ratings = (reviewConnection.reviews || [])
      .map((review) => Number(review.rating ?? 0))
      .filter((value) => value > 0);

    if (ratings.length === 0) {
      return vendorProfile;
    }

    const averageRating =
      ratings.reduce((total, value) => total + value, 0) / ratings.length;

    return {
      ...vendorProfile,
      rating: averageRating.toFixed(1),
      reviewCount: Math.max(
        reviewCount,
        Number(reviewConnection.totalCount ?? ratings.length),
      ),
    };
  } catch {
    return vendorProfile;
  }
}

export async function fetchMenuDetails({ itemId, vendorSlug }) {
  const response = await graphqlRequest({
    query: FETCH_PRODUCT_QUERY,
    variables: { id: itemId },
  });

  if (!response.product) {
    throw new Error("Product not found.");
  }

  const responseVendorSlug =
    response.product.vendor?.slug ||
    `${response.product.vendor?.name ?? ""}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  if (vendorSlug && responseVendorSlug && responseVendorSlug !== vendorSlug) {
    throw new Error("Product does not belong to the requested vendor.");
  }

  const [productResult, vendor, vendorAddOns] = await Promise.all([
    Promise.resolve(adaptApiProductToMenuItem(response.product)),
    Promise.resolve(adaptApiVendorToProfile(response.product.vendor)).then(
      (vendorProfile) => hydrateMenuVendorRating(vendorProfile, vendorSlug),
    ),
    fetchVendorAddOns(response.product.vendor?.id),
  ]);

  const hasProductLevelAddOns =
    Array.isArray(productResult?.modal?.optionalSelections) &&
    productResult.modal.optionalSelections.length > 0;
  const product = hasProductLevelAddOns
    ? productResult
    : attachAddOnsToMenuItem(productResult, vendorAddOns);

  return {
    product,
    vendor,
  };
}
