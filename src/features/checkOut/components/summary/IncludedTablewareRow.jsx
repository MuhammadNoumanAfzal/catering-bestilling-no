import { FiPackage } from "react-icons/fi";
import {
  getSelectedTablewareCount,
  getTablewareSummaryText,
} from "../../../../components/shared/TablewareModal";

export default function IncludedTablewareRow({ tableware, onEdit }) {
  const selectedCount = getSelectedTablewareCount(tableware);
  const summaryText = getTablewareSummaryText(tableware);

  return (
    <div className="rounded-[10px] border border-[#eee7df] bg-[#faf8f5] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1ea] text-[#d46331]">
            <FiPackage className="text-[14px]" />
          </div>
          <div>
            <p className="type-para font-semibold text-[#252525]">
              {selectedCount} Tableware
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[#8b8580]">
              {summaryText}
            </p>
          </div>
        </div>

        <p className="type-para font-semibold text-[#252525]">$0.00</p>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="type-para cursor-pointer text-[#4f7cff]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
