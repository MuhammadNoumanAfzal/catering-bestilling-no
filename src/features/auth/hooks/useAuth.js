import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api";
import {
  setAuthSession as setSessionAction,
  signOut as signOutAction,
} from "../store/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(accessToken && user);

  const setAuthSession = ({ accessToken, user }) => {
    dispatch(setSessionAction({ accessToken, user }));
  };

  const signOut = async () => {
    let result = {
      success: true,
      message: "Logged out successfully.",
    };

    try {
      const response = await logoutUser();
      result = {
        success: true,
        message: response?.message || result.message,
      };
    } catch (error) {
      result = {
        success: false,
        message:
          error?.message ||
          "Unable to reach the server. Local session has been cleared.",
      };
    } finally {
      dispatch(signOutAction());
    }

    return result;
  };

  return {
    user,
    accessToken,
    isLoggedIn,
    setAuthSession,
    signOut,
  };
}
