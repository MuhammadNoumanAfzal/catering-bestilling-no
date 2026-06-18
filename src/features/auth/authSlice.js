import { createSlice } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "auth-session";

const readStoredSession = () => {
  if (typeof window === "undefined") {
    return { accessToken: null, user: null };
  }
  try {
    const savedSession = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      return {
        accessToken: parsed.accessToken ?? null,
        user: parsed.user ?? null,
      };
    }
  } catch {
    // Ignore error and fall back
  }
  return { accessToken: null, user: null };
};

const initialState = readStoredSession();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession(state, action) {
      const { accessToken, user } = action.payload;
      const normalizedUser = user
        ? {
            ...user,
            name:
              [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
              user?.email ||
              "User",
          }
        : null;

      state.accessToken = accessToken;
      state.user = normalizedUser;

      if (typeof window !== "undefined") {
        if (accessToken && normalizedUser) {
          window.sessionStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ accessToken, user: normalizedUser })
          );
        } else {
          window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    },
    signOut(state) {
      state.accessToken = null;
      state.user = null;
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
  },
});

export const { setAuthSession, signOut } = authSlice.actions;
export default authSlice.reducer;
