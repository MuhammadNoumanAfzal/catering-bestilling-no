export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  badge = "Account",
}) {
  return (
    <section className="w-full rounded-[32px] border border-[#eadfd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(252,246,240,0.94))] p-6 shadow-[0_26px_70px_rgba(49,31,17,0.12)] sm:p-8">
      <div className="mb-5">
        <div className="inline-flex items-center rounded-full border border-[#efd9c8] bg-[#fff5ec] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c76838]">
          {badge}
        </div>
        <h1 className="mt-3 font-serif text-[30px] leading-[1.04] text-[#1d1a17] sm:text-[36px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="type-para mt-2 max-w-xl text-[#746b64]">{subtitle}</p>
        ) : null}
      </div>

      {children}

      {footer ? <div className="mt-6 border-t border-[#efe4da] pt-5">{footer}</div> : null}
    </section>
  );
}
