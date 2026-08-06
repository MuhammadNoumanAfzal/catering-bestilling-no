import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((current) => !current)}
      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[18px] border border-transparent px-3 py-3 text-left transition hover:border-[#ece1d7] hover:bg-[#fff9f4]"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <img
          src={image}
          alt={label}
          className="h-12 w-16 rounded-[10px] object-cover shadow-[0_8px_18px_rgba(55,34,19,0.08)]"
        />
        <div className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-[#1b1713]">
            {label}
          </span>
          {isOpen ? (
            <div className="mt-1">
              <InfoRow label={t("menu.descriptionLabel")} value={description} />
              <InfoRow label={t("menu.allergensLabel")} value={allergens} />
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
  const { t } = useTranslation();
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
                {t("menu.fullMenuDetails")}
              </p>
              <h3 className="mt-2 text-[24px] font-semibold leading-8 text-[#1c1713]">
                {t("menu.whatsIncludedTitle")}
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
                          <span className="font-semibold text-[#3b3029]">{t("menu.allergensLabel")}:</span>{" "}
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
  const { t } = useTranslation();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  if (!includedMenuItems || includedMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[28px] border border-[#eadfd5] bg-white p-4 shadow-[0_18px_40px_rgba(55,34,19,0.05)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b37a59]">
            {t("menu.includedInOrder")}
          </p>
          <h2 className="mt-2 text-[22px] font-semibold text-[#1c1713]">
            {t("menu.whatsIncludedTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#6b5d53]">
            {t("menu.includedIntro")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsDetailsModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#e1d4c8] bg-[#fff8f2] px-4 py-2 text-[14px] font-semibold text-[#2b221d] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
        >
          {t("menu.viewFullMenu")}
        </button>
      </div>

      <div className="mt-5 rounded-[22px] border border-[#efe4da] bg-[#fffdfa] p-3 sm:p-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8d7768]">
          {t("menu.quickPreview")}
        </h3>
        <div className="mt-3 border-t border-[#ece4dc] pt-2">
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
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[20px] border border-[#efe4da] bg-[linear-gradient(180deg,#fffdfb_0%,#fff6ee_100%)] p-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8d7768]">
            {t("menu.orderingNote")}
          </p>
          <p className="mt-2 text-[14px] leading-7 text-[#4d433c]">
            {t("menu.orderingNoteText")}
          </p>
        </div>

        <div className="rounded-[20px] border border-[#eddccf] bg-[#fff4ea] p-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9e6b4f]">
            {t("menu.minimumOrder")}
          </p>
          <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-[#1c1713]">
            {t("menu.persons", { count: menuItem.serves })}
          </p>
          <p className="mt-2 text-[14px] leading-6 text-[#5e5046]">
            {t("menu.minimumOrderText")}
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
