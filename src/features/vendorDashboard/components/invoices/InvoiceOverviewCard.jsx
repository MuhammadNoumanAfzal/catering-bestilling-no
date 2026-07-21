import { FiActivity, FiClock, FiDollarSign, FiFileText } from "react-icons/fi";

const iconMap = {
  "Total Spent": FiDollarSign,
  "This Month": FiActivity,
  "Pending Amount": FiClock,
  "Overdue Amount": FiFileText,
};

export default function InvoiceOverviewCard({ label, value }) {
  const Icon = iconMap[label] || FiFileText;

  return (
    <article className="relative overflow-hidden rounded-[22px] border border-[#e7ddd4] bg-[linear-gradient(180deg,#fffefd_0%,#fff7f1_100%)] p-4 shadow-[0_12px_28px_rgba(30,30,30,0.06)]">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#fff2e8] blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9a8679]">
            {label}
          </p>
          <p className="mt-3 text-[1.9rem] font-extrabold leading-none text-[#1f1f1f]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff3ec] text-[#cf5c2f] shadow-[0_8px_18px_rgba(207,92,47,0.14)]">
          <Icon className="text-[22px]" />
        </div>
      </div>
    </article>
  );
}
