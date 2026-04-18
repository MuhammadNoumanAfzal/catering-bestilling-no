import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../../features/auth/components/AuthLayout";
import SignUpPage from "../../features/auth/pages/SignUpPage";
import SignInPage from "../../features/auth/pages/SignInPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import ForgotPasswordOtpPage from "../../features/auth/pages/ForgotPasswordOtpPage";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/forgot-password/verify"
          element={<ForgotPasswordOtpPage />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
}
