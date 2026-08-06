import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../auth";
import {
  showAuthErrorAlert,
  showSuccessToast,
  withBaseOptions,
} from "../../../../utils/alerts";
import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import { translateSettings } from "./settingsI18n";
import {
  deactivateCustomerAccount,
  deleteCustomerAccount,
} from "../../settings/api/accountSafetyService";

function DetailPill({ children, tone = "neutral" }) {
  const toneClasses =
    tone === "danger"
      ? "border-[#f3c7c2] bg-[#fff3f1] text-[#b64d43]"
      : "border-[#efddcf] bg-[#fff8f2] text-[#8a6851]";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${toneClasses}`}
    >
      {children}
    </span>
  );
}

function ActionCard({
  accentClassName,
  buttonClassName,
  buttonLabel,
  children,
  description,
  isLoading = false,
  onSubmit,
  loadingLabel,
  title,
}) {
  return (
    <div
      className={`rounded-[24px] border bg-white p-5 shadow-[0_16px_40px_rgba(35,24,18,0.06)] ${accentClassName}`}
    >
      <div className="space-y-2">
        <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1f1915]">
          {title}
        </h3>
        <p className="text-[14px] leading-6 text-[#6c5d52]">{description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">{children}</div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className={`mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[14px] px-4 text-[14px] font-bold text-white transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-70 ${buttonClassName}`}
      >
        {isLoading ? loadingLabel : buttonLabel}
      </button>
    </div>
  );
}

export default function AccountSafetySection({ email = "" }) {
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSettings(t, i18n, key, options);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function exitAccount(message) {
    await showSuccessToast(message);
    await signOut();
    navigate("/signin", { replace: true });
  }

  async function handleDeactivate() {
    const password = `${deactivatePassword ?? ""}`.trim();
    const reason = `${deactivateReason ?? ""}`.trim();

    if (!password) {
      await showAuthErrorAlert(
        st("passwordRequiredMessage"),
        st("passwordRequiredTitle"),
      );
      return;
    }

    const confirmation = await Swal.fire(
      withBaseOptions({
        title: t("alerts.deactivateTitle"),
        text: t("alerts.deactivateText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("alerts.deactivateConfirm"),
        cancelButtonText: t("alerts.keepAccountActive"),
        cancelButtonColor: "#d7cec6",
      }),
    );

    if (!confirmation.isConfirmed) {
      return;
    }

    setIsDeactivating(true);

    try {
      const result = await deactivateCustomerAccount({
        password,
        reason,
      });

      setDeactivatePassword("");
      setDeactivateReason("");
      await exitAccount(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : st("deactivateFailedMessage"),
        st("deactivateFailedTitle"),
      );
    } finally {
      setIsDeactivating(false);
    }
  }

  async function handleDelete() {
    const password = `${deletePassword ?? ""}`.trim();
    const reason = `${deleteReason ?? ""}`.trim();
    const confirmationText = `${deleteConfirmation ?? ""}`.trim();

    if (!password) {
      await showAuthErrorAlert(
        st("deletePasswordRequiredMessage"),
        st("passwordRequiredTitle"),
      );
      return;
    }

    if (confirmationText !== "DELETE") {
      await showAuthErrorAlert(
        st("deleteConfirmationMessage"),
        st("confirmationRequiredTitle"),
      );
      return;
    }

    const confirmation = await Swal.fire(
      withBaseOptions({
        title: t("alerts.deleteTitle"),
        html: `
          <div style="text-align:left;line-height:1.6;color:#5c4c43">
            <p style="margin:0 0 10px 0">${t("alerts.deleteIntro")}</p>
            <p style="margin:0;font-weight:700;color:#b64d43">${t("alerts.deleteWarning")}</p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("alerts.deleteConfirm"),
        cancelButtonText: t("alerts.cancel"),
        confirmButtonColor: "#c94d43",
        cancelButtonColor: "#d7cec6",
      }),
    );

    if (!confirmation.isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteCustomerAccount({
        password,
        confirmationText,
        reason,
      });

      setDeletePassword("");
      setDeleteReason("");
      setDeleteConfirmation("");
      await exitAccount(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : st("deleteFailedMessage"),
        st("deleteFailedTitle"),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <SettingsSection
      id="account-safety"
      title={st("accountSafetyTitle")}
      subtitle={st("accountSafetySubtitle")}
    >
      <div className="rounded-[28px] border border-[#f0dfd1] bg-[linear-gradient(180deg,#fffdfb_0%,#fff6ef_100%)] p-6 shadow-[0_18px_48px_rgba(30,20,12,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#f1e4d8] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-[#f0d1bf] bg-[#fff1e7] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#cf6e38]">
              {st("accountControls")}
            </span>
            {email ? <DetailPill>{email}</DetailPill> : null}
          </div>
          <h3 className="text-[28px] font-black tracking-[-0.03em] text-[#1d1713]">
            {st("safetyHeroTitle")}
          </h3>
          <p className="max-w-[760px] text-[15px] leading-7 text-[#6c5d52]">
            {st("safetyHeroDescription")}
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <ActionCard
            title={st("temporarilyDeactivate")}
            description={st("deactivateDescription")}
            accentClassName="border-[#f0d8c6]"
            buttonClassName="bg-[#cf6e38]"
            buttonLabel={st("deactivateAccount")}
            loadingLabel={st("pleaseWait")}
            isLoading={isDeactivating}
            onSubmit={handleDeactivate}
          >
            <DetailPill>{st("profileInactive")}</DetailPill>
            <DetailPill>{st("signedOutInstantly")}</DetailPill>
            <DetailPill>{st("returnLater")}</DetailPill>

            <div className="mt-4 w-full space-y-4">
              <SettingsField
                id="deactivate-password"
                label={st("currentPassword")}
                type="password"
                value={deactivatePassword}
                onChange={(event) => setDeactivatePassword(event.target.value)}
                placeholder={st("passwordPlaceholder")}
              />
              <label className="block">
                <span className="type-para mb-2 block text-[#8b837b]">
                  {st("reasonOptional")}
                </span>
                <textarea
                  value={deactivateReason}
                  onChange={(event) => setDeactivateReason(event.target.value)}
                  placeholder={st("steppingAwayPlaceholder")}
                  rows={4}
                  className="type-para w-full rounded-[14px] border border-[#d9d1c8] bg-white px-4 py-3 text-[#1f1f1f] outline-none placeholder:text-[#b4aca4]"
                />
              </label>
            </div>
          </ActionCard>

          <ActionCard
            title={st("deletePermanently")}
            description={st("deleteDescription")}
            accentClassName="border-[#f1c7c2] bg-[linear-gradient(180deg,#fffdfb_0%,#fff5f4_100%)]"
            buttonClassName="bg-[#c94d43]"
            buttonLabel={st("deleteForever")}
            loadingLabel={st("pleaseWait")}
            isLoading={isDeleting}
            onSubmit={handleDelete}
          >
            <DetailPill tone="danger">{st("savedDataRemoved")}</DetailPill>
            <DetailPill tone="danger">{st("supportHistoryAnonymized")}</DetailPill>
            <DetailPill tone="danger">{st("cannotUndo")}</DetailPill>

            <div className="mt-4 w-full space-y-4">
              <SettingsField
                id="delete-password"
                label={st("currentPassword")}
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                placeholder={st("passwordPlaceholder")}
              />
              <SettingsField
                id="delete-confirmation"
                label={st("typeDeleteToConfirm")}
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value.toUpperCase())}
                placeholder={st("deletePlaceholder")}
              />
              <label className="block">
                <span className="type-para mb-2 block text-[#8b837b]">
                  {st("reasonOptional")}
                </span>
                <textarea
                  value={deleteReason}
                  onChange={(event) => setDeleteReason(event.target.value)}
                  placeholder={st("leavingPlaceholder")}
                  rows={4}
                  className="type-para w-full rounded-[14px] border border-[#d9d1c8] bg-white px-4 py-3 text-[#1f1f1f] outline-none placeholder:text-[#b4aca4]"
                />
              </label>
            </div>
          </ActionCard>
        </div>
      </div>
    </SettingsSection>
  );
}
