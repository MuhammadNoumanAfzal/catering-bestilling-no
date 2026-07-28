import { FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function BackLinkButton({
  to,
  state,
  children,
  className = "",
  iconClassName = "",
}) {
  return (
    <Link
      to={to}
      state={state}
      className={`group inline-flex items-center gap-2.5 rounded-full border border-[#e4d6ca] bg-[linear-gradient(135deg,#fffdfa_0%,#fff4ec_100%)] px-4 py-2.5 text-[14px] font-semibold text-[#2b2622] shadow-[0_10px_24px_rgba(31,19,8,0.08)] transition duration-200 hover:-translate-y-[1px] hover:border-[#cf6e38] hover:text-[#cf6e38] hover:shadow-[0_16px_30px_rgba(201,95,51,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf6e38]/30 ${className}`}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#cf6e38] shadow-[0_6px_14px_rgba(31,19,8,0.08)] transition duration-200 group-hover:-translate-x-[1px]">
        <FiChevronLeft className={`text-[15px] ${iconClassName}`} />
      </span>
      <span>{children}</span>
    </Link>
  );
}
