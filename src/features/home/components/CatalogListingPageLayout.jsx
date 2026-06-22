import { Link } from "react-router-dom";

export default function CatalogListingPageLayout({
  badge,
  title,
  description,
  activeCategoryLabel,
  emptyMessage,
  hasItems,
  hasMore,
  onShowMore,
  children,
}) {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8b7d70]">
              {badge}
            </p>
            <h1 className="mt-2 type-h2 text-[#191919]">{title}</h1>
            <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#4f4f4f]">
              {description}
            </p>
            {activeCategoryLabel ? (
              <p className="mt-3 inline-flex rounded-full bg-[#fff1eb] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#c85f33]">
                Showing category: {activeCategoryLabel}
              </p>
            ) : null}
          </div>

          <Link
            to="/"
            className="rounded-full border border-[#d7cec3] px-4 py-2 text-[13px] font-semibold text-[#2b2b2b] transition hover:border-[#c85f33] hover:text-[#c85f33]"
          >
            Back to home
          </Link>
        </div>

        {children}

        {!hasItems ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-[#ddd4cb] bg-[#fcfaf8] px-6 py-12 text-center text-sm text-[#6f675f]">
            {emptyMessage}
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onShowMore}
              className="rounded-full bg-[#c85f33] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#b6542c]"
            >
              Show 8 more
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
