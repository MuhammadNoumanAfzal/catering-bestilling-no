import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
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

export default function SignUpPage() {
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

      await showSuccessToast(result.message || "Account created successfully");
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
          : "Unable to create your account right now.",
        "Sign up failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      badge="Create Account"
      title="Create your account"
      subtitle="Join quickly and start ordering with a cleaner, simpler flow."
      footer={
        <AuthPageFooter
          prompt="Already have an account?"
          actionLabel="Sign in"
          actionTo="/signin"
          actionState={location.state}
        />
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            label="First name"
            name="firstName"
            placeholder="Enter first name"
            value={formState.firstName}
            onChange={handleChange}
            required
          />
          <AuthInput
            label="Last name"
            name="lastName"
            placeholder="Enter last name"
            value={formState.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="nouman@example.com"
            value={formState.email}
            onChange={handleChange}
            required
          />
          <AuthInput
            label="Password"
            name="password"
            type="password"
            placeholder="********"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>

        <AuthInput
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Enter phone number"
          value={formState.phone}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Post code"
          name="postCode"
          type="text"
          placeholder="Enter post code"
          value={formState.postCode}
          onChange={handleChange}
          required
        />

        <AuthButton
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
          <FiArrowRight className="text-[16px]" />
        </AuthButton>

        <p className="text-[12px] leading-5 text-[#867d75]">
          By creating an account, you agree to our{" "}
          <Link to="/" className="font-semibold text-[#c85f33]">
            Terms and Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthCard>
  );
}
