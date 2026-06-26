export default function SettingsSection({ children, id, subtitle, title }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[28px] border border-[#e8ddd2] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f3_100%)] p-5 shadow-[0_16px_34px_rgba(33,20,10,0.06)]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b07a5f]">
        Settings block
      </p>
      <h2 className="mt-2 type-h3 text-[#201814]">{title}</h2>
      {subtitle ? <p className="mt-3 type-para text-[#685f57]">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
