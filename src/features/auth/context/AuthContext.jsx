import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";

const AUTH_STORAGE_KEY = "auth-session";

function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedSession = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);

    if (session) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isLoggedIn: Boolean(session?.accessToken && session?.user),
      setAuthSession: ({ accessToken, user }) => {
        const normalizedUser = {
          ...user,
          name:
            [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.email ||
            "User",
        };

        setSession({
          accessToken,
          user: normalizedUser,
        });
      },
      signOut: () => {
        clearStoredSession();
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
