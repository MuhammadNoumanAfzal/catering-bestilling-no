import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { resetPassword } from "../../api";
import { AuthButton, AuthCard, AuthInput } from "../../components";
import { RESET_PASSWORD_INITIAL_FORM_STATE } from "../../constants/authForms";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(RESET_PASSWORD_INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = location.state?.email ?? "";
  const token = location.state?.token ?? "";

  if (!email || !token) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await resetPassword({
        email,
        token,
        password1: formState.password1,
        password2: formState.password2,
      });

      await showSuccessToast(
        result.message || t("auth.resetPassword.success"),
      );
      navigate("/signin", {
        replace: true,
        state: {
          registeredEmail: email,
        },
      });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : t("auth.resetPassword.errorMessage"),
        t("auth.resetPassword.errorTitle"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.resetPassword.title")}
      subtitle={t("auth.resetPassword.subtitle")}
      backTo="/forgot-password/verify"
      backState={{ email }}
      footer={
        <Link to="/signin" className="type-para font-semibold text-[#c85f33]">
          {t("auth.common.backToSignIn")}
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label={t("auth.resetPassword.newPassword")}
          name="password1"
          type="password"
          placeholder={t("auth.common.passwordPlaceholder")}
          value={formState.password1}
          onChange={handleChange}
          required
        />
        <AuthInput
          label={t("auth.resetPassword.confirmPassword")}
          name="password2"
          type="password"
          placeholder={t("auth.common.passwordPlaceholder")}
          value={formState.password2}
          onChange={handleChange}
          required
        />
        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("auth.resetPassword.submitting")
            : t("auth.resetPassword.submit")}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
