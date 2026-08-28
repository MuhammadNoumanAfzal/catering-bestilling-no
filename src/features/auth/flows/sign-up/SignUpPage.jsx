import { useState } from "react";
import { FiArrowRight, FiEdit3 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { sendSignupOtp, verifySignupOtp } from "../../api";
import {
  AuthButton,
  AuthCard,
  AuthInput,
  AuthPageFooter,
  OtpInput,
} from "../../components";
import {
  AUTH_ROLE,
  SIGN_UP_INITIAL_FORM_STATE,
  SIGNUP_OTP_LENGTH,
} from "../../constants/authForms";

const VENDOR_REGISTER_URL =
  "https://catering-bestilling-no-vendor-panel.vercel.app/";
const VENDOR_DASHBOARD_ONBOARDING_NOTICE_KEY =
  "vendor-dashboard-onboarding-guide-pending";

const SIGNUP_STEP = {
  FORM: "form",
  VERIFY: "verify",
};

export default function SignUpPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [signupStep, setSignupStep] = useState(SIGNUP_STEP.FORM);
  const [formState, setFormState] = useState(SIGN_UP_INITIAL_FORM_STATE);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const normalizedEmail = formState.email.trim().toLowerCase();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));

    if (name === "email" && signupStep === SIGNUP_STEP.VERIFY) {
      setSignupStep(SIGNUP_STEP.FORM);
      setOtpCode("");
      setOtpError("");
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setFormErrors({});
    setIsSendingOtp(true);

    try {
      const result = await sendSignupOtp({
        ...formState,
        role: AUTH_ROLE,
      });

      setOtpCode("");
      setOtpError("");
      setSignupStep(SIGNUP_STEP.VERIFY);
      await showSuccessToast(
        result.message ||
          t("auth.signUp.otpSent", {
            defaultValue: "Verification code sent to your email.",
          }),
      );
    } catch (error) {
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

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

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
    setIsVerifyingOtp(true);

    try {
      const result = await verifySignupOtp({
        otp: otpCode,
        ...formState,
        email: normalizedEmail,
        role: AUTH_ROLE,
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          VENDOR_DASHBOARD_ONBOARDING_NOTICE_KEY,
          "true",
        );
      }

      await showSuccessToast(
        result.message ||
          "Account created. After sign in, go to Settings to complete your profile and add your address during checkout.",
      );
      setFormState(SIGN_UP_INITIAL_FORM_STATE);
      setOtpCode("");
      setSignupStep(SIGNUP_STEP.FORM);
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
      const phoneError =
        error instanceof Error && Array.isArray(error.fieldErrors?.phone)
          ? error.fieldErrors.phone[0]
          : "";
      const emailError =
        error instanceof Error && Array.isArray(error.fieldErrors?.email)
          ? error.fieldErrors.email[0]
          : "";
      const postCodeError =
        error instanceof Error && Array.isArray(error.fieldErrors?.postCode)
          ? error.fieldErrors.postCode[0]
          : "";

      if (fieldOtpError) {
        setOtpError(fieldOtpError);
      } else if (phoneError || emailError || postCodeError) {
        setSignupStep(SIGNUP_STEP.FORM);
        setOtpCode("");
        setOtpError("");
        setFormErrors({
          ...(phoneError ? { phone: phoneError } : {}),
          ...(emailError ? { email: emailError } : {}),
          ...(postCodeError ? { postCode: postCodeError } : {}),
        });
      } else {
        await showAuthErrorAlert(
          error instanceof Error
            ? error.message
            : t("auth.signUp.errorMessage"),
          t("auth.signUp.errorTitle"),
        );
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <AuthCard
      badge={t("auth.signUp.badge")}
      title={
        signupStep === SIGNUP_STEP.VERIFY
          ? t("auth.signUp.verifyTitle", { defaultValue: "Verify your email" })
          : t("auth.signUp.title")
      }
      subtitle={
        signupStep === SIGNUP_STEP.VERIFY
          ? t("auth.signUp.verifySubtitle", {
              defaultValue:
                "Enter the 6-digit verification code we sent to {{email}} to complete your account setup.",
              email: normalizedEmail,
            })
          : t("auth.signUp.subtitle")
      }
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
      {signupStep === SIGNUP_STEP.FORM ? (
        <form className="space-y-5" onSubmit={handleSendOtp}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthInput
              autoComplete="given-name"
              label={t("auth.signUp.firstName")}
              name="firstName"
              placeholder={t("auth.signUp.firstNamePlaceholder")}
              value={formState.firstName}
              onChange={handleChange}
              required
            />
            <AuthInput
              autoComplete="family-name"
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
              autoComplete="email"
              label={t("auth.common.email")}
              name="email"
              type="email"
              placeholder={t("auth.common.emailPlaceholder")}
              value={formState.email}
              onChange={handleChange}
              errorText={formErrors.email}
              helperText={t("auth.signUp.emailStepHelper", {
                defaultValue: "We will send a verification code after you click Register.",
              })}
              required
            />
            <AuthInput
              autoComplete="new-password"
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
            autoComplete="tel"
            inputMode="tel"
            label={t("auth.signUp.phone")}
            name="phone"
            type="tel"
            placeholder={t("auth.signUp.phonePlaceholder")}
            value={formState.phone}
            onChange={handleChange}
            errorText={formErrors.phone}
            required
          />

          <AuthInput
            autoComplete="postal-code"
            inputMode="numeric"
            label={t("auth.signUp.postCode")}
            name="postCode"
            type="text"
            placeholder={t("auth.signUp.postCodePlaceholder")}
            value={formState.postCode}
            onChange={handleChange}
            errorText={formErrors.postCode}
            required
          />

          <AuthButton
            type="submit"
            disabled={isSendingOtp}
            className="inline-flex items-center justify-center gap-2 pt-3"
          >
            {isSendingOtp
              ? t("auth.signUp.sendingOtp", { defaultValue: "Sending code..." })
              : t("auth.signUp.registerAndSendOtp", {
                  defaultValue: "Register",
                })}
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
      ) : (
        <form className="space-y-5" onSubmit={handleVerifyOtp}>
          <div className="rounded-[26px] border border-[#ecd8ca] bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ea_100%)] p-5 shadow-[0_16px_34px_rgba(200,95,51,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c56b3c]">
                  {t("auth.signUp.verificationBadge", { defaultValue: "Email Verification" })}
                </p>
                <p className="mt-1 text-[14px] text-[#6f6158]">{normalizedEmail}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSignupStep(SIGNUP_STEP.FORM);
                  setOtpCode("");
                  setOtpError("");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#e3cdbf] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8f6e5a] transition hover:border-[#c85f33] hover:text-[#c85f33]"
              >
                <FiEdit3 className="text-[14px]" />
                {t("auth.signUp.editDetails", { defaultValue: "Edit details" })}
              </button>
            </div>

            <div className="mt-5">
              <OtpInput
                length={SIGNUP_OTP_LENGTH}
                value={otpCode}
                onChange={(value) => {
                  setOtpError("");
                  setOtpCode(value);
                }}
              />
              {otpError ? (
                <p className="mt-3 text-center text-[13px] font-medium text-[#d76a4a]">
                  {otpError}
                </p>
              ) : (
                <p className="mt-3 text-center text-[13px] text-[#7e6c61]">
                  {t("auth.signUp.otpInputHelper", {
                    defaultValue: "Enter the code sent to your email. It expires in 10 minutes.",
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp || isVerifyingOtp}
              className="inline-flex min-h-13 w-full items-center justify-center rounded-[18px] border border-[#e4a788] bg-white px-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c85f33] transition hover:border-[#c85f33] hover:bg-[#fff1e7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSendingOtp
                ? t("auth.signUp.sendingOtp", { defaultValue: "Sending code..." })
                : t("auth.signUp.resendOtp", { defaultValue: "Resend code" })}
            </button>

            <AuthButton
              type="submit"
              disabled={isVerifyingOtp || otpCode.length !== SIGNUP_OTP_LENGTH}
              className="inline-flex items-center justify-center gap-2"
            >
              {isVerifyingOtp
                ? t("auth.signUp.verifyingOtp", { defaultValue: "Verifying..." })
                : t("auth.signUp.verifyAndCreate", {
                    defaultValue: "Verify and create account",
                  })}
              <FiArrowRight className="text-[16px]" />
            </AuthButton>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
