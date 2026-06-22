import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { mapHomeResponse } from "./homeMappers";
import { FETCH_HOME_DATA_QUERY } from "./homeQueries";

export async function fetchHomeContent() {
  const response = await graphqlRequest({ query: FETCH_HOME_DATA_QUERY });
  return mapHomeResponse(response);
}
