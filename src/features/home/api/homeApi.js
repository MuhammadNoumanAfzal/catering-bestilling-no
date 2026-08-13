import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { mapHomeResponse } from "./homeMappers";
import { FETCH_HOME_DATA_QUERY } from "./homeQueries";
import { hydrateRatingsForItems } from "../../../utils/ratingHydrator";
import { fetchVendorProfiles } from "../../vendor/api/vendorService";

export async function fetchHomeContent(filters = {}, signal) {
  const hasLocationSearch = Boolean(filters.postCode || filters.areaName);
  const response = await graphqlRequest({
    query: FETCH_HOME_DATA_QUERY,
    variables: {
      postCode: filters.postCode || null,
      areaName: filters.areaName || null,
      includeSearchVendors: hasLocationSearch,
    },
    signal,
  });
  const mapped = mapHomeResponse(response);
  let fallbackAllVendors = mapped.allVendors || [];

  if (!hasLocationSearch && fallbackAllVendors.length === 0) {
    try {
      fallbackAllVendors = await fetchVendorProfiles();
    } catch {
      fallbackAllVendors = mapped.allVendors || [];
    }
  }

  const [
    allVendors,
    searchedVendors,
    featuredVendors,
    popularVendors,
    popularProducts,
  ] = await Promise.all([
    hydrateRatingsForItems(fallbackAllVendors),
    hydrateRatingsForItems(mapped.searchedVendors || []),
    hydrateRatingsForItems(mapped.featuredVendors),
    hydrateRatingsForItems(mapped.popularVendors),
    hydrateRatingsForItems(mapped.popularProducts),
  ]);

  return {
    allVendors,
    searchedVendors,
    featuredVendors,
    popularVendors,
    popularProducts,
  };
}
