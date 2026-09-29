import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { mapHomeResponse } from "./homeMappers";
import { FETCH_HOME_DATA_QUERY } from "./homeQueries";
import { hydrateRatingsForItems } from "../../../utils/ratingHydrator";
import { fetchVendorProfiles } from "../../vendor/api/vendorService";
import { filterVendorsByLocation } from "../../vendor";

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

  const shouldLoadFallbackVendors =
    fallbackAllVendors.length === 0 &&
    (!hasLocationSearch || !mapped.searchedVendors || mapped.searchedVendors.length === 0);

  if (shouldLoadFallbackVendors) {
    try {
      fallbackAllVendors = await fetchVendorProfiles();
    } catch {
      fallbackAllVendors = mapped.allVendors || [];
    }
  }

  const locationSearchValue = filters.postCode || filters.areaName || "";
  const fallbackSearchedVendors =
    hasLocationSearch && (!mapped.searchedVendors || mapped.searchedVendors.length === 0)
      ? filterVendorsByLocation(fallbackAllVendors, locationSearchValue)
      : mapped.searchedVendors || [];

  const [
    allVendors,
    searchedVendors,
    featuredVendors,
    popularVendors,
    popularProducts,
  ] = await Promise.all([
    hydrateRatingsForItems(fallbackAllVendors),
    hydrateRatingsForItems(fallbackSearchedVendors),
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