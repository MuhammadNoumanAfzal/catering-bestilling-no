export default function CheckoutSection({ title, actions = null, children }) {
  return (
    <section className="rounded-[6px] bg-white p-3 shadow-[0_1px_4px_rgba(26,18,10,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-h3 text-[#2d2d2d]">{title}</p>
        {actions ? <div className="min-w-0">{actions}</div> : null}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
