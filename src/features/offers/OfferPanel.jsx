export default function OfferPanel({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-[#e6ddd4] bg-white p-5 text-[#1a1410] max-[500px]:p-4 ${className}`}>
      <h2 className="mb-4 text-[22px] font-semibold leading-tight tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
