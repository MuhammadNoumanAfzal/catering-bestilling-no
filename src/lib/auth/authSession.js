export const AUTH_SESSION_STORAGE_KEY = "auth-session";

function sanitizeUserName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
}

export function normalizeAuthenticatedUser(user) {
  if (!user) {
    return null;
  }

  const email = `${user.email ?? ""}`.trim().toLowerCase();
  const fullName = sanitizeUserName(user);

  return {
    ...user,
    email,
    name: fullName || email || "User",
  };
}

export function readStoredSession() {
  if (typeof window === "undefined") {
    return { accessToken: null, user: null };
  }

  try {
    const savedSession = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);

    if (!savedSession) {
      return { accessToken: null, user: null };
    }

    const parsedSession = JSON.parse(savedSession);
    return {
      accessToken: `${parsedSession?.accessToken ?? ""}`.trim() || null,
      user: normalizeAuthenticatedUser(parsedSession?.user),
    };
  } catch {
    return { accessToken: null, user: null };
  }
}

export function writeStoredSession({ accessToken, user }) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedUser = normalizeAuthenticatedUser(user);
  const normalizedToken = `${accessToken ?? ""}`.trim();

  if (!normalizedToken || !normalizedUser) {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify({
      accessToken: normalizedToken,
      user: normalizedUser,
    }),
  );
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function getStoredAccessToken() {
  return readStoredSession().accessToken;
}
