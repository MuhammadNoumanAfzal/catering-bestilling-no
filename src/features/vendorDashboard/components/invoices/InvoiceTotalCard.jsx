export default function InvoiceTotalCard({ label, value }) {
  return (
    <article className="rounded-[18px] border border-[#ece2d8] bg-[#fffdfa] px-4 py-3">
      <p className="type-h6 font-semibold uppercase tracking-[0.04em]">
        {label}
      </p>
      <p className="mt-1 type-h4 font-extrabold">{value}</p>
    </article>
  );
}
