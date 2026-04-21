import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

const TABLEWARE_FIELDS = [
  { key: "napkins", label: "Napkins" },
  { key: "utensils", label: "Utensils" },
  { key: "platesBowls", label: "Plates/bowls" },
];

export function getDefaultTableware() {
  return {
    napkins: true,
    utensils: true,
    platesBowls: false,
    instructions: "",
  };
}

export function getTablewareSummaryText(tableware) {
  const labels = TABLEWARE_FIELDS.filter((field) => tableware?.[field.key]).map(
    (field) => field.label.toLowerCase(),
  );

  return labels.length > 0
    ? `Include: ${labels.join(", ")}`
    : "No tableware selected";
}

export function getSelectedTablewareCount(tableware) {
  return TABLEWARE_FIELDS.filter((field) => tableware?.[field.key]).length;
}

export default function TablewareModal({
  isOpen,
  initialValue,
  onClose,
  onSave,
}) {
  const [draftValue, setDraftValue] = useState(initialValue);

  useEffect(() => {
    setDraftValue(initialValue);
  }, [initialValue]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-4">
      <div className="relative flex max-h-[min(92vh,720px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 cursor-pointer text-[#2b2b2b]"
          aria-label="Close tableware popup"
        >
          <FiX className="text-[18px]" />
        </button>

        <div className="overflow-y-auto px-6 py-6 sm:px-7">
          <h2 className="type-h3 text-[#1f1f1f]">Tableware</h2>
          <p className="mt-2 max-w-[460px] text-[16px] leading-7 text-[#3e3a36]">
            Need some tableware for your event? Add them below, and we&apos;ll
            let the caterer know. The quantity they send will be based on your
            headcount.
          </p>

          <div className="mt-6">
            <p className="type-h5 text-[#1f1f1f]">Please tell us what you need</p>
            <div className="mt-3 space-y-2.5">
              {TABLEWARE_FIELDS.map((field) => (
                <label
                  key={field.key}
                  className="flex cursor-pointer items-center gap-3 text-[16px] text-[#2d2d2d]"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(draftValue?.[field.key])}
                    onChange={(event) =>
                      setDraftValue((current) => ({
                        ...current,
                        [field.key]: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 cursor-pointer rounded-[4px] border border-[#cf6e38] accent-[#cf6e38]"
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="type-h5 underline text-[#1f1f1f]">
              Add special instructions
            </p>
            <textarea
              value={draftValue?.instructions ?? ""}
              onChange={(event) =>
                setDraftValue((current) => ({
                  ...current,
                  instructions: event.target.value,
                }))
              }
              placeholder="Let the restaurant know of any allergies or preparation instructions."
              className="mt-3 min-h-[112px] w-full rounded-[16px] border border-[#d7cdc4] px-4 py-3 text-[16px] text-[#2d2d2d] outline-none placeholder:text-[#a49b92]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#eee7df] px-6 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="type-h6 cursor-pointer rounded-full border border-[#1f1f1f] px-8 py-3 text-[#1f1f1f]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draftValue)}
            className="type-h6 cursor-pointer rounded-full bg-[#cf6e38] px-8 py-3 text-white"
          >
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
}
