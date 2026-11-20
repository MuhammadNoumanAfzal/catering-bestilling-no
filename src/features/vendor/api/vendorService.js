import { readVendorCatalogue, mergeVendorCatalogue } from './vendorCatalogue.js';
import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { getStoredAccessToken } from "../../../lib/auth/authSession";
import { adaptApiVendorReview, adaptApiVendorToProfile } from "./vendorMappers";
import {
  FETCH_VENDOR_CATALOGUE_QUERY,
  FETCH_SAVED_VENDORS_QUERY,
  FETCH_VENDOR_BY_SLUG_QUERY,
  FETCH_VENDOR_REVIEWS_QUERY,
  FETCH_VENDORS_QUERY,
  REMOVE_SAVED_VENDOR_MUTATION,
  SAVE_VENDOR_MUTATION,
  SUBMIT_VENDOR_REVIEW_MUTATION,
} from "./vendorQueries";

let vendorProfilesPromise = null;

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function shouldHydrateRatingFromReviews(vendor) {
  if (!vendor) {
    return false;
  }

  const reviewCount = Number(vendor.reviewCount ?? vendor.reviewsCount ?? 0);
  const rating = Number(vendor.rating ?? 0);

  return reviewCount > 0 && rating <= 0;
}

async function hydrateVendorRatingFromReviews(vendorProfile, vendorSlug) {
  if (!shouldHydrateRatingFromReviews(vendorProfile) || !vendorSlug) {
    return vendorProfile;
  }

  try {
    const reviewConnection = await fetchVendorReviews(vendorSlug, { first: 50 });
    const ratings = (reviewConnection.reviews || [])
      .map((review) => Number(review.rating ?? 0))
      .filter((rating) => rating > 0);

    if (ratings.length === 0) {
      return vendorProfile;
    }

    const averageRating =
      ratings.reduce((total, rating) => total + rating, 0) / ratings.length;

    return {
      ...vendorProfile,
      rating: averageRating.toFixed(1),
      reviewCount: Math.max(
        Number(vendorProfile.reviewCount ?? 0),
        Number(reviewConnection.totalCount ?? ratings.length),
      ),
    };
  } catch {
    return vendorProfile;
  }
}

export async function fetchVendors() {
  const response = await graphqlRequest({ query: FETCH_VENDORS_QUERY });
  return (response.vendors?.edges || []).map((edge) => edge.node);
}

export async function fetchVendorProfiles() {
  if (!vendorProfilesPromise) {
    vendorProfilesPromise = fetchVendors()
      .then((vendors) => vendors.map((vendor) => adaptApiVendorToProfile(vendor)))
      .then((profiles) => profiles.filter(Boolean))
      .then((profiles) =>
        Promise.all(
          profiles.map((profile) =>
            hydrateVendorRatingFromReviews(profile, profile?.slug),
          ),
        ),
      )
      .finally(() => {
        vendorProfilesPromise = null;
      });
  }

  return vendorProfilesPromise;
}

export async function fetchVendorProfileBySlug(vendorSlug) {
 let apiVendor;
 try {
  const response=await graphqlRequest({query:FETCH_VENDOR_BY_SLUG_QUERY,variables:{slug:vendorSlug,includeReviewPermissions:Boolean(getStoredAccessToken())}});
  apiVendor=response.vendor;
 } catch {
  apiVendor=(await fetchVendors()).find(v=>slugify(v.slug||v.name)===vendorSlug);
 }
 if(!apiVendor?.id)throw new Error('Vendor profile not found in API.');
 const products=await readVendorCatalogue(async after=>{
  const response=await graphqlRequest({query:FETCH_VENDOR_CATALOGUE_QUERY,variables:{vendor:String(apiVendor.id),after},publicRequest:true});
  return response.products;
 });
 return hydrateVendorRatingFromReviews(adaptApiVendorToProfile(mergeVendorCatalogue(apiVendor,products)),vendorSlug);
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
