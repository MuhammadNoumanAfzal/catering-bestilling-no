import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import {
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../utils/alerts";

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
        role: "user",
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
        <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[#6f665f]">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              state={location.state}
              className="font-semibold text-[#c85f33]"
            >
              Create one
            </Link>
          </p>
          <Link to="/" className="text-[15px] font-semibold text-[#c85f33]">
            I&apos;m a Caterer
          </Link>
        </div>
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
