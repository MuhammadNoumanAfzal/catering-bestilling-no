import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

function IncludedMenuRow({ description, image, label }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((current) => !current)}
      className="flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <img
          src={image}
          alt={label}
          className="h-11 w-16 rounded-[6px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-[#1b1713]">
            {label}
          </span>
          {isOpen && description ? (
            <span className="mt-1 block text-[12px] leading-5 text-[#6f655d]">
              {description}
            </span>
          ) : null}
        </div>
      </div>
      <FiChevronDown
        className={`shrink-0 text-[16px] text-[#6f655d] transition ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export default function MenuIncludedSection({
  vendorSlug,
  menuItem,
  includedMenuItems,
}) {
  return (
    <div className="mt-6 rounded-[16px] border border-[#e8ddd2] bg-white p-4">
      <h2 className="text-[18px] font-semibold text-[#1c1713]">
        What&apos;s included in this menu
      </h2>
      <div className="mt-4 border-t border-[#ece4dc]">
        {includedMenuItems.map((includedItem) => (
          <IncludedMenuRow
            key={includedItem.label}
            description={includedItem.description}
            image={includedItem.image}
            label={includedItem.label}
          />
        ))}
      </div>
      <Link
        to={`/vendor/${vendorSlug}`}
        className="mt-3 inline-flex cursor-pointer text-[15px] font-medium text-[#1d1713]"
      >
        View Full Menu details..
      </Link>

      <div className="mt-5 border-t border-[#ece4dc] pt-4">
        <div className="max-w-[340px] rounded-[10px] bg-[#f2f2f2] px-4 py-3">
          <p className="text-[18px] font-semibold text-[#1c1713]">
            Minimum Order Requirement
          </p>
          <p className="mt-2 text-[14px] text-[#3c322c]">
            Minimum order required:{" "}
            <span className="font-semibold">{menuItem.serves} Persons</span>
          </p>
        </div>
      </div>
    </div>
  );
}
