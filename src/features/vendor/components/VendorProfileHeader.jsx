import { FiBookmark, FiMapPin, FiShare2, FiStar } from "react-icons/fi";

export default function VendorProfileHeader({
  vendor,
  isSaved,
  onSaveToggle,
  onShare,
}) {
  return (
    <div className="rounded-[16px] border border-[#e7dfd6] bg-white p-4 shadow-[0_6px_18px_rgba(31,19,8,0.04)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-20 w-full max-w-[140px] shrink-0 items-center justify-center self-center rounded-[12px] border border-[#ddd6cd] bg-white px-2 sm:h-24 sm:w-42 sm:self-start">
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-[30px] font-semibold leading-[1] tracking-[-0.03em] text-[#151515] sm:type-h2">
              {vendor.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[15px] text-[#151515] sm:justify-start">
              <span className="inline-flex items-center gap-1">
                <FiStar className="fill-[#f4b400] text-[#f4b400]" />
                {vendor.rating}
              </span>
              <span>({vendor.reviewCount} reviews)</span>
            </div>

            <p className="mt-2 inline-flex max-w-full items-start justify-center gap-1.5 text-[15px] leading-6 text-[#7a746d] sm:justify-start">
              <FiMapPin className="text-[13px]" />
              <span className="break-words">{vendor.addressLine}</span>
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-full border border-[#ddd6cd] px-4 py-2 text-[12px] font-medium transition hover:border-[#cf6e38] hover:text-[#cf6e38] sm:flex-none"
          >
            <FiShare2 className="text-[12px]" />
            Share
          </button>
          <button
            type="button"
            onClick={onSaveToggle}
            aria-pressed={isSaved}
            className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-full border px-4 py-2 text-[12px] font-medium transition sm:flex-none ${
              isSaved
                ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                : "border-[#ddd6cd] text-[#151515] hover:border-[#cf6e38] hover:text-[#cf6e38]"
            }`}
          >
            <FiBookmark className={`text-[12px] ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
