import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import CheckoutLayout from "../layouts/CheckoutLayout";
import HomePage from "../../features/home/pages/HomePage";
import ProductListingPage from "../../features/home/pages/ProductListingPage";
import VendorListingPage from "../../features/home/pages/VendorListingPage";
import BrowseFoodTypePage from "../../features/browse/pages/BrowseFoodTypePage";
import BrowseOccasionPage from "../../features/browse/pages/BrowseOccasionPage";
import ContactPage from "../../features/contact/pages/ContactPage";
import OrderConfirmedPage from "../../features/order/pages/OrderConfirmedPage";
import MenuDetailsPage from "../../features/menu/pages/MenuDetailsPage";
import VendorProfilePage from "../../features/vendor/pages/VendorProfilePage";
import AuthLayout from "../../features/auth/components/AuthLayout";
import SignUpPage from "../../features/auth/pages/SignUpPage";
import SignInPage from "../../features/auth/pages/SignInPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import ForgotPasswordOtpPage from "../../features/auth/pages/ForgotPasswordOtpPage";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage";
import CheckoutPage from "../../features/checkOut/pages/CheckoutPage";
import VendorDashboardLayout from "../../features/vendorDashboard/layouts/VendorDashboardLayout";
import VendorDashboardHomePage from "../../features/vendorDashboard/pages/VendorDashboardHomePage";
import VendorPlaceholderPage from "../../features/vendorDashboard/pages/VendorPlaceholderPage";
import VendorInvoicesPage from "../../features/vendorDashboard/pages/VendorInvoicesPage";
import VendorAddressPage from "../../features/vendorDashboard/pages/VendorAddressPage";
import VendorOrdersPage from "../../features/vendorDashboard/pages/VendorOrdersPage";
import VendorRestaurantsPage from "../../features/vendorDashboard/pages/VendorRestaurantsPage";
import VendorRewardsPage from "../../features/vendorDashboard/pages/VendorRewardsPage";
import VendorSettingsPage from "../../features/vendorDashboard/pages/VendorSettingsPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Authentication routes */}
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

      {/* Main customer-facing routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:productType" element={<ProductListingPage />} />
        <Route path="/vendors/:vendorType" element={<VendorListingPage />} />
        <Route path="/browse/food-type" element={<BrowseFoodTypePage />} />
        <Route path="/browse/occasion" element={<BrowseOccasionPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/vendor/:vendorSlug" element={<VendorProfilePage />} />
        <Route
          path="/vendor/:vendorSlug/menu/:itemId"
          element={<MenuDetailsPage />}
        />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Checkout flow routes */}
      <Route element={<CheckoutLayout />}>
        <Route
          path="/checkout"
          element={<Navigate to="/checkout/corporate" replace />}
        />
        <Route path="/checkout/:checkoutType" element={<CheckoutPage />} />
      </Route>

      {/* Vendor dashboard routes */}
      <Route path="/vendor-dashboard" element={<VendorDashboardLayout />}>
        <Route index element={<VendorDashboardHomePage />} />
        <Route path="orders" element={<VendorOrdersPage />} />
        <Route path="restaurants" element={<VendorRestaurantsPage />} />
        <Route path="invoices" element={<VendorInvoicesPage />} />
        <Route path="rewards" element={<VendorRewardsPage />} />
        <Route path="address" element={<VendorAddressPage />} />
        <Route path="settings" element={<VendorSettingsPage />} />
      </Route>
    </Routes>
  );
}
