import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { resetPassword } from "../../api";
import { AuthButton, AuthCard, AuthInput } from "../../components";
import { RESET_PASSWORD_INITIAL_FORM_STATE } from "../../constants/authForms";

export default function ResetPasswordPage() {
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

      await showSuccessToast(result.message || "Password reset successfully");
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
          : "Unable to reset your password right now.",
        "Reset failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="New password"
      subtitle="Choose a strong password for your account."
      footer={
        <Link to="/signin" className="type-para font-semibold text-[#c85f33]">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label="New password"
          name="password1"
          type="password"
          placeholder="********"
          value={formState.password1}
          onChange={handleChange}
          required
        />
        <AuthInput
          label="Confirm password"
          name="password2"
          type="password"
          placeholder="********"
          value={formState.password2}
          onChange={handleChange}
          required
        />
        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Resetting password..." : "Reset password"}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
