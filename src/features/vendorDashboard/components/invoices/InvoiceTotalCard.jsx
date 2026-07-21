export default function InvoiceTotalCard({ label, value }) {
  return (
    <article className="rounded-[20px] border border-[#f0e5db] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f3_100%)] px-4 py-3.5 shadow-[0_8px_18px_rgba(35,26,20,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9b8577]">
        {label}
      </p>
      <p className="mt-2 text-[22px] font-extrabold leading-none text-[#201814]">
        {value}
      </p>
    </article>
  );
}
