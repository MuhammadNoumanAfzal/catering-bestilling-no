import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function OrdersPagination({
  currentPage,
  endIndex,
  onPageChange,
  startIndex,
  totalItems,
  totalPages,
}) {
  const paginationNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .slice(0, 4);

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[#ece4dc] pt-4 text-sm text-[#666666] md:flex-row md:items-center md:justify-between">
      <p>
        Showing {startIndex} - {endIndex} of {totalItems} Orders
      </p>

      <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#ddd4cb] text-[#6c6c6c] transition disabled:cursor-not-allowed disabled:opacity-45 hover:bg-[#faf7f3]"
        >
          <FiChevronLeft className="text-[14px]" />
        </button>

        {paginationNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={[
                "flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-semibold transition",
                isActive
                  ? "bg-[#cf5c2f] text-white"
                  : "text-[#4d4d4d] hover:bg-[#faf7f3]",
              ].join(" ")}
            >
              {pageNumber}
            </button>
          );
        })}

        {totalPages > 4 ? <span className="px-1 text-xs">...</span> : null}

        {totalPages > 4 ? (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className={[
              "flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-semibold transition",
              totalPages === currentPage
                ? "bg-[#cf5c2f] text-white"
                : "text-[#4d4d4d] hover:bg-[#faf7f3]",
            ].join(" ")}
          >
            {totalPages}
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#ddd4cb] text-[#6c6c6c] transition disabled:cursor-not-allowed disabled:opacity-45 hover:bg-[#faf7f3]"
        >
          <FiChevronRight className="text-[14px]" />
        </button>
      </div>
    </div>
  );
}
