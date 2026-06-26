import { FiFileText } from "react-icons/fi";

export default function InvoiceOverviewCard({ label, value }) {
  return (
    <article className="rounded-[24px] border border-[#eadfd5] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] p-4 shadow-[0_16px_32px_rgba(33,20,10,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#cf5c2f] shadow-[0_8px_18px_rgba(207,92,47,0.12)]">
        <FiFileText className="text-[24px]" />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a07b66]">
        {label}
      </p>
      <p className="mt-3 text-[2rem] font-extrabold leading-none text-[#1f1f1f]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#6d665f]">Real-time billing overview.</p>
    </article>
  );
}
