import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function InvoicePagination({
  currentPage,
  endIndex,
  onPageChange,
  startIndex,
  totalItems,
  totalPages,
}) {
  const paginationNumbers = Array.from(
    { length: Math.min(totalPages, 4) },
    (_, index) => index + 1,
  );

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[#ece4dc] pt-4 text-sm text-[#666666] md:flex-row md:items-center md:justify-between">
      <p>
        Showing {startIndex} - {endIndex} of {totalItems} invoices
      </p>

      <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ddd4cb] text-[#6c6c6c] transition hover:bg-[#faf7f3] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <FiChevronLeft className="text-[14px]" />
        </button>

        {paginationNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={[
              "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition",
              pageNumber === currentPage
                ? "bg-[#cf5c2f] text-white shadow-[0_8px_16px_rgba(207,92,47,0.18)]"
                : "text-[#4d4d4d] hover:bg-[#faf7f3]",
            ].join(" ")}
          >
            {pageNumber}
          </button>
        ))}

        {totalPages > 4 ? <span className="px-1 text-xs">...</span> : null}

        {totalPages > 4 ? (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className={[
              "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition",
              totalPages === currentPage
                ? "bg-[#cf5c2f] text-white shadow-[0_8px_16px_rgba(207,92,47,0.18)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ddd4cb] text-[#6c6c6c] transition hover:bg-[#faf7f3] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <FiChevronRight className="text-[14px]" />
        </button>
      </div>
    </div>
  );
}
