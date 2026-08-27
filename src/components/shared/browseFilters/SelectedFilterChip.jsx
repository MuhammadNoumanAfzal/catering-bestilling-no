import { FiX } from "react-icons/fi";

export default function SelectedFilterChip({
  label,
  onRemove,
  tone = "default",
}) {
  const toneClassName =
    tone === "highlight"
      ? "border-[#f1d29a] bg-[#fff4da] text-[#8b5a12]"
      : "border-[#f0d7c6] bg-[#fff3ec] text-[#6d4a35]";

  return (
    <button
      type="button"
      onClick={onRemove}
      className={`type-subpara inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 transition hover:opacity-90 ${toneClassName}`}
    >
      <span>{label}</span>
      <FiX className="text-[14px]" />
    </button>
  );
}
