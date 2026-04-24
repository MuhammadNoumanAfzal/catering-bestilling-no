export default function SettingsSection({ children, id, subtitle, title }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-[#e9e1d8] pb-6">
      <h2 className="type-h3">{title}</h2>
      {subtitle ? <p className="mt-3 type-para">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
