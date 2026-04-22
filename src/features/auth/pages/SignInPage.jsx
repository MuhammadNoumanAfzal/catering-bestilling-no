import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { DEMO_USER, useAuth } from "../context/AuthContext";
import { showSuccessToast } from "../../../utils/alerts";

export default function SignInPage() {
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
    navigate("/");
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back. Use the demo login below to continue."
      footer={
        <div className="flex items-center justify-between gap-4 text-left">
          <p className="type-h4 text-[#7c746d]">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="type-para font-semibold text-[#0e8bdc]"
            >
              Create one
            </Link>
          </p>
          <Link to="/" className="type-para whitespace-nowrap text-[#0e8bdc]">
            I&apos;m a Caterer
          </Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-[#f0d6c9] bg-[#fff6f1] p-4 text-sm text-[#6b4f42]">
          <p className="font-semibold text-[#c85f33]">Demo login</p>
          <p>Email: {DEMO_USER.email}</p>
          <p>Password: {DEMO_USER.password}</p>
        </div>

        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="nouman@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="type-para font-semibold text-[#c85f33]"
          >
            Forgot password?
          </Link>
        </div>
        {errorMessage ? (
          <p className="type-para text-sm text-red-600">{errorMessage}</p>
        ) : null}
        <AuthButton type="submit">Sign in</AuthButton>
      </form>
    </AuthCard>
  );
}
