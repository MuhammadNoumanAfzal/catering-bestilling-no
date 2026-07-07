import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { mapHomeResponse } from "./homeMappers";
import { FETCH_HOME_DATA_QUERY } from "./homeQueries";
import { hydrateRatingsForItems } from "../../../utils/ratingHydrator";

export async function fetchHomeContent(filters = {}, signal) {
  const response = await graphqlRequest({
    query: FETCH_HOME_DATA_QUERY,
    variables: {
      postCode: filters.postCode || null,
      areaName: filters.areaName || null,
    },
    signal,
  });
  const mapped = mapHomeResponse(response);

  const [featuredVendors, popularVendors, popularProducts] = await Promise.all([
    hydrateRatingsForItems(mapped.featuredVendors),
    hydrateRatingsForItems(mapped.popularVendors),
    hydrateRatingsForItems(mapped.popularProducts),
  ]);

  return {
    featuredVendors,
    popularVendors,
    popularProducts,
  };
}
