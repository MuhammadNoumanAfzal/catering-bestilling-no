import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { adaptApiVendorToProfile } from "./vendorMappers";
import { FETCH_VENDORS_QUERY } from "./vendorQueries";

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
  const vendors = await fetchVendors();
  return vendors.map((vendor) => adaptApiVendorToProfile(vendor));
}

export async function fetchVendorProfileBySlug(vendorSlug) {
  const vendorProfiles = await fetchVendorProfiles();
  const matchedVendor = vendorProfiles.find(
    (vendor) => slugify(vendor.name) === vendorSlug,
  );

  if (!matchedVendor) {
    throw new Error("Vendor profile not found in API.");
  }

  return matchedVendor;
}
