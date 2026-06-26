export default function DashboardPageHero({
  eyebrow = "Workspace",
  title,
  description,
  stats = [],
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#ecdccd] bg-[radial-gradient(circle_at_top_right,rgba(255,228,210,0.9),transparent_28%),linear-gradient(135deg,#fff8f1_0%,#fffdfb_46%,#fdf2e9_100%)] p-4 shadow-[0_18px_36px_rgba(55,30,15,0.08)] sm:p-5 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)] lg:items-start">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#b06f4d]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#191919] sm:text-[34px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[#5f5a54] sm:text-[15px] sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {stats.slice(0, 4).map((stat) => (
              <div
                key={stat.label}
                className="rounded-[22px] border border-[#f0ded1] bg-white/80 px-4 py-3.5 shadow-[0_10px_20px_rgba(53,29,14,0.06)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a06f55]">
                  {stat.label}
                </p>
                <p className="mt-2 text-[22px] font-bold leading-none text-[#1f1f1f] sm:text-[24px]">
                  {stat.value}
                </p>
                {stat.note ? (
                  <p className="mt-1 text-[11px] leading-5 text-[#776a61] sm:text-xs">
                    {stat.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
