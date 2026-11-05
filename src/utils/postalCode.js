// Postal codes are identifiers. Keep entered digits as text throughout the UI.
export function postalCodeText(value) {
  return String(value ?? "").trim();
}

// The current signup/profile GraphQL inputs still require Int.
// Restore only the submitted representation when the server returns its numeric equivalent.
export function preservePostalCode(value, submitted) {
  const original = postalCodeText(submitted);
  const returned = postalCodeText(value);
  if (/^\d+$/.test(original) && /^\d+$/.test(returned) && Number(original) === Number(returned)) return original;
  return returned;
}

// Scope the entered representation to its account, including across reloads.
export function accountPostalCode(user, submitted) {
  const identity = String(user?.id || user?.email || "").trim();
  if (!identity || typeof window === "undefined") return preservePostalCode(user?.postCode, submitted);
  const key = "customer-postal-code:" + encodeURIComponent(identity);
  try {
    const original = submitted === undefined ? window.localStorage.getItem(key) : submitted;
    const code = preservePostalCode(user?.postCode, original);
    if (submitted !== undefined && code === postalCodeText(submitted) && /^\d{4,5}$/.test(code)) window.localStorage.setItem(key, code);
    return code;
  } catch { return preservePostalCode(user?.postCode, submitted); }
}
