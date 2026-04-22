import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "demo-auth-user";

export const DEMO_USER = {
  email: "demo@lunsjavtale.no",
  password: "Demo@123",
  name: "Nouman",
};

const AuthContext = createContext(null);

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      signIn: (credentials) => {
        const normalizedEmail = credentials.email.trim().toLowerCase();
        const password = credentials.password.trim();

        const isValidUser =
          normalizedEmail === DEMO_USER.email && password === DEMO_USER.password;

        if (!isValidUser) {
          return {
            success: false,
            message: "Use the demo email and password shown on the page.",
          };
        }

        const nextUser = {
          email: DEMO_USER.email,
          name: DEMO_USER.name,
        };

        setUser(nextUser);

        return {
          success: true,
          user: nextUser,
        };
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
