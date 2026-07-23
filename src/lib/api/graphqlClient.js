import { getStoredAccessToken } from "../auth/authSession";

const DEFAULT_GRAPHQL_ENDPOINT =
  "https://api.gocatering.no/graphql/";

export const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL ??
  import.meta.env.VITE_GRAPHQL_API_URL ??
  DEFAULT_GRAPHQL_ENDPOINT;

const NORWEGIAN_TRANSLATIONS = {
  "passordet er for kort": "The password is too short.",
  "det må bestå av minst 8 tegn": "It must consist of at least 8 characters.",
  "dette passordet inneholder bare tall": "This password contains only numbers.",
  "dette passordet er for likt e-postadressen": "This password is too similar to the email address.",
  "dette passordet er for likt brukernavnet": "This password is too similar to the username.",
  "dette passordet er for vanlig": "This password is too common.",
  "passordene er ikke like": "The passwords do not match.",

  "e-posten er allerede i bruk": "This email is already in use.",
  "e-postadresse er allerede registrert": "This email address is already registered.",
  "ugyldig e-post eller passord": "Invalid email or password.",
  "feil e-post eller passord": "Incorrect email or password.",
  "brukeren eksisterer ikke": "User does not exist.",

  "feltet er påkrevd": "This field is required.",
  "dette feltet er obligatorisk": "This field is required.",
  "ugyldig verdi": "Invalid value.",
  "må være en gyldig e-postadresse": "Must be a valid email address.",
};

function translateNorwegianToEnglish(message) {
  if (!message || typeof message !== "string") {
    return message;
  }

  let translated = message;
  const messageLower = message.toLowerCase();

  for (const [norwegian, english] of Object.entries(NORWEGIAN_TRANSLATIONS)) {
    if (messageLower.includes(norwegian)) {
      const regex = new RegExp(norwegian, "gi");
      translated = translated.replace(regex, english);
    }
  }

  return translated.replace(/\.\./g, ".").trim();
}

function buildGraphqlErrorMessage(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return "Something went wrong.";
  }

  const primaryError = errors[0];
  const fieldErrors = primaryError?.extensions?.errors;
  let rawMessage = "Something went wrong.";

  if (fieldErrors && typeof fieldErrors === "object") {
    const details = Object.values(fieldErrors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean);

    if (details.length > 0) {
      rawMessage = details.join(". ");
    }
  } else {
    rawMessage = primaryError?.message ?? "Something went wrong.";
  }

  return translateNorwegianToEnglish(rawMessage);
}

function looksLikeHtmlDocument(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue.startsWith("<!doctype html") ||
    normalizedValue.startsWith("<html") ||
    normalizedValue.includes("<body")
  );
}

function sanitizeServerErrorMessage(message, fallbackMessage) {
  if (!message || typeof message !== "string") {
    return fallbackMessage;
  }

  if (looksLikeHtmlDocument(message)) {
    return fallbackMessage;
  }

  return message.trim();
}

export async function graphqlRequest({ query, variables = {}, signal }) {
  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": "en",
  };

  const accessToken = getStoredAccessToken();

  if (accessToken) {
    headers.Authorization = `JWT ${accessToken}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    signal,
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
      sanitizeServerErrorMessage(
        payload?.message ?? rawBody?.trim(),
        "Server error. Please try again shortly.",
      ),
    );
  }

  if (payload?.errors?.length) {
    throw new Error(buildGraphqlErrorMessage(payload.errors));
  }

  if (!payload?.data) {
    throw new Error(
      sanitizeServerErrorMessage(
        payload?.message ?? rawBody?.trim(),
        "Backend returned an unexpected response.",
      ),
    );
  }

  return payload.data;
}

