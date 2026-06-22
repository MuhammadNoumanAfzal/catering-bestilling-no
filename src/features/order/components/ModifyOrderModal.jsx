import { useMemo, useState } from "react";
import {
  createInitialModifyOrderFormState,
  MODIFY_ORDER_PLACEHOLDERS,
} from "../constants/modifyOrderForm";

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function ModifyOrderModal({
  initialValue,
  onCancel,
  onSave,
}) {
  const [formState, setFormState] = useState(() =>
    createInitialModifyOrderFormState(initialValue),
  );

  const formattedDate = useMemo(
    () => formatDisplayDate(formState.date),
    [formState.date],
  );

  const updateField = (key, value) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a1410]/50 px-4 py-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[620px] rounded-[20px] bg-white shadow-[0_24px_80px_rgba(20,15,10,0.22)]">
        <div className="border-b border-[#eee4da] px-5 py-3 sm:px-6">
          <h2 className="type-h3 text-[#17120f]">Request Change</h2>
          <p className="mt-0.5 text-[12px] text-[#7a7067]">
            Let the vendor know you need to adjust this order.
          </p>
        </div>

        <div className="space-y-3 px-5 py-4 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                Date
              </span>
              <input
                type="date"
                value={formState.date}
                onChange={(event) => updateField("date", event.target.value)}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
              {formattedDate ? (
                <p className="mt-1 text-[11px] text-[#8b8177]">
                  Selected date: {formattedDate}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                Time
              </span>
              <input
                type="time"
                value={formState.time}
                onChange={(event) => updateField("time", event.target.value)}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="type-subpara mb-2 block text-[#2d2d2d]">
              Address
            </span>
            <input
              value={formState.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder={MODIFY_ORDER_PLACEHOLDERS.address}
              className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                Person Count
              </span>
              <div className="inline-flex h-10 w-full items-center overflow-hidden rounded-[10px] border border-[#dad1c8] bg-white">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "personCount",
                      Math.max(1, Number(formState.personCount) - 1),
                    )
                  }
                  className="h-full w-11 border-r border-[#dad1c8] text-[18px] text-[#322d29] transition hover:bg-[#faf5f0]"
                >
                  -
                </button>
                <span className="flex-1 text-center text-[15px] font-semibold text-[#1f1a16]">
                  {formState.personCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateField("personCount", Number(formState.personCount) + 1)
                  }
                  className="h-full w-11 border-l border-[#dad1c8] text-[18px] text-[#322d29] transition hover:bg-[#faf5f0]"
                >
                  +
                </button>
              </div>
            </label>

            <label className="block min-w-0">
              <span className="type-subpara mb-2 block break-words text-[#2d2d2d]">
                Apartment/Floor(Optional)
              </span>
              <input
                value={formState.addressLine2}
                onChange={(event) =>
                  updateField("addressLine2", event.target.value)
                }
                placeholder={MODIFY_ORDER_PLACEHOLDERS.addressLine2}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                City
              </span>
              <input
                value={formState.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder={MODIFY_ORDER_PLACEHOLDERS.city}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>

            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                Postal Code
              </span>
              <input
                value={formState.postalCode}
                onChange={(event) =>
                  updateField("postalCode", event.target.value)
                }
                placeholder={MODIFY_ORDER_PLACEHOLDERS.postalCode}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="type-subpara mb-2 block text-[#2d2d2d]">
              Additional Details
            </span>
            <textarea
              value={formState.additionalDetails}
              onChange={(event) =>
                updateField("additionalDetails", event.target.value)
              }
              placeholder={MODIFY_ORDER_PLACEHOLDERS.additionalDetails}
              className="min-h-[88px] w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 py-2.5 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#eee4da] px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] border border-[#d9cec4] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#2b2622] transition hover:bg-[#faf7f3]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                address: formState.address.trim(),
                addressLine2: formState.addressLine2.trim(),
                city: formState.city.trim(),
                postalCode: formState.postalCode.trim(),
                date: formState.date,
                time: formState.time,
                personCount: Math.max(1, Number(formState.personCount) || 1),
                additionalDetails: formState.additionalDetails.trim(),
              })
            }
            className="rounded-[10px] bg-[#cf6e38] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#bb602d]"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}
