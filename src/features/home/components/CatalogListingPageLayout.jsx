import { useTranslation } from "react-i18next";
import BackLinkButton from "../../../components/shared/BackLinkButton";

export default function CatalogListingPageLayout({
  loading = false,
  error = "",
  emptyActions = null,
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
  const { t } = useTranslation();

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
                {t("vendors.showingCategory", {
                  category: activeCategoryLabel,
                  defaultValue: `Showing category: ${activeCategoryLabel}`,
                })}
              </p>
            ) : null}
          </div>

          <BackLinkButton to="/" className="text-[13px]">
            {t("vendors.backToHome", { defaultValue: "Back to home" })}
          </BackLinkButton>
        </div>

        {loading ? <p role="status" className="rounded-2xl border border-[#eadfd7] bg-[#fffaf6] p-8 text-center text-[#77685e]">{t("browse.updatingResults")}</p> : error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</p> : children}

        {!loading && !error && !hasItems ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-[#ddd4cb] bg-[#fcfaf8] px-6 py-12 text-center text-sm text-[#6f675f]">
            <p>{emptyMessage}</p>
            {emptyActions ? <div className="mt-5 flex flex-wrap justify-center gap-3">{emptyActions}</div> : null}
          </div>
        ) : null}

        {!loading && !error && hasMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onShowMore}
              className="rounded-full bg-[#c85f33] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#b6542c]"
            >
              {t("vendors.showMore", { count: 8, defaultValue: "Show 8 more" })}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
