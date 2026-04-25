import { useEffect, useRef, useState } from "react";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import BrowseTabs from "./BrowseTabs";
import BrowseCategoryStrip from "../../../components/shared/BrowseCategoryStrip";
import BrowseFilterBar from "../../../components/shared/BrowseFilterBar";
import BrowseMenuSection from "./BrowseMenuSection";

const ITEMS_PER_PAGE = 6;

export default function BrowseCatalogView({
  categories,
  menuItems,
  moreOptions,
}) {
  const { attendeeCount } = useBrowseFilters();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hasMounted = useRef(false);

  const normalizedCategoryFilter = Array.isArray(selectedCategory)
    ? selectedCategory.map((item) => item.trim())
    : selectedCategory?.trim() ?? null;
  const filteredMenuItems = menuItems.filter((item) => {
    if (!normalizedCategoryFilter) {
      const minimumGuests = item.minimumGuests ?? 0;
      const maximumGuests = item.maximumGuests ?? Number.POSITIVE_INFINITY;

      return attendeeCount <= 0
        ? true
        : attendeeCount >= minimumGuests && attendeeCount <= maximumGuests;
    }

    const tags = (item.categoryTags ?? []).map((tag) => tag.trim());
    const minimumGuests = item.minimumGuests ?? 0;
    const maximumGuests = item.maximumGuests ?? Number.POSITIVE_INFINITY;
    const matchesAttendees =
      attendeeCount <= 0
        ? true
        : attendeeCount >= minimumGuests && attendeeCount <= maximumGuests;

    const matchesCategory = Array.isArray(normalizedCategoryFilter)
      ? normalizedCategoryFilter.some((tag) => tags.includes(tag))
      : tags.includes(normalizedCategoryFilter);

    return matchesCategory && matchesAttendees;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [attendeeCount, selectedCategory]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMenuItems.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredMenuItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const activeCategoryLabel = Array.isArray(normalizedCategoryFilter)
    ? normalizedCategoryFilter.join(", ")
    : normalizedCategoryFilter;

  return (
    <section className="w-full px-6 py-12 md:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <BrowseTabs />
        <BrowseCategoryStrip
          activeCategory={selectedCategory}
          categories={categories}
          moreOptions={moreOptions}
          onCategoryChange={setSelectedCategory}
        />
        <BrowseFilterBar />
      </div>

      <BrowseMenuSection
        title="Menu"
        items={paginatedItems}
        totalItems={filteredMenuItems.length}
        activeCategoryLabel={activeCategoryLabel}
      />

      {totalPages > 1 ? (
        <div className="mx-auto mt-8 flex w-full max-w-7xl flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              safeCurrentPage === 1
                ? "cursor-not-allowed border-[#ddd6cd] text-[#b5ada4]"
                : "cursor-pointer border-[#d7cec3] text-[#2b2b2b] hover:border-[#c85f33] hover:text-[#c85f33]"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition cursor-pointer ${
                  safeCurrentPage === page
                    ? "bg-[#c85f33] text-white"
                    : "border border-[#d7cec3] text-[#2b2b2b] hover:border-[#c85f33] hover:text-[#c85f33]"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safeCurrentPage === totalPages}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              safeCurrentPage === totalPages
                ? "cursor-not-allowed border-[#ddd6cd] text-[#b5ada4]"
                : "cursor-pointer border-[#d7cec3] text-[#2b2b2b] hover:border-[#c85f33] hover:text-[#c85f33]"
            }`}
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
