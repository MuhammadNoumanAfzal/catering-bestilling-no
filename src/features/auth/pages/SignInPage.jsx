import { Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back. Enter your details to continue."
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
      <form className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          placeholder="nouman@example.com"
        />
        <AuthInput label="Password" type="password" placeholder="********" />
        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="type-para font-semibold text-[#c85f33]"
          >
            Forgot password?
          </Link>
        </div>
        <AuthButton type="submit">Sign in</AuthButton>
      </form>
    </AuthCard>
  );
}
