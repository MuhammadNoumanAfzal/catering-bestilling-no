import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, X } from "lucide-react";
import { translateSettings } from "../components/settings/settingsI18n";
import NotificationSettingsSection from "../components/settings/NotificationSettingsSection";
import PasswordSettingsSection from "../components/settings/PasswordSettingsSection";
import ProfileSettingsSection from "../components/settings/ProfileSettingsSection";
import SettingsActions from "../components/settings/SettingsActions";
import VendorProfilePhotoSection from "../components/settings/VendorProfilePhotoSection";
import { useVendorSettingsPage } from "../settings/hooks/useVendorSettingsPage";

const VENDOR_ONBOARDING_NOTICE_KEY = "vendor-dashboard-onboarding-guide-pending";

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
    updateField,
  } = useVendorSettingsPage();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(VENDOR_ONBOARDING_NOTICE_KEY) === "true") {
      setShowOnboardingGuide(true);
    }
  }, []);

  function handleDismissOnboardingGuide() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(VENDOR_ONBOARDING_NOTICE_KEY);
    }

    setShowOnboardingGuide(false);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
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
                  New Vendor Setup
                </p>
                <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#1e1712]">
                  Complete your store setup
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6d5f56]">
                  Complete your information on this <span className="font-bold text-[#2a1f19]">Settings</span> page, including your profile photo, business details, and other store information. Then go to the <span className="font-bold text-[#2a1f19]">Addresses</span> page to add your delivery and invoice address details.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#edd7c8] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#614f43]">
                    <Sparkles size={13} />
                    Add photo and store details
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#edd7c8] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#614f43]">
                    <MapPin size={13} />
                    Fill address information
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[14px] bg-[#cf6e38] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#bb602d]"
                    onClick={() => navigate("/vendor-dashboard/address")}
                    type="button"
                  >
                    Go to Addresses
                    <ArrowRight size={15} />
                  </button>
                  <button
                    className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] border border-[#ead9cc] bg-white px-4 py-2.5 text-[13px] font-bold text-[#6f5f54] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
                    onClick={handleDismissOnboardingGuide}
                    type="button"
                  >
                    I will do this later
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
