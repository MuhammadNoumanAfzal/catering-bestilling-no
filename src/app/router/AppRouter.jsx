import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import HomePage from "../../features/home/pages/HomePage";
import ProductListingPage from "../../features/home/pages/ProductListingPage";
import VendorListingPage from "../../features/home/pages/VendorListingPage";
import BrowseFoodTypePage from "../../features/browse/pages/BrowseFoodTypePage";
import BrowseOccasionPage from "../../features/browse/pages/BrowseOccasionPage";
import OrderConfirmedPage from "../../features/order/pages/OrderConfirmedPage";
import MenuDetailsPage from "../../features/menu/pages/MenuDetailsPage";
import VendorProfilePage from "../../features/vendor/pages/VendorProfilePage";
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
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:productType" element={<ProductListingPage />} />
        <Route path="/vendors/:vendorType" element={<VendorListingPage />} />
        <Route path="/browse/food-type" element={<BrowseFoodTypePage />} />
        <Route path="/browse/occasion" element={<BrowseOccasionPage />} />
        <Route path="/vendor/:vendorSlug" element={<VendorProfilePage />} />
        <Route
          path="/vendor/:vendorSlug/menu/:itemId"
          element={<MenuDetailsPage />}
        />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
