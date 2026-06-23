import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { mapHomeResponse } from "./homeMappers";
import { FETCH_HOME_DATA_QUERY } from "./homeQueries";

export async function fetchHomeContent(filters = {}) {
  const response = await graphqlRequest({
    query: FETCH_HOME_DATA_QUERY,
    variables: {
      postCode: filters.postCode || null,
      areaName: filters.areaName || null,
    },
  });
  return mapHomeResponse(response);
}
