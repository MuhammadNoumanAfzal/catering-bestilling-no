export default function AuthButton({
  children,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const variantClassName =
    variant === "secondary"
      ? "border border-[#ddcfc2] bg-white text-[#241d18] hover:bg-[#faf4ee]"
      : "bg-[linear-gradient(135deg,#cc6b3a_0%,#b85c2f_100%)] text-white shadow-[0_18px_34px_rgba(200,97,53,0.24)] hover:brightness-[0.98]";

  return (
    <button
      type={type}
      className={`w-full rounded-full px-5 py-3.5 text-[15px] font-semibold transition ${variantClassName} ${className}`}
    >
      {children}
    </button>
  );
}
