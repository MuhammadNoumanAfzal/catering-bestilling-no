import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { registerUser, sendSignupOtp } from "../../api";
import {
  AuthButton,
  AuthCard,
  AuthInput,
  AuthPageFooter,
} from "../../components";
import {
  AUTH_ROLE,
  SIGN_UP_INITIAL_FORM_STATE,
  SIGNUP_OTP_LENGTH,
} from "../../constants/authForms";

const VENDOR_REGISTER_URL =
  "https://catering-bestilling-no-vendor-panel.vercel.app/";

export default function SignUpPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(SIGN_UP_INITIAL_FORM_STATE);
  const [otpCode, setOtpCode] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));

    if (name === "email" && value.trim().toLowerCase() !== otpSentTo) {
      setOtpCode("");
      setOtpError("");
      setOtpSentTo("");
    }
  };

  const handleOtpChange = (event) => {
    setOtpError("");
    setOtpCode(event.target.value.replace(/\D/g, "").slice(0, SIGNUP_OTP_LENGTH));
  };

  const handleSendOtp = async () => {
    const email = formState.email.trim().toLowerCase();

    if (!email) {
      await showAuthErrorAlert(
        t("auth.signUp.emailRequired", { defaultValue: "Please enter your email address first." }),
        t("auth.signUp.errorTitle"),
      );
      return;
    }

    setIsSendingOtp(true);

    try {
      const result = await sendSignupOtp(email);
      setOtpSentTo(email);
      setOtpError("");
      await showSuccessToast(
        result.message ||
          t("auth.signUp.otpSent", { defaultValue: "Verification code sent to your email." }),
      );
    } catch (error) {
      setOtpSentTo("");
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : t("auth.signUp.sendOtpErrorMessage", {
              defaultValue: "Unable to send the verification code right now.",
            }),
        t("auth.signUp.sendOtpErrorTitle", { defaultValue: "Could not send code" }),
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = formState.email.trim().toLowerCase();

    if (!otpSentTo || otpSentTo !== normalizedEmail) {
      await showAuthErrorAlert(
        t("auth.signUp.otpRequiredFirst", {
          defaultValue: "Please send a verification code to your email before creating the account.",
        }),
        t("auth.signUp.errorTitle"),
      );
      return;
    }

    if (otpCode.length !== SIGNUP_OTP_LENGTH) {
      setOtpError(
        t("auth.signUp.otpLengthError", {
          count: SIGNUP_OTP_LENGTH,
          defaultValue: `Verification code must be ${SIGNUP_OTP_LENGTH} digits.`,
        }),
      );
      return;
    }

    setOtpError("");
    setIsSubmitting(true);

    try {
      const result = await registerUser({
        ...formState,
        role: AUTH_ROLE,
        otp: otpCode,
      });

      await showSuccessToast(
        result.message || t("auth.signUp.success"),
      );
      setFormState(SIGN_UP_INITIAL_FORM_STATE);
      navigate("/signin", {
        replace: true,
        state: {
          ...location.state,
          registeredEmail: result.user.email,
        },
      });
    } catch (error) {
      const fieldOtpError =
        error instanceof Error && Array.isArray(error.fieldErrors?.otp)
          ? error.fieldErrors.otp[0]
          : "";

      if (fieldOtpError) {
        setOtpError(fieldOtpError);
      } else {
        await showAuthErrorAlert(
          error instanceof Error
            ? error.message
            : t("auth.signUp.errorMessage"),
          t("auth.signUp.errorTitle"),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      badge={t("auth.signUp.badge")}
      title={t("auth.signUp.title")}
      subtitle={t("auth.signUp.subtitle")}
      backTo="/"
      footer={
        <AuthPageFooter
          prompt={t("auth.signUp.footerPrompt")}
          actionLabel={t("auth.signUp.footerAction")}
          actionTo="/signin"
          actionState={location.state}
          secondaryHref={VENDOR_REGISTER_URL}
        />
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            label={t("auth.signUp.firstName")}
            name="firstName"
            placeholder={t("auth.signUp.firstNamePlaceholder")}
            value={formState.firstName}
            onChange={handleChange}
            required
          />
          <AuthInput
            label={t("auth.signUp.lastName")}
            name="lastName"
            placeholder={t("auth.signUp.lastNamePlaceholder")}
            value={formState.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            label={t("auth.common.email")}
            name="email"
            type="email"
            placeholder={t("auth.common.emailPlaceholder")}
            value={formState.email}
            onChange={handleChange}
            helperText={
              otpSentTo === formState.email.trim().toLowerCase()
                ? t("auth.signUp.otpSentHelper", {
                    defaultValue: "Verification code sent. Enter the 6-digit code below.",
                  })
                : t("auth.signUp.otpHelper", {
                    defaultValue: "We will send a 6-digit verification code to this email.",
                  })
            }
            required
          />
          <AuthInput
            label={t("auth.common.password")}
            name="password"
            type="password"
            placeholder={t("auth.common.passwordPlaceholder")}
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>

        <AuthInput
          label={t("auth.signUp.phone")}
          name="phone"
          type="tel"
          placeholder={t("auth.signUp.phonePlaceholder")}
          value={formState.phone}
          onChange={handleChange}
          required
        />

        <AuthInput
          label={t("auth.signUp.postCode")}
          name="postCode"
          type="text"
          placeholder={t("auth.signUp.postCodePlaceholder")}
          value={formState.postCode}
          onChange={handleChange}
          required
        />

        <div className="overflow-hidden rounded-[28px] border border-[#ecd8ca] bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ea_100%)] shadow-[0_16px_34px_rgba(200,95,51,0.08)]">
          <div className="border-b border-[#f1dfd2] px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c56b3c]">
                  {t("auth.signUp.verificationBadge", { defaultValue: "Verify Email" })}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-[#7e6c61]">
                  {otpSentTo === formState.email.trim().toLowerCase()
                    ? t("auth.signUp.verificationReady", {
                        defaultValue: "We sent your code. Enter it below to finish creating the account.",
                      })
                    : t("auth.signUp.verificationIntro", {
                        defaultValue: "Send a one-time code to confirm your email before submitting.",
                      })}
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-[#efd8cb] bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9e7b69]">
                {otpSentTo === formState.email.trim().toLowerCase()
                  ? t("auth.signUp.codeSentBadge", { defaultValue: "Code Sent" })
                  : t("auth.signUp.codePendingBadge", { defaultValue: "Step 1 of 2" })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5">
            <AuthInput
              label={t("auth.signUp.otpLabel", { defaultValue: "Email verification code" })}
              name="otp"
              type="text"
              placeholder={t("auth.signUp.otpPlaceholder", { defaultValue: "Enter 6-digit code" })}
              value={otpCode}
              onChange={handleOtpChange}
              errorText={otpError}
              helperText={t("auth.signUp.otpInputHelper", {
                defaultValue: "Enter the code sent to your email. It expires in 10 minutes.",
              })}
              className="bg-white sm:min-w-[260px]"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp || !formState.email.trim()}
              className="inline-flex min-h-13 w-full items-center justify-center rounded-[18px] border border-[#e4a788] bg-white px-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c85f33] transition hover:border-[#c85f33] hover:bg-[#fff1e7] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-end"
            >
              {isSendingOtp
                ? t("auth.signUp.sendingOtp", { defaultValue: "Sending..." })
                : otpSentTo === formState.email.trim().toLowerCase()
                  ? t("auth.signUp.resendOtp", { defaultValue: "Resend code" })
                  : t("auth.signUp.sendOtp", { defaultValue: "Send code" })}
            </button>
          </div>
        </div>

        <AuthButton
          type="submit"
          disabled={isSubmitting || isSendingOtp}
          className="inline-flex items-center justify-center gap-2 pt-4"
        >
          {isSubmitting ? t("auth.signUp.submitting") : t("auth.signUp.submit")}
          <FiArrowRight className="text-[16px]" />
        </AuthButton>

        <p className="px-1 text-[12px] leading-6 text-[#867d75]">
          {t("auth.signUp.agreementPrefix")}{" "}
          <Link
            to="/terms-and-conditions"
            className="font-semibold text-[#c85f33]"
          >
            {t("auth.signUp.terms")}
          </Link>{" "}
          {t("auth.signUp.agreementJoiner")}{" "}
          <Link to="/privacy-policy" className="font-semibold text-[#c85f33]">
            {t("auth.signUp.privacy")}
          </Link>
          {t("auth.signUp.agreementSuffix")}
        </p>
      </form>
    </AuthCard>
  );
}
