import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import OtpInput from "../components/OtpInput";
import { verifyResetCode } from "../api/authApi";
import {
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../utils/alerts";

export default function ForgotPasswordOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = location.state?.email ?? "";

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await verifyResetCode({
        email,
        pin: otpCode,
      });

      await showSuccessToast(result.message || "Code verified successfully");
      navigate("/reset-password", {
        state: {
          email,
          token: otpCode,
        },
      });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to verify the reset code right now.",
        "Verification failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter the 4-digit code sent to your email."
      footer={
        <p className="type-para text-[#7c746d]">
          Didn&apos;t get the code?{" "}
          <Link
            to="/forgot-password"
            state={{ email }}
            className="type-para font-semibold text-[#c85f33]"
          >
            Resend
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <OtpInput length={4} value={otpCode} onChange={setOtpCode} />
        <AuthButton
          type="submit"
          disabled={isSubmitting || otpCode.length !== 4}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
