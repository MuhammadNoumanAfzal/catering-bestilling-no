export default function DashboardPageHero({
  eyebrow = "Workspace",
  title,
  description,
  stats = [],
}) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[#ecdccd] bg-[radial-gradient(circle_at_top_right,rgba(255,228,210,0.9),transparent_28%),linear-gradient(135deg,#fff8f1_0%,#fffdfb_46%,#fdf2e9_100%)] p-5 shadow-[0_22px_44px_rgba(55,30,15,0.08)] sm:p-6 lg:p-7">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-end">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#b06f4d]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.04em] text-[#191919] sm:text-[40px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5f5a54] sm:text-[16px]">
              {description}
            </p>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {stats.slice(0, 4).map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-[#f0ded1] bg-white/80 px-4 py-4 shadow-[0_12px_24px_rgba(53,29,14,0.06)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a06f55]">
                  {stat.label}
                </p>
                <p className="mt-2 text-[26px] font-bold text-[#1f1f1f]">
                  {stat.value}
                </p>
                {stat.note ? (
                  <p className="mt-1 text-xs leading-5 text-[#776a61]">
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
