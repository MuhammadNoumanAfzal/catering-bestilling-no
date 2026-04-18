import { Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we&apos;ll send you a verification code."
      footer={
        <Link to="/signin" className="type-para font-semibold text-[#c85f33]">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="nouman@example.com"
        />
        <AuthButton type="submit">Send code</AuthButton>
      </form>
    </AuthCard>
  );
}
