import MenuCard from "../../../components/shared/MenuCard";

function EmptyState({ categoryLabel }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#ddd4cb] bg-[#fcfaf8] px-6 py-16 text-center">
      <h3 className="type-h3 text-[#1f1f1f]">No Menu Found</h3>
      <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-[#746b63]">
        {categoryLabel
          ? `There are no available menu items for ${categoryLabel} right now. Try another category to see more options.`
          : "There are no available menu items right now. Try another category to see more options."}
      </p>
    </div>
  );
}

export default function BrowseMenuSection({
  title,
  items,
  totalItems,
  activeCategoryLabel,
  seeAllLabel = "See all",
  onSeeAllClick,
}) {
  return (
    <section className="mt-12 ">
      <div className="mx-auto px-4 w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h3 font-semibold text-[#191919]">{title}</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[#777]">
              {totalItems ?? items.length} items
            </p>

            {onSeeAllClick ? (
              <button
                type="button"
                onClick={onSeeAllClick}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#d9d1c7] px-5 py-2 text-sm font-medium text-[#191919] transition hover:border-[#c46a35] hover:text-[#c46a35]"
              >
                {seeAllLabel}
              </button>
            ) : null}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3 ">
            {items.map((item) => (
              <MenuCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <EmptyState categoryLabel={activeCategoryLabel} />
        )}
      </div>
    </section>
  );
}
