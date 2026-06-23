export default function HomeStatusBanner({
  message,
  tone = "error",
  actionLabel,
  onAction,
}) {
  const toneClasses =
    tone === "info"
      ? "border-[#e6ddd5] bg-[#fcfaf8] text-[#5f564f]"
      : "border-[#f0c4b0] bg-[#fff4ef] text-[#6d3d2b]";

  return (
    <section className="bg-white px-8 pt-6 sm:px-10 lg:px-20">
      <div
        className={`mx-auto flex w-full max-w-7xl flex-col gap-3 rounded-[24px] border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${toneClasses}`}
      >
        <p className="text-sm font-medium">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-current px-4 py-2 text-sm font-semibold transition hover:opacity-80"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
