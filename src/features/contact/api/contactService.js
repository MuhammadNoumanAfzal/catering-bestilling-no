import { GRAPHQL_ENDPOINT } from "../../../lib/api/graphqlClient";
import { getStoredAccessToken } from "../../../lib/auth/authSession";

function resolveApiBaseUrl() {
  const explicitBaseUrl =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_BACKEND_BASE_URL ??
    "";

  if (explicitBaseUrl) {
    return `${explicitBaseUrl}`.replace(/\/+$/, "");
  }

  return `${GRAPHQL_ENDPOINT}`.replace(/\/graphql\/?$/i, "").replace(/\/+$/, "");
}

const API_BASE_URL = resolveApiBaseUrl();

function buildUrl(pathname) {
  return `${API_BASE_URL}${pathname}`;
}

async function parseJsonResponse(response) {
  const rawBody = await response.text();

  try {
    return rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return null;
  }
}

export async function fetchContactTopics() {
  const response = await fetch(buildUrl("/api/contact/topics"), {
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Unable to load contact topics.");
  }

  return Array.isArray(payload.topics) ? payload.topics : [];
}

export async function fetchContactPrefill() {
  const accessToken = getStoredAccessToken();

  if (!accessToken) {
    return null;
  }

  const response = await fetch(buildUrl("/api/contact/prefill"), {
    headers: {
      Accept: "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });

  if (response.status === 401) {
    return null;
  }

  const payload = await parseJsonResponse(response);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Unable to prefill contact details.");
  }

  return payload.data || null;
}

export async function submitContactInquiry(input) {
  const response = await fetch(buildUrl("/api/contact/inquiries"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${input?.name ?? ""}`.trim(),
      email: `${input?.email ?? ""}`.trim(),
      company: `${input?.company ?? ""}`.trim(),
      phone: `${input?.phone ?? ""}`.trim(),
      topic: `${input?.topic ?? ""}`.trim(),
      message: `${input?.message ?? ""}`.trim(),
      source: "web-contact-page",
      locale:
        typeof navigator !== "undefined" && navigator.language
          ? navigator.language
          : "en-NO",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    }),
  });

  const payload = await parseJsonResponse(response);

  if (response.status === 400) {
    return {
      success: false,
      errorType: "validation",
      errors: payload?.errors || {},
      message: payload?.message || "Validation failed.",
    };
  }

  if (response.status === 429) {
    return {
      success: false,
      errorType: "rate-limit",
      message: payload?.message || "Too many requests. Please try again later.",
    };
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Unable to submit your request.");
  }

  return {
    success: true,
    data: payload.data || {},
    message: payload.message || "Inquiry submitted successfully.",
  };
}
