import { Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";

export default function ResetPasswordPage() {
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
      <form className="space-y-4">
        <AuthInput
          label="New password"
          type="password"
          placeholder="********"
        />
        <AuthInput
          label="Confirm password"
          type="password"
          placeholder="********"
        />
        <AuthButton type="submit">Reset password</AuthButton>
      </form>
    </AuthCard>
  );
}
