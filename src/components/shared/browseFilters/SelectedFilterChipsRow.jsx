import SelectedFilterChip from "./SelectedFilterChip";

export default function SelectedFilterChipsRow({ chips, onClearAll }) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#efe9e2] pt-3">
      {chips.map((chip) => (
        <SelectedFilterChip
          key={chip.id}
          label={chip.label}
          onRemove={chip.onRemove}
          tone={chip.tone}
        />
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="type-subpara inline-flex h-9 items-center rounded-full border border-[#c9c4be] bg-white px-4 text-[#1f1f1f] transition hover:bg-[#f7f2ec]"
      >
        Clear all filters
      </button>
    </div>
  );
}
