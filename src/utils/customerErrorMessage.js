const FALLBACK = "We couldn't complete that right now. Please try again in a moment. If it keeps happening, contact support.";

export function customerErrorMessage(error, fallback = FALLBACK) {
  const message = String(typeof error === "string" ? error : error?.message || "").trim();
  if (!message) return fallback;
  if (/registered as a vendor|vendor account|correct panel/i.test(message)) {
    return "This is a catering partner account. Please use 'I'm a Catering Partner' to sign in.";
  }
  if (/failed to fetch|networkerror|network request|load failed|unable to connect|fetch failed/i.test(message)) {
    return "We couldn't connect. Please check your internet connection and try again in a moment.";
  }
  if (/timeout|timed out|too long|aborted/i.test(message)) {
    return "This is taking longer than usual. Please try again in a moment.";
  }
  if (/invalid.*token|token.*expired|jwt|session expired|authentication required|unauthenticated/i.test(message)) {
    return "Please sign in again to continue.";
  }
  if (/invalid credentials|invalid email or password|incorrect email or password|user does not exist/i.test(message)) {
    return "The email or password doesn't look right. Please check them and try again, or choose 'Forgot Password'.";
  }
  if (/too many requests|rate limit|\b429\b/i.test(message)) {
    return "Please wait a moment before trying again.";
  }
  if (/graphql|backend|deployment|server error|internal server|bad gateway|service unavailable|unexpected response|invalid response|cannot query|unknown argument|syntaxerror|typeerror|traceback|stack trace|exception|sql|database|does not have.*attribute|has no attribute|attribute '|did not include|access token|user object|permission denied|not authorized|\b50[0234]\b|<[^>]+>/i.test(message)) {
    return fallback;
  }
  return message;
}
