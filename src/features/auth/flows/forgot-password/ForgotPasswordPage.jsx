import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { passwordResetMail } from "../../api";
import { AuthButton, AuthCard, AuthInput } from "../../components";
import { AUTH_ROLE } from "../../constants/authForms";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await passwordResetMail({
        email,
        role: AUTH_ROLE,
      });

      await showSuccessToast(
        result.message || t("auth.forgotPassword.success"),
      );
      navigate("/forgot-password/verify", {
        state: {
          email: email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : t("auth.forgotPassword.errorMessage"),
        t("auth.forgotPassword.errorTitle"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
      backTo="/signin"
      footer={
        <Link to="/signin" className="type-para font-semibold text-[#c85f33]">
          {t("auth.common.backToSignIn")}
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          label={t("auth.common.email")}
          name="email"
          type="email"
          placeholder={t("auth.common.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("auth.forgotPassword.submitting")
            : t("auth.forgotPassword.submit")}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
