import { Link } from "react-router-dom";

export default function VendorSectionCard({
  title,
  icon: Icon,
  children,
  footerLabel = "View More",
  footerTo,
  onFooterClick,
}) {
  const footerClasses =
    "flex w-full items-center justify-center gap-2 rounded-b-[20px] border-t border-[#f0f0f0] px-4 py-4 text-base font-bold text-[#201b17] hover:bg-[#faf9f6] transition duration-200";

  return (
    <section className="rounded-[20px] border border-[#e5e5e5] bg-white shadow-none">
      <header className="flex items-center gap-2.5 border-b border-[#f0f0f0] px-5 py-4.5">
        {Icon ? <Icon className="text-2xl text-[#cf6e38]" /> : null}
        <h2 className="text-lg font-bold text-[#201b17]">{title}</h2>
      </header>

      <div className="px-5 py-3">{children}</div>

      {footerTo ? (
        <Link to={footerTo} className={footerClasses}>
          <span>{footerLabel}</span>
        </Link>
      ) : footerLabel ? (
        <button
          type="button"
          onClick={onFooterClick}
          className={footerClasses}
        >
          <span>{footerLabel}</span>
        </button>
      ) : null}
    </section>
  );
}
