import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  adaptApiProductToMenuItem,
  adaptApiVendorToProfile,
  getFallbackVendorMenuItemById,
  getFallbackVendorProfileBySlug,
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

function getFallbackMenuPayload(vendorSlug, itemId) {
  const vendor = getFallbackVendorProfileBySlug(vendorSlug);
  const product = getFallbackVendorMenuItemById(vendorSlug, itemId);

  if (!vendor || !product) {
    return null;
  }

  return { product, vendor };
}

export async function fetchMenuDetails({ itemId, vendorSlug }) {
  try {
    const response = await graphqlRequest({
      query: FETCH_PRODUCT_QUERY,
      variables: { id: itemId },
    });

    if (!response.product) {
      throw new Error("Product not found.");
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
  } catch (error) {
    const fallback = getFallbackMenuPayload(vendorSlug, itemId);

    if (fallback) {
      return fallback;
    }

    throw error;
  }
}
