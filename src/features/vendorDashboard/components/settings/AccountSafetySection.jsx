import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../auth";
import {
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../../utils/alerts";
import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
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
        {isLoading ? "Please wait..." : buttonLabel}
      </button>
    </div>
  );
}

export default function AccountSafetySection({ email = "" }) {
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
        "Please enter your password to deactivate your account.",
        "Password required",
      );
      return;
    }

    const confirmation = await Swal.fire({
      title: "Deactivate account?",
      text: "You will be signed out and can reactivate later by signing in again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deactivate account",
      cancelButtonText: "Keep account active",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#d7cec6",
      background: "#fffaf6",
      color: "#201b17",
      reverseButtons: true,
    });

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
          : "Unable to deactivate your account right now.",
        "Deactivation failed",
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
        "Please enter your password before permanently deleting your account.",
        "Password required",
      );
      return;
    }

    if (confirmationText !== "DELETE") {
      await showAuthErrorAlert(
        'Type DELETE exactly to confirm permanent account deletion.',
        "Confirmation required",
      );
      return;
    }

    const confirmation = await Swal.fire({
      title: "Delete account permanently?",
      html: `
        <div style="text-align:left;line-height:1.6;color:#5c4c43">
          <p style="margin:0 0 10px 0">This action permanently anonymizes your customer account and removes saved account data.</p>
          <p style="margin:0;font-weight:700;color:#b64d43">This cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete permanently",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#c94d43",
      cancelButtonColor: "#d7cec6",
      background: "#fffaf6",
      color: "#201b17",
      reverseButtons: true,
    });

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
          : "Unable to delete your account right now.",
        "Deletion failed",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <SettingsSection
      id="account-safety"
      title="Account Access & Privacy"
      subtitle="Manage temporary deactivation or permanently remove your customer account when needed."
    >
      <div className="rounded-[28px] border border-[#f0dfd1] bg-[linear-gradient(180deg,#fffdfb_0%,#fff6ef_100%)] p-6 shadow-[0_18px_48px_rgba(30,20,12,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#f1e4d8] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-[#f0d1bf] bg-[#fff1e7] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#cf6e38]">
              Account controls
            </span>
            {email ? <DetailPill>{email}</DetailPill> : null}
          </div>
          <h3 className="text-[28px] font-black tracking-[-0.03em] text-[#1d1713]">
            Take a break or permanently remove your profile
          </h3>
          <p className="max-w-[760px] text-[15px] leading-7 text-[#6c5d52]">
            Deactivation signs you out and temporarily disables access. Permanent deletion is reserved for privacy or account closure and cannot be reversed.
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <ActionCard
            title="Temporarily deactivate"
            description="Use this when you want to pause your account without permanently removing your data."
            accentClassName="border-[#f0d8c6]"
            buttonClassName="bg-[#cf6e38]"
            buttonLabel="Deactivate account"
            isLoading={isDeactivating}
            onSubmit={handleDeactivate}
          >
            <DetailPill>Your profile becomes inactive</DetailPill>
            <DetailPill>You will be signed out instantly</DetailPill>
            <DetailPill>You can return by signing in later</DetailPill>

            <div className="mt-4 w-full space-y-4">
              <SettingsField
                id="deactivate-password"
                label="Current password"
                type="password"
                value={deactivatePassword}
                onChange={(event) => setDeactivatePassword(event.target.value)}
                placeholder="Enter your password"
              />
              <label className="block">
                <span className="type-para mb-2 block text-[#8b837b]">
                  Reason (optional)
                </span>
                <textarea
                  value={deactivateReason}
                  onChange={(event) => setDeactivateReason(event.target.value)}
                  placeholder="Tell us why you are stepping away"
                  rows={4}
                  className="type-para w-full rounded-[14px] border border-[#d9d1c8] bg-white px-4 py-3 text-[#1f1f1f] outline-none placeholder:text-[#b4aca4]"
                />
              </label>
            </div>
          </ActionCard>

          <ActionCard
            title="Delete permanently"
            description="Permanently remove your customer account and anonymize associated data."
            accentClassName="border-[#f1c7c2] bg-[linear-gradient(180deg,#fffdfb_0%,#fff5f4_100%)]"
            buttonClassName="bg-[#c94d43]"
            buttonLabel="Delete account forever"
            isLoading={isDeleting}
            onSubmit={handleDelete}
          >
            <DetailPill tone="danger">Saved data will be removed</DetailPill>
            <DetailPill tone="danger">Support history will be anonymized</DetailPill>
            <DetailPill tone="danger">This action cannot be undone</DetailPill>

            <div className="mt-4 w-full space-y-4">
              <SettingsField
                id="delete-password"
                label="Current password"
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                placeholder="Enter your password"
              />
              <SettingsField
                id="delete-confirmation"
                label='Type "DELETE" to confirm'
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value.toUpperCase())}
                placeholder="DELETE"
              />
              <label className="block">
                <span className="type-para mb-2 block text-[#8b837b]">
                  Reason (optional)
                </span>
                <textarea
                  value={deleteReason}
                  onChange={(event) => setDeleteReason(event.target.value)}
                  placeholder="Optionally share why you are leaving"
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
