export default function AddressPageActions({
  isDirty = false,
  isSaving = false,
  onReset,
  onSave,
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onReset}
        className="type-h6 w-full cursor-pointer rounded-full border border-[#cfc6bd] bg-white px-5 py-2.5 text-[#1f1f1f] transition hover:bg-[#f8f4ef] sm:w-auto"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className="type-h6 w-full rounded-full bg-[#cf5c2f] px-5 py-2.5 text-white transition hover:bg-[#b95127] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSaving ? "Saving..." : "Save addresses"}
      </button>
    </div>
  );
}
