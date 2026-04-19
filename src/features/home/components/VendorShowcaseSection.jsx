import VendorCard from "./VendorCard";

export default function VendorShowcaseSection({
  title,
  vendors,
  seeAllLabel = "See all",
  onSeeAllClick,
}) {
  const visibleVendors = vendors.slice(0, 3);

  return (
    <section className="bg-white px-8 py-6 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        {title ? (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="type-h3 font-semibold text-[#191919] sm:text-xl">
              {title}
            </h2>

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
        ) : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVendors.map((vendor) => (
            <VendorCard key={vendor.id ?? vendor.name} {...vendor} />
          ))}
        </div>
      </div>
    </section>
  );
}
