import { FiChevronRight } from "react-icons/fi";

export default function VendorSectionCard({
  title,
  icon: Icon,
  children,
  footerLabel = "View More",
}) {
  return (
    <section className="rounded-[24px] border border-[#d8d8d8] bg-white shadow-[0_8px_24px_rgba(25,25,25,0.06)]">
      <header className="flex items-center gap-2 border-b border-[#ececec] px-5 py-4">
        {Icon ? <Icon className="text-[18px] text-[#cf5c2f]" /> : null}
        <h2 className="type-h6 text-[#1f1f1f]">{title}</h2>
      </header>

      <div className="px-4 py-3">{children}</div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-b-[24px] border-t border-[#ececec] px-4 py-3 text-sm font-semibold text-[#303030] transition hover:bg-[#faf7f3]"
      >
        <span>{footerLabel}</span>
        <FiChevronRight className="text-[14px]" />
      </button>
    </section>
  );
}
