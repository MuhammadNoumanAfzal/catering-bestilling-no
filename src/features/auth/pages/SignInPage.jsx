import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { loginUser } from "../api";
import { AUTH_ROLE } from "../constants/authForms";
import {
  AuthButton,
  AuthCard,
  AuthInput,
  AuthPageFooter,
} from "../components";
import { useAuth } from "../hooks/useAuth";

export default function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail ?? "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await loginUser({
        ...formData,
        role: AUTH_ROLE,
      });

      setAuthSession({
        accessToken: result.access,
        user: result.user,
      });

      await showSuccessToast(
        `Welcome back, ${result.user.firstName || result.user.email}`,
      );
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error ? error.message : "Unable to sign in right now.",
        "Sign in failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      badge="Sign In"
      title="Welcome back"
      subtitle="Sign in to continue managing your catering account."
      footer={
        <AuthPageFooter
          prompt="Don&apos;t have an account?"
          actionLabel="Create one"
          actionTo="/signup"
          actionState={location.state}
        />
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="nouman@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#8a7f76]">Use your registered account</p>
          <Link
            to="/forgot-password"
            className="text-[14px] font-semibold text-[#c85f33]"
          >
            Forgot password?
          </Link>
        </div>
        <AuthButton
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          <FiArrowRight className="text-[16px]" />
        </AuthButton>
      </form>
    </AuthCard>
  );
}
