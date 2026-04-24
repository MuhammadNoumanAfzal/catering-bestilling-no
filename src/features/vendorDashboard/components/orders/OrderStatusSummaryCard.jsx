export default function OrderStatusSummaryCard({ label, value }) {
  return (
    <article className="rounded-[18px] border border-[#d9d1c8] bg-white px-6 py-5 text-center shadow-[0_8px_20px_rgba(30,30,30,0.04)]">
      <p className="text-[2rem] font-extrabold leading-none text-[#222222]">
        {value}
      </p>
      <p className="mt-2 type-para text-[#6d665f]">{label}</p>
    </article>
  );
}
