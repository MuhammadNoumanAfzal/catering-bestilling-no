function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded-full bg-[#f2e7de] ${className}`.trim()} />;
}

export default function DashboardLoadingState({
  title = "Loading data",
  description = "Fetching the latest records and preparing your view.",
  rows = 5,
  columns = 6,
}) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <div className="relative bg-[radial-gradient(circle_at_top,rgba(233,122,63,0.10),transparent_46%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] px-5 py-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(229,131,72,0.45),transparent)]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit items-center rounded-full border border-[#f1d7c8] bg-[#fff3ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#cc6d39]">Syncing data</span>
            <div>
              <h2 className="text-[20px] font-extrabold text-[#211711]">{title}</h2>
              <p className="mt-1 max-w-[520px] text-[14px] leading-6 text-[#7d6f65]">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#f1ddd0] bg-white/90 px-3 py-2 shadow-[0_6px_20px_rgba(58,35,21,0.06)]">
            <span className="relative inline-flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#de7b44] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#cf6e38]" /></span>
            <span className="text-[12px] font-semibold text-[#6e6158]">Updating live results</span>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="grid gap-3 border-b border-[#efe2d8] px-5 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => <SkeletonLine key={index} className={`h-3.5 ${index === columns - 1 ? "w-12" : index % 3 === 0 ? "w-20" : "w-24"}`} />)}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3 border-b border-[#f2e7de] px-5 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, columnIndex) => <div key={columnIndex}><SkeletonLine className={`h-3.5 ${columnIndex % 3 === 0 ? "w-24" : columnIndex % 3 === 1 ? "w-32" : "w-20"}`} /><SkeletonLine className={`mt-2 h-3 ${columnIndex % 2 === 0 ? "w-16" : "w-24"}`} /></div>)}
          </div>
        ))}
      </div>
    </section>
  );
}
