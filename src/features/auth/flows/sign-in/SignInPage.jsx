import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { loginUser } from "../../api";
import { fetchSettingsProfile } from "../../../vendorDashboard/settings/api";
import { fetchClientSettingsProfile } from "../../../clientSettings/api/clientSettingsService";
import { fetchCheckoutAutofillProfile } from "../../../checkOut/api";
import {
  AuthButton,
  AuthCard,
  AuthInput,
  AuthPageFooter,
} from "../../components";
import { AUTH_ROLE } from "../../constants/authForms";
import { useAuth } from "../../hooks/useAuth";

const VENDOR_REGISTER_URL =
  "https://catering-bestilling-no-vendor-panel.vercel.app/";
const VENDOR_DASHBOARD_ONBOARDING_NOTICE_KEY =
  "vendor-dashboard-onboarding-guide-pending";

function resolvePostSignInDestination(state) {
  const from = state?.from;

  if (from?.pathname) {
    return {
      pathname: from.pathname,
      search: from.search ?? "",
      hash: from.hash ?? "",
    };
  }

  return "/";
}

function shouldCheckVendorDashboardOnboarding(user, state) {
  const fromPath = `${state?.from?.pathname ?? ""}`.trim();
  const hasVendorRouteIntent = fromPath.startsWith("/vendor-dashboard");
  const hasVendorStatus = Boolean(
    `${user?.vendorStatus ?? user?.applicationStatus ?? ""}`.trim(),
  );
  const hasOnboardingFlag =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(VENDOR_DASHBOARD_ONBOARDING_NOTICE_KEY) ===
      "true";

  return hasVendorRouteIntent || hasVendorStatus || hasOnboardingFlag;
}

function isVendorProfileComplete(profile) {
  return Number(profile?.profileCompletionPercent ?? 0) >= 100;
}

async function resolveVendorDashboardDestination(user, state) {
  if (!shouldCheckVendorDashboardOnboarding(user, state)) {
    return null;
  }

  try {
    const profile = await fetchSettingsProfile();

    if (
      typeof window !== "undefined" &&
      isVendorProfileComplete(profile)
    ) {
      window.sessionStorage.removeItem(VENDOR_DASHBOARD_ONBOARDING_NOTICE_KEY);
    }

    return isVendorProfileComplete(profile)
      ? "/vendor-dashboard"
      : "/vendor-dashboard/settings";
  } catch {
    const fromPath = `${state?.from?.pathname ?? ""}`.trim();
    return fromPath.startsWith("/vendor-dashboard")
      ? "/vendor-dashboard/settings"
      : null;
  }
}

function isClientProfileComplete(settings, checkoutProfile) {
  const hasProfilePhoto = Boolean(
    `${settings?.avatarUrl ?? settings?.avatarThumbnailUrl ?? ""}`.trim(),
  );
  const hasDeliveryAddress = checkoutProfile?.deliveryAddresses?.length > 0;
  const hasInvoiceAddress = checkoutProfile?.invoiceAddresses?.length > 0;

  return (
    Number(settings?.profileCompletionPercent ?? 0) >= 100 &&
    hasProfilePhoto &&
    hasDeliveryAddress &&
    hasInvoiceAddress
  );
}

async function resolveCustomerDestination(state) {
  if (state?.from?.pathname) {
    return resolvePostSignInDestination(state);
  }

  try {
    const [settings, checkoutProfile] = await Promise.all([
      fetchClientSettingsProfile(),
      fetchCheckoutAutofillProfile(),
    ]);

    return isClientProfileComplete(settings, checkoutProfile) ? "/" : "/settings";
  } catch {
    // Keep incomplete or unverifiable profiles on Settings rather than skipping onboarding.
    return "/settings";
  }
}

export default function SignInPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail ?? "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await loginUser({
        ...formData,
        role: AUTH_ROLE,
      });

      setAuthSession({
        accessToken: result.access,
        user: result.user,
      });

      await showSuccessToast(
        t("auth.signIn.success", {
          name: result.user.firstName || result.user.email,
        }),
      );

      const vendorDashboardDestination = await resolveVendorDashboardDestination(
        result.user,
        location.state,
      );
      const customerDestination = vendorDashboardDestination
        ? null
        : await resolveCustomerDestination(location.state);

      navigate(
        vendorDashboardDestination || customerDestination,
        {
          replace: true,
        },
      );
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error ? error.message : t("auth.signIn.errorMessage"),
        t("auth.signIn.errorTitle"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      badge={t("auth.signIn.badge")}
      title={t("auth.signIn.title")}
      subtitle={t("auth.signIn.subtitle")}
      backTo="/"
      footer={
        <AuthPageFooter
          prompt={t("auth.signIn.footerPrompt")}
          actionLabel={t("auth.signIn.footerAction")}
          actionTo="/signup"
          actionState={location.state}
          secondaryHref={VENDOR_REGISTER_URL}
        />
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          autoComplete="email"
          label={t("auth.common.email")}
          name="email"
          type="email"
          placeholder={t("auth.common.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <AuthInput
          autoComplete="current-password"
          label={t("auth.common.password")}
          name="password"
          type="password"
          placeholder={t("auth.common.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#8a7f76]">{t("auth.signIn.helper")}</p>
          <Link
            to="/forgot-password"
            className="text-[14px] font-semibold text-[#c85f33]"
          >
            {t("auth.signIn.forgotPassword")}
          </Link>
        </div>
        <AuthButton
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2"
        >
          {isSubmitting ? t("auth.signIn.submitting") : t("auth.signIn.submit")}
          <FiArrowRight className="text-[16px]" />
        </AuthButton>
      </form>
    </AuthCard>
  );
}
