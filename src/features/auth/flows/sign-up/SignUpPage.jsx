import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { registerUser } from "../../api";
import {
  AuthButton,
  AuthCard,
  AuthInput,
  AuthPageFooter,
} from "../../components";
import {
  AUTH_ROLE,
  SIGN_UP_INITIAL_FORM_STATE,
} from "../../constants/authForms";

const VENDOR_REGISTER_URL =
  "https://catering-bestilling-no-vendor-panel.vercel.app/";

export default function SignUpPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(SIGN_UP_INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await registerUser({
        ...formState,
        role: AUTH_ROLE,
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
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : t("auth.signUp.errorMessage"),
        t("auth.signUp.errorTitle"),
      );
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
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <AuthButton
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2"
        >
          {isSubmitting ? t("auth.signUp.submitting") : t("auth.signUp.submit")}
          <FiArrowRight className="text-[16px]" />
        </AuthButton>

        <p className="text-[12px] leading-5 text-[#867d75]">
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
