import { FiX } from "react-icons/fi";

export default function SelectedFilterChip({
  label,
  onRemove,
  tone = "default",
}) {
  const toneClassName =
    tone === "highlight"
      ? "border-[#bfe5af] bg-[#d8f1ca] text-[#1f1f1f]"
      : "border-[#e2dfda] bg-[#f3f1ee] text-[#1f1f1f]";

  return (
    <button
      type="button"
      onClick={onRemove}
      className={`type-subpara inline-flex h-9 items-center gap-2 rounded-[10px] border px-3 transition hover:opacity-90 ${toneClassName}`}
    >
      <span>{label}</span>
      <FiX className="text-[14px]" />
    </button>
  );
}
