import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { FETCH_VENDORS_QUERY } from "./vendorQueries";
import { adaptApiVendorToProfile } from "./vendorNormalization";

const slugify = (text) => {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export async function getVendorProfileFromApi(vendorSlug) {
  const response = await graphqlRequest({ query: FETCH_VENDORS_QUERY });
  const allVendors = (response.vendors?.edges || []).map((edge) => edge.node);
  const apiVendorNode = allVendors.find(
    (node) => slugify(node.name) === vendorSlug,
  );

  if (!apiVendorNode) {
    throw new Error("Vendor profile not found in API.");
  }

  return adaptApiVendorToProfile(apiVendorNode);
}
