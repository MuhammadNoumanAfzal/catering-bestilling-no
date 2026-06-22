import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  adaptApiProductToMenuItem,
  adaptApiVendorToProfile,
} from "../../vendor";
import { attachAddOnsToMenuItem } from "./menuMappers";
import { FETCH_ADD_ONS_QUERY, FETCH_PRODUCT_QUERY } from "./menuQueries";

async function fetchAddOns() {
  try {
    const response = await graphqlRequest({ query: FETCH_ADD_ONS_QUERY });
    return (response.products?.edges || []).map((edge) => edge.node);
  } catch {
    return [];
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

  const responseVendorSlug = `${response.product.vendor?.name ?? ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (vendorSlug && responseVendorSlug && responseVendorSlug !== vendorSlug) {
    throw new Error("Product does not belong to the requested vendor.");
  }

  const [apiAddOns, product, vendor] = await Promise.all([
    fetchAddOns(),
    Promise.resolve(adaptApiProductToMenuItem(response.product)),
    Promise.resolve(adaptApiVendorToProfile(response.product.vendor)),
  ]);

  return {
    product: attachAddOnsToMenuItem(product, apiAddOns),
    vendor,
  };
}
