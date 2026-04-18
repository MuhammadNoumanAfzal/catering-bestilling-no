export default function AuthButton({ children, type = "button" }) {
  return (
    <button
      type={type}
      className="type-h5 w-full rounded-full bg-[#c85f33] px-5 py-3 text-white transition hover:opacity-90"
    >
      {children}
    </button>
  );
}
