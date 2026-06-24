import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import CheckoutLayout from "../layouts/CheckoutLayout";
import RouteScrollManager from "./RouteScrollManager";
import {
  AuthLayout,
} from "../../features/auth";
import VendorDashboardLayout from "../../features/vendorDashboard/layouts/VendorDashboardLayout";
import { BrowseFiltersProvider } from "../context/BrowseFiltersContext";

const SignUpPage = lazy(() =>
  import("../../features/auth").then((module) => ({
    default: module.SignUpPage,
  })),
);
const SignInPage = lazy(() =>
  import("../../features/auth").then((module) => ({
    default: module.SignInPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("../../features/auth").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const ForgotPasswordOtpPage = lazy(() =>
  import("../../features/auth").then((module) => ({
    default: module.ForgotPasswordOtpPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("../../features/auth").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const HomePage = lazy(() =>
  import("../../features/home").then((module) => ({
    default: module.HomePage,
  })),
);
const ProductListingPage = lazy(() =>
  import("../../features/home").then((module) => ({
    default: module.ProductListingPage,
  })),
);
const VendorListingPage = lazy(() =>
  import("../../features/home").then((module) => ({
    default: module.VendorListingPage,
  })),
);
const BrowseFoodTypePage = lazy(() =>
  import("../../features/browse/pages/BrowseFoodTypePage"),
);
const BrowseOccasionPage = lazy(() =>
  import("../../features/browse/pages/BrowseOccasionPage"),
);
const ContactPage = lazy(() => import("../../features/contact/pages/ContactPage"));
const OrderConfirmedPage = lazy(() =>
  import("../../features/order").then((module) => ({
    default: module.OrderConfirmedPage,
  })),
);
const MenuDetailsPage = lazy(() =>
  import("../../features/menu").then((module) => ({
    default: module.MenuDetailsPage,
  })),
);
const VendorProfilePage = lazy(() =>
  import("../../features/vendor").then((module) => ({
    default: module.VendorProfilePage,
  })),
);
const VendorReviewsPage = lazy(() =>
  import("../../features/vendor").then((module) => ({
    default: module.VendorReviewsPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("../../features/checkOut").then((module) => ({
    default: module.CheckoutPage,
  })),
);
const VendorDashboardHomePage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorDashboardHomePage"),
);
const VendorOrdersPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorOrdersPage"),
);
const VendorRestaurantsPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorRestaurantsPage"),
);
const VendorInvoicesPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorInvoicesPage"),
);
const VendorInvoiceDetailsPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorInvoiceDetailsPage"),
);
const VendorNotificationsPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorNotificationsPage"),
);
const VendorSupportPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorSupportPage"),
);
const VendorAddressPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorAddressPage"),
);
const VendorSettingsPage = lazy(() =>
  import("../../features/vendorDashboard/pages/VendorSettingsPage"),
);

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowseFiltersProvider>
      <RouteScrollManager />

      <Suspense fallback={<RouteLoader />}>
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
              path="/vendor/:vendorSlug/reviews"
              element={<VendorReviewsPage />}
            />
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
            <Route path="invoices/:invoiceId" element={<VendorInvoiceDetailsPage />} />
            <Route path="notifications" element={<VendorNotificationsPage />} />
            <Route path="support" element={<VendorSupportPage />} />
            {/* Rewards screen disabled */}
            <Route
              path="rewards"
              element={<Navigate to="/vendor-dashboard" replace />}
            />
            <Route path="address" element={<VendorAddressPage />} />
            <Route path="settings" element={<VendorSettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowseFiltersProvider>
  );
}
