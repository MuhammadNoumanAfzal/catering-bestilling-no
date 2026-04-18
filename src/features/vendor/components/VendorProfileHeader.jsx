import { FiMapPin, FiShare2, FiStar } from "react-icons/fi";

export default function VendorProfileHeader({ vendor }) {
  return (
    <div className="rounded-[16px] border border-[#e7dfd6] bg-white p-4 shadow-[0_6px_18px_rgba(31,19,8,0.04)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-24 w-42 shrink-0 items-center justify-center rounded-[12px] border border-[#ddd6cd] bg-white px-1">
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="type-h2 text-[#151515]">{vendor.name}</h1>

            <div className="mt-1 flex flex-wrap items-center gap-2 type-para ">
              <span className="inline-flex items-center gap-1">
                <FiStar className="fill-[#f4b400] text-[#f4b400]" />
                {vendor.rating}
              </span>
              <span>({vendor.reviewCount} reviews)</span>
            </div>

            <p className="mt-1 inline-flex items-center gap-1.5 type-para text-[#7a746d]">
              <FiMapPin className="text-[13px]" />
              {vendor.addressLine}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 cursor-pointer rounded-full border border-[#ddd6cd] px-4 py-1 text-[11px] font-medium "
          >
            <FiShare2 className="text-[12px]" />
            Share
          </button>
          <button
            type="button"
            className="rounded-full border border-[#ddd6cd] cursor-pointer px-4 py-1 text-[11px] font-medium "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
