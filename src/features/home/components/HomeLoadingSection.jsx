function SkeletonCard({ compact = false }) {
  return (
    <div className="animate-pulse">
      <div
        className={`rounded-[24px] bg-[#f3ece5] ${
          compact ? "h-[200px]" : "h-[260px]"
        }`}
      />
      <div className="mt-4 h-5 w-2/3 rounded-full bg-[#f3ece5]" />
      <div className="mt-2 h-4 w-1/2 rounded-full bg-[#f3ece5]" />
    </div>
  );
}

export default function HomeLoadingSection({
  title,
  compact = false,
  columnsClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}) {
  return (
    <section className="bg-white px-8 py-6 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="h-8 w-48 animate-pulse rounded-full bg-[#f3ece5]" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-[#f3ece5]" />
        </div>

        <div className={`grid gap-5 ${columnsClassName}`}>
          {Array.from({ length: compact ? 4 : 3 }, (_, index) => (
            <div key={`${title}-${index}`}>
              <SkeletonCard compact={compact} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
