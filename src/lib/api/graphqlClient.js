const DEFAULT_GRAPHQL_ENDPOINT =
  "https://lunsjavtale-backend-w2cf.onrender.com/graphql/";

export const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL ?? DEFAULT_GRAPHQL_ENDPOINT;

function buildGraphqlErrorMessage(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return "Something went wrong.";
  }

  const primaryError = errors[0];
  const fieldErrors = primaryError?.extensions?.errors;

  if (fieldErrors && typeof fieldErrors === "object") {
    const details = Object.values(fieldErrors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean);

    if (details.length > 0) {
      return details.join(". ");
    }
  }

  return primaryError?.message ?? "Something went wrong.";
}

export async function graphqlRequest({ query, variables = {} }) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const rawBody = await response.text();
  let payload = null;

  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.message ??
        rawBody?.trim() ??
        "Request failed. Please try again.",
    );
  }

  if (payload?.errors?.length) {
    throw new Error(buildGraphqlErrorMessage(payload.errors));
  }

  if (!payload?.data) {
    throw new Error(
      payload?.message ??
        rawBody?.trim() ??
        "Backend returned an unexpected response.",
    );
  }

  return payload.data;
}
