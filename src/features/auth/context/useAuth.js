import { useDispatch, useSelector } from "react-redux";
import { setAuthSession as setSessionAction, signOut as signOutAction } from "../authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(accessToken && user);

  const setAuthSession = ({ accessToken, user }) => {
    dispatch(setSessionAction({ accessToken, user }));
  };

  const signOut = () => {
    dispatch(signOutAction());
  };

  return {
    user,
    accessToken,
    isLoggedIn,
    setAuthSession,
    signOut,
  };
}

