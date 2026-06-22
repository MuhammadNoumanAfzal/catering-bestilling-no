export default function SettingsActions({
  isDirty = false,
  isSaving = false,
  onReset,
  onSave,
}) {
  return (
    <section className="space-y-3">
      <h2 className="type-h4 text-[#191919]">Save changes</h2>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          className="type-h6 w-full cursor-pointer rounded-[8px] border border-[#d8cec5] bg-white px-4 py-2.5 text-[#2b2622] transition hover:bg-[#faf7f3] sm:w-auto"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="type-h6 w-full rounded-[8px] bg-[#cf6e38] px-5 py-2.5 text-white transition hover:bg-[#ba5f2e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </section>
  );
}
