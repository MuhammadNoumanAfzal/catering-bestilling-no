import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { verifyResetCode } from "../../api";
import { AuthButton, AuthCard, OtpInput } from "../../components";
import { PASSWORD_RESET_OTP_LENGTH } from "../../constants/authForms";

export default function ForgotPasswordOtpPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = location.state?.email ?? "";

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await verifyResetCode({
        email,
        pin: otpCode,
      });

      await showSuccessToast(
        result.message || t("auth.verifyCode.success"),
      );
      navigate("/reset-password", {
        state: {
          email,
          token: otpCode,
        },
      });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : t("auth.verifyCode.errorMessage"),
        t("auth.verifyCode.errorTitle"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.verifyCode.title")}
      subtitle={t("auth.verifyCode.subtitle", {
        count: PASSWORD_RESET_OTP_LENGTH,
      })}
      backTo="/forgot-password"
      backState={{ email }}
      footer={
        <p className="type-para text-[#7c746d]">
          {t("auth.verifyCode.footerPrompt")}{" "}
          <Link
            to="/forgot-password"
            state={{ email }}
            className="type-para font-semibold text-[#c85f33]"
          >
            {t("auth.verifyCode.footerAction")}
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <OtpInput
          length={PASSWORD_RESET_OTP_LENGTH}
          value={otpCode}
          onChange={setOtpCode}
        />
        <AuthButton
          type="submit"
          disabled={isSubmitting || otpCode.length !== PASSWORD_RESET_OTP_LENGTH}
        >
          {isSubmitting ? t("auth.verifyCode.submitting") : t("auth.verifyCode.submit")}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
