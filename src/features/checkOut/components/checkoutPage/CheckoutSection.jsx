export default function CheckoutSection({ title, children }) {
  return (
    <section className="rounded-[6px] bg-white p-3 shadow-[0_1px_4px_rgba(26,18,10,0.08)]">
      <p className="type-h3 text-[#2d2d2d]">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}
