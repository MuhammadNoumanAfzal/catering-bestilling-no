import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { X } from "lucide-react";

function InfoRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="mt-1.5 text-[12px] leading-5 text-[#6f655d]">
      <span className="font-semibold text-[#3b3029]">{label}:</span>{" "}
      <span>{value}</span>
    </div>
  );
}

function IncludedMenuRow({ allergens, description, image, label }) {
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
          {isOpen ? (
            <div className="mt-1">
              <InfoRow label="Description" value={description} />
              <InfoRow label="Allergens" value={allergens} />
            </div>
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

function IncludedMenuDetailsModal({ includedMenuItems, isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 px-4 py-6 backdrop-blur-[2px]">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex max-h-[calc(100vh-3rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-[#e8ddd2] bg-[#fffaf6] shadow-[0_24px_60px_rgba(24,16,10,0.18)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#ece4dc] px-5 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">
                Full Menu Details
              </p>
              <h3 className="mt-2 text-[24px] font-semibold leading-8 text-[#1c1713]">
                What&apos;s included in this menu
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e5d8cf] bg-white text-[#6f655d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef] hover:text-[#cf6e38]"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto px-5 py-4">
            <div className="space-y-3">
              {includedMenuItems.map((includedItem) => (
                <div
                  key={`${includedItem.label}-${includedItem.description}`}
                  className="rounded-[18px] border border-[#ece4dc] bg-white p-4 shadow-[0_10px_24px_rgba(55,34,19,0.05)]"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={includedItem.image}
                      alt={includedItem.label}
                      className="h-20 w-24 rounded-[10px] object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-[17px] font-semibold text-[#1b1713]">
                        {includedItem.label}
                      </h4>

                      {includedItem.description ? (
                        <p className="mt-2 text-[14px] leading-6 text-[#534740]">
                          {includedItem.description}
                        </p>
                      ) : null}

                      {includedItem.allergens ? (
                        <p className="mt-3 text-[13px] leading-5 text-[#6f655d]">
                          <span className="font-semibold text-[#3b3029]">Allergens:</span>{" "}
                          {includedItem.allergens}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuIncludedSection({
  menuItem,
  includedMenuItems,
}) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  if (!includedMenuItems || includedMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[16px] border border-[#e8ddd2] bg-white p-4">
      <h2 className="text-[18px] font-semibold text-[#1c1713]">
        What&apos;s included in this menu
      </h2>
      <div className="mt-4 border-t border-[#ece4dc]">
        {includedMenuItems.map((includedItem) => (
          <IncludedMenuRow
            key={includedItem.label}
            allergens={includedItem.allergens}
            description={includedItem.description}
            image={includedItem.image}
            label={includedItem.label}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setIsDetailsModalOpen(true)}
        className="mt-3 inline-flex cursor-pointer text-[15px] font-medium text-[#1d1713]"
      >
        View Full Menu details..
      </button>

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

      <IncludedMenuDetailsModal
        includedMenuItems={includedMenuItems}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}
