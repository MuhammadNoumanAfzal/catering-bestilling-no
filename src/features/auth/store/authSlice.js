import { createSlice } from "@reduxjs/toolkit";
import {
  clearStoredSession,
  normalizeAuthenticatedUser,
  readStoredSession,
  writeStoredSession,
} from "../utils/authSession";

const initialState = readStoredSession();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession(state, action) {
      const { accessToken, user } = action.payload;
      const normalizedUser = normalizeAuthenticatedUser(user);

      state.accessToken = accessToken;
      state.user = normalizedUser;
      writeStoredSession({ accessToken, user: normalizedUser });
    },
    signOut(state) {
      state.accessToken = null;
      state.user = null;
      clearStoredSession();
    },
  },
});

export const { setAuthSession, signOut } = authSlice.actions;
export default authSlice.reducer;
