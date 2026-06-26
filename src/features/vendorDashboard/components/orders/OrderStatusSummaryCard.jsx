export default function OrderStatusSummaryCard({ label, value }) {
  return (
    <article className="rounded-[24px] border border-[#eadfd5] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] px-5 py-5 text-center shadow-[0_16px_32px_rgba(33,20,10,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a07b66]">
        {label}
      </p>
      <p className="mt-3 text-[2rem] font-extrabold leading-none text-[#222222]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#6d665f]">
        Snapshot from your latest order activity.
      </p>
    </article>
  );
}
