import { useEffect, useRef, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const hasMounted = useRef(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [menuItems]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage]);

  const totalPages = Math.ceil(menuItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = menuItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <section className="w-full px-6 py-12 md:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <BrowseTabs />
        <BrowseCategoryStrip
          categories={categories}
          moreOptions={moreOptions}
        />
        <BrowseFilterBar />
      </div>

      <BrowseMenuSection
        title="Menu"
        items={paginatedItems}
        totalItems={menuItems.length}
      />

      {totalPages > 1 ? (
        <div className="mx-auto mt-8 flex w-full max-w-7xl flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              currentPage === 1
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
                  currentPage === page
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
            disabled={currentPage === totalPages}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              currentPage === totalPages
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
