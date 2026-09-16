import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, X } from "lucide-react";
import { translateSettings } from "../components/settings/settingsI18n";
import ClientLanguageSettingsSection from "../../clientSettings/components/ClientLanguageSettingsSection";
import NotificationSettingsSection from "../components/settings/NotificationSettingsSection";
import PasswordSettingsSection from "../components/settings/PasswordSettingsSection";
import ProfileSettingsSection from "../components/settings/ProfileSettingsSection";
import SettingsActions from "../components/settings/SettingsActions";
import VendorProfilePhotoSection from "../components/settings/VendorProfilePhotoSection";
import DashboardLoadingState from "../components/DashboardLoadingState";
import { useVendorSettingsPage } from "../settings/hooks/useVendorSettingsPage";
import { fetchAddressBook } from "../address/api";

const VENDOR_ONBOARDING_NOTICE_KEY = "vendor-dashboard-onboarding-guide-pending";

function hasSavedAddress(addresses) {
  return (addresses || []).some((address) =>
    `${address?.addressLine1 ?? ""}`.trim(),
  );
}

function hasCompletedVendorSetup(formState, addressBook) {
  const hasProfilePhoto = Boolean(
    `${formState?.avatarThumbnailUrl ?? formState?.avatarUrl ?? ""}`.trim(),
  );

  return (
    hasProfilePhoto &&
    hasSavedAddress(addressBook?.delivery) &&
    hasSavedAddress(addressBook?.invoice)
  );
}

export default function VendorSettingsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSettings(t, i18n, key, options);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);
  const {
    formState,
    handleReset,
    handleRemoveAvatar,
    handleSave,
    handleUploadAvatar,
    isDirty,
    isLoading,
    isSaving,
    isUploadingAvatar,
    loadWarning,
    startPasswordChange,
    updateField,
  } = useVendorSettingsPage();

  useEffect(() => {
    let isMounted = true;

    async function resolveOnboardingGuide() {
      if (
        typeof window === "undefined" ||
        window.sessionStorage.getItem(VENDOR_ONBOARDING_NOTICE_KEY) !== "true"
      ) {
        if (isMounted) {
          setShowOnboardingGuide(false);
        }
        return;
      }

      try {
        const addressBook = await fetchAddressBook();

        if (!isMounted) {
          return;
        }

        if (hasCompletedVendorSetup(formState, addressBook)) {
          window.sessionStorage.removeItem(VENDOR_ONBOARDING_NOTICE_KEY);
          setShowOnboardingGuide(false);
          return;
        }
      } catch {
        // Keep the setup reminder visible when the completion state cannot be checked.
      }

      if (isMounted) {
        setShowOnboardingGuide(true);
      }
    }

    if (!isLoading) {
      resolveOnboardingGuide();
    }

    return () => {
      isMounted = false;
    };
  }, [formState.avatarThumbnailUrl, formState.avatarUrl, isLoading]);

  function handleDismissOnboardingGuide() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(VENDOR_ONBOARDING_NOTICE_KEY);
    }

    setShowOnboardingGuide(false);
  }

  if (isLoading) {
    return <DashboardLoadingState title="Loading settings" description="Retrieving your profile, notification, and account preferences." rows={4} columns={2} />;
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">{st("title")}</h1>
      </section>

      {showOnboardingGuide ? (
        <section className="overflow-hidden rounded-[24px] border border-[#ecd8ca] bg-[linear-gradient(135deg,#fff7f1_0%,#fffdfb_100%)] px-5 py-5 shadow-[0_14px_34px_rgba(56,34,18,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#cf6e38] text-white shadow-[0_12px_24px_rgba(207,110,56,0.22)]">
                <Sparkles size={18} />
              </span>
              <div className="max-w-[760px]">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#b96537]">
                  {st("onboardingBadge")}
                </p>
                <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#1e1712]">
                  {st("onboardingTitle")}
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6d5f56]">
                  {st("onboardingDescription")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#edd7c8] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#614f43]">
                    <Sparkles size={13} />
                    {st("onboardingPhotoStep")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#edd7c8] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#614f43]">
                    <MapPin size={13} />
                    {st("onboardingAddressStep")}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[14px] bg-[#cf6e38] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#bb602d]"
                    onClick={() => navigate("/vendor-dashboard/address")}
                    type="button"
                  >
                    {st("onboardingAddressAction")}
                    <ArrowRight size={15} />
                  </button>
                  <button
                    className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] border border-[#ead9cc] bg-white px-4 py-2.5 text-[13px] font-bold text-[#6f5f54] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
                    onClick={handleDismissOnboardingGuide}
                    type="button"
                  >
                    {st("onboardingLaterAction")}
                  </button>
                </div>
              </div>
            </div>

            <button
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ead9cc] bg-white text-[#8c776a] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
              onClick={handleDismissOnboardingGuide}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </section>
      ) : null}

      <div className="space-y-6">
        {loadWarning ? (
          <div className="rounded-[18px] border border-[#f1cfb7] bg-[#fff7f1] px-4 py-3 text-sm text-[#8a5335]">
            {loadWarning}
          </div>
        ) : null}
        <ClientLanguageSettingsSection />
        <VendorProfilePhotoSection
          formState={formState}
          isUploading={isUploadingAvatar}
          onRemoveAvatar={handleRemoveAvatar}
          onUploadAvatar={handleUploadAvatar}
        />
        <ProfileSettingsSection formState={formState} updateField={updateField} />
        <NotificationSettingsSection
          formState={formState}
          updateField={updateField}
        />
        <PasswordSettingsSection
          formState={formState}
          onPasswordFocus={startPasswordChange}
          updateField={updateField}
        />
        <SettingsActions
          isDirty={isDirty}
          isSaving={isSaving}
          onReset={handleReset}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
