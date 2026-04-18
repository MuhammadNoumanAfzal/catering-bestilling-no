import { Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import AuthInput from "../components/AuthInput";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-[780px]">
      <div className="mb-3 text-center">
        <p className="type-h5 text-black">
          Already have an account?{" "}
          <Link to="/signin" className="type-h5 font-semibold text-[#0e8bdc]">
            Sign in
          </Link>
        </p>
      </div>

      <section className="rounded-[14px] border border-[#bfc3c7] bg-white px-[14px] pb-[18px] pt-[12px]">
        <h1 className="type-h2 mb-7 text-center text-black">Create account</h1>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              label="First name"
              placeholder="Enter first name"
              className="px-5"
            />
            <AuthInput
              label="Last name"
              placeholder="Enter last name"
              className="px-5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              label="Email"
              type="email"
              placeholder="nouman@example.com"
              className="px-5"
            />
            <AuthInput
              label="Password"
              type="password"
              placeholder="********"
              className="px-5"
            />
          </div>

          <p className="type-subpara leading-[1.35] text-[#8f8f8f]">
            By providing us with your phone number, you consent to receiving
            informational and transactional text messages such as order
            confirmations, to stop receiving message, reply STOP at any time.{" "}
            <Link to="/" className="text-[#0e8bdc]">
              Terms and Privacy Policy
            </Link>{" "}
            apply. Message and data rates may apply
          </p>

          <div className="grid grid-cols-[1fr_auto] items-end gap-4">
            <AuthInput
              label=""
              placeholder="Enter phone number"
              className="px-5"
            />
            <Link
              to="/"
              className="type-h5 whitespace-nowrap pb-3 text-[#0e8bdc]"
            >
              I&apos;m a Caterer
            </Link>
          </div>

          <button
            type="button"
            className="type-h5 w-full rounded-full border border-[#bfc3c7] bg-white px-5 py-[7px] text-[#cf6436]"
          >
            Create account with google
          </button>

          <AuthButton type="submit">Create account</AuthButton>

          <p className="type-subpara leading-[1.35] text-[#8f8f8f]">
            By creating an account, you agree to our{" "}
            <Link to="/" className="text-[#0e8bdc]">
              Terms and Privacy Policy.
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
