import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { DEMO_USER, useAuth } from "../context/AuthContext";
import { showSuccessToast } from "../../../utils/alerts";

export default function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: DEMO_USER.email,
    password: DEMO_USER.password,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = signIn(formData);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    await showSuccessToast(`Welcome back, ${result.user.name}`);
    navigate(location.state?.from?.pathname ?? "/", { replace: true });
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
          <p className="text-[13px] text-[#8a7f76]">
            Demo login is prefilled
          </p>
          <Link
            to="/forgot-password"
            className="text-[14px] font-semibold text-[#c85f33]"
          >
            Forgot password?
          </Link>
        </div>
        {errorMessage ? (
          <p className="rounded-2xl border border-[#f2c7c2] bg-[#fff4f2] px-4 py-3 text-sm text-[#c43f32]">
            {errorMessage}
          </p>
        ) : null}
        <AuthButton
          type="submit"
          className="inline-flex items-center justify-center gap-2"
        >
          Sign in
          <FiArrowRight className="text-[16px]" />
        </AuthButton>
      </form>
    </AuthCard>
  );
}
