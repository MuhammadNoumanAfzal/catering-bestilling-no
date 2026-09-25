import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiCamera, FiTrash2, FiUploadCloud } from "react-icons/fi";
import SettingsSection from "../../vendorDashboard/components/settings/SettingsSection";

function getInitials(formState) {
  const source =
    formState.fullName ||
    [formState.firstName, formState.lastName].filter(Boolean).join(" ") ||
    formState.email ||
    "User";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item.charAt(0).toUpperCase())
    .join("");
}

export default function ClientProfilePhotoSection({
  formState,
  isUploading,
  onRemoveAvatar,
  onUploadAvatar,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const displayAvatar = formState.avatarThumbnailUrl || formState.avatarUrl || "";
  const completionValue = Math.max(
    0,
    Math.min(100, Number(formState.profileCompletionPercent || 0)),
  );
  const canRemoveAvatar = Boolean(displayAvatar) && !isUploading;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (file) {
      await onUploadAvatar(file);
    }

    event.target.value = "";
  };

  return (
    <SettingsSection
      id="profile-photo"
      title={t("settings.profilePhotoTitle")}
    >
      <div className="overflow-hidden rounded-[26px] border border-[#ecdcd0] bg-[linear-gradient(135deg,#fff8f3_0%,#fffdfb_50%,#fff3e7_100%)] shadow-[0_16px_38px_rgba(69,41,18,0.06)]">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-white/70 bg-[#f3dfd1] text-[30px] font-semibold text-[#9e5a34] shadow-[0_14px_34px_rgba(207,110,56,0.18)]">
                {displayAvatar ? (
                  <img
                    alt={t("settings.profilePhotoAlt")}
                    className="h-full w-full object-cover"
                    src={displayAvatar}
                  />
                ) : (
                  getInitials(formState)
                )}
              </div>
              <button
                className="absolute -bottom-2 -right-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-[#cf6e38] text-white shadow-[0_14px_28px_rgba(207,110,56,0.26)] transition hover:bg-[#bb5e2c] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <FiCamera size={18} />
              </button>
            </div>

            <input
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />

            <div className="w-full max-w-[220px] rounded-[20px] border border-[#eddccd] bg-white/90 p-3 text-left">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b07a5d]">
                  {t("settings.profileCompletion")}
                </p>
                <p className="text-[14px] font-semibold text-[#1c1713]">
                  {completionValue}%
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#f3e5da]">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#cf6e38_0%,#f2b178_100%)] transition-[width]"
                  style={{ width: `${completionValue}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <span className="w-fit rounded-full bg-[#fff1e7] px-3 py-1 text-[12px] font-medium text-[#9f5b36]">
              {t("settings.profilePhotoFormats")}
            </span>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#cf6e38] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#bc612f] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <FiUploadCloud size={16} />
                {isUploading
                  ? t("settings.profilePhotoUploading")
                  : t("settings.profilePhotoUpload")}
              </button>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-[#ead6c7] bg-white px-5 py-3 text-[14px] font-semibold text-[#6f4f3c] transition hover:bg-[#fff7f2] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canRemoveAvatar}
                onClick={onRemoveAvatar}
                type="button"
              >
                <FiTrash2 size={16} />
                {t("settings.profilePhotoRemove")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
