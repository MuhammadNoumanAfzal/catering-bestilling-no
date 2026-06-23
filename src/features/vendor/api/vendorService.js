import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { adaptApiVendorReview, adaptApiVendorToProfile } from "./vendorMappers";
import {
  FETCH_SAVED_VENDORS_QUERY,
  FETCH_VENDOR_BY_SLUG_QUERY,
  FETCH_VENDOR_REVIEWS_QUERY,
  FETCH_VENDORS_QUERY,
  REMOVE_SAVED_VENDOR_MUTATION,
  SAVE_VENDOR_MUTATION,
  SUBMIT_VENDOR_REVIEW_MUTATION,
} from "./vendorQueries";

let vendorProfilesCache = null;
let vendorProfilesPromise = null;

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function fetchVendors() {
  const response = await graphqlRequest({ query: FETCH_VENDORS_QUERY });
  return (response.vendors?.edges || []).map((edge) => edge.node);
}

export async function fetchVendorProfiles() {
  if (vendorProfilesCache) {
    return vendorProfilesCache;
  }

  if (!vendorProfilesPromise) {
    vendorProfilesPromise = fetchVendors()
      .then((vendors) => vendors.map((vendor) => adaptApiVendorToProfile(vendor)))
      .then((profiles) => {
        vendorProfilesCache = profiles;
        return profiles;
      })
      .finally(() => {
        vendorProfilesPromise = null;
      });
  }

  return vendorProfilesPromise;
}

export async function fetchVendorProfileBySlug(vendorSlug) {
  try {
    const response = await graphqlRequest({
      query: FETCH_VENDOR_BY_SLUG_QUERY,
      variables: { slug: vendorSlug },
    });
    const matchedVendor = adaptApiVendorToProfile(response.vendor);

    if (!matchedVendor?.id) {
      throw new Error("Vendor profile not found in API.");
    }

    return matchedVendor;
  } catch {
    const vendorProfiles = await fetchVendorProfiles();
    const matchedVendor = vendorProfiles.find(
      (vendor) => slugify(vendor.slug || vendor.name) === vendorSlug,
    );

    if (!matchedVendor) {
      throw new Error("Vendor profile not found in API.");
    }

    return matchedVendor;
  }
}

export async function fetchVendorReviews(vendorSlug, { first = 10, after = null } = {}) {
  const response = await graphqlRequest({
    query: FETCH_VENDOR_REVIEWS_QUERY,
    variables: {
      vendorSlug,
      first,
      after,
    },
  });

  const reviewConnection = response.vendor?.reviews;

  return {
    reviews: (reviewConnection?.edges || []).map((edge) =>
      adaptApiVendorReview(edge.node),
    ),
    totalCount: reviewConnection?.totalCount || 0,
    pageInfo: {
      hasNextPage: Boolean(reviewConnection?.pageInfo?.hasNextPage),
      endCursor: reviewConnection?.pageInfo?.endCursor || null,
    },
  };
}

export async function submitVendorReview(input) {
  const response = await graphqlRequest({
    query: SUBMIT_VENDOR_REVIEW_MUTATION,
    variables: { input },
  });

  const payload = response.createVendorReview;

  return {
    success: Boolean(payload?.success),
    message: payload?.message || "Review submitted successfully.",
    review: payload?.review ? adaptApiVendorReview(payload.review) : null,
  };
}

export async function fetchSavedVendors() {
  const response = await graphqlRequest({
    query: FETCH_SAVED_VENDORS_QUERY,
  });

  return Array.isArray(response.savedVendors) ? response.savedVendors : [];
}

export async function saveVendor(vendorId) {
  const response = await graphqlRequest({
    query: SAVE_VENDOR_MUTATION,
    variables: { vendorId },
  });

  return response.saveVendor;
}

export async function removeSavedVendor(vendorId) {
  const response = await graphqlRequest({
    query: REMOVE_SAVED_VENDOR_MUTATION,
    variables: { vendorId },
  });

  return response.removeSavedVendor;
}
