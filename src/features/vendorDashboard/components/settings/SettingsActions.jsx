export default function SettingsActions({ onReset }) {
  return (
    <section className="space-y-3">
      <h2 className="type-h4 text-[#191919]">Additional actions</h2>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="type-h6 w-full cursor-pointer rounded-[8px] bg-[#cf2e2e] px-4 py-2.5 text-white transition hover:bg-[#b92626] sm:w-auto"
        >
          Delete account
        </button>
      </div>
    </section>
  );
}
