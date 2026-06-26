import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

export default function VendorSectionCard({
  title,
  icon: Icon,
  children,
  footerLabel = "View More",
  footerTo,
  onFooterClick,
}) {
  const footerClasses =
    "flex w-full items-center justify-center gap-2 rounded-b-[28px] border-t border-[#eee5dd] px-4 py-3.5 text-sm font-semibold text-[#45362d] transition hover:bg-[#faf7f3]";

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#e7ddd3] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f2_100%)] shadow-[0_18px_40px_rgba(40,24,12,0.08)]">
      <header className="flex items-center gap-3 border-b border-[#efe5dc] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,247,239,0.92))] px-5 py-4">
        {Icon ? (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#cf5c2f] shadow-[0_8px_18px_rgba(207,92,47,0.12)]">
            <Icon className="text-[20px]" />
          </span>
        ) : null}
        <div>
          <h2 className="type-h4 text-[#1f1f1f]">{title}</h2>
          <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-[#b07c61]">
            Live snapshot
          </p>
        </div>
      </header>

      <div className="px-4 py-4">{children}</div>

      {footerTo ? (
        <Link to={footerTo} className={footerClasses}>
          <span>{footerLabel}</span>
          <FiChevronRight className="text-[14px]" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={onFooterClick}
          className={footerClasses}
        >
          <span>{footerLabel}</span>
          <FiChevronRight className="text-[14px]" />
        </button>
      )}
    </section>
  );
}
