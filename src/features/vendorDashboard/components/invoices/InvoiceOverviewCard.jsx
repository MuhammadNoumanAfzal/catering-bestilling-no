import { FiFileText } from "react-icons/fi";

export default function InvoiceOverviewCard({ label, value }) {
  return (
    <article className="rounded-[18px] border border-[#ddd5cd] bg-white p-4 shadow-[0_8px_20px_rgba(30,30,30,0.04)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff3ec] text-[#cf5c2f]">
        <FiFileText className="text-[28px]" />
      </div>
      <p className="mt-4 text-[2rem] font-extrabold leading-none text-[#1f1f1f]">
        {value}
      </p>
      <p className="mt-2 type-para font-semibold">{label}</p>
    </article>
  );
}
