import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { passwordResetMail } from "../api/authApi";
import {
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../utils/alerts";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await passwordResetMail({
        email,
        role: "user",
      });

      await showSuccessToast(result.message || "Verification code sent");
      navigate("/forgot-password/verify", {
        state: {
          email: email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to send the reset code right now.",
        "Could not send code",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="nouman@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending code..." : "Send code"}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
