import { Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import OtpInput from "../components/OtpInput";

export default function ForgotPasswordOtpPage() {
  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter the 4-digit code sent to your email."
      footer={
        <p className="type-para text-[#7c746d]">
          Didn&apos;t get the code?{" "}
          <Link
            to="/forgot-password"
            className="type-para font-semibold text-[#c85f33]"
          >
            Resend
          </Link>
        </p>
      }
    >
      <form className="space-y-5">
        <OtpInput length={4} />
        <AuthButton type="submit">Verify</AuthButton>
      </form>
    </AuthCard>
  );
}
