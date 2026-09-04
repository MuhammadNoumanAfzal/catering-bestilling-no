export default function CheckoutSection({ title, actions = null, children }) {
  return (
    <section className="border-b border-[#eee7e0] pb-4 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#2d2d2d]">{title}</p>
        {actions ? <div className="min-w-0">{actions}</div> : null}
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}
