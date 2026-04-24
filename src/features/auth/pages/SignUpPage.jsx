import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { showSuccessToast } from "../../../utils/alerts";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
};

export default function SignUpPage() {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await showSuccessToast("Account created successfully");
    setFormState(initialFormState);
  };

  return (
    <AuthCard
      badge="Create Account"
      title="Create your account"
      subtitle="Join quickly and start ordering with a cleaner, simpler flow."
      footer={
        <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[#6f665f]">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-[#c85f33]">
              Sign in
            </Link>
          </p>
          <Link to="/" className="text-[15px] font-semibold text-[#c85f33]">
            I&apos;m a Caterer
          </Link>
        </div>
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
        />

        <AuthButton type="button" variant="secondary" className="py-3">
          Continue with Google
        </AuthButton>

        <AuthButton
          type="submit"
          className="inline-flex items-center justify-center gap-2"
        >
          Create account
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
