import { FiHelpCircle } from "react-icons/fi";

export default function ContactFaqSection({ items }) {
  return (
    <article className="rounded-[30px] border border-[#eadccf] bg-white p-6 shadow-[0_24px_54px_rgba(43,31,20,0.08)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#c86135]">
          <FiHelpCircle className="text-[22px]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#b77754]">
            FAQ
          </p>
          <h2 className="mt-1 text-[32px] font-semibold leading-tight text-[#1f1a16]">
            Quick answers before you send
          </h2>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.question}
            className="rounded-[22px] border border-[#eee3d8] bg-[#fcf8f4] p-5"
          >
            <h3 className="text-[18px] font-semibold text-[#231e1a]">
              {item.question}
            </h3>
            <p className="mt-2 text-[15px] leading-7 text-[#5e5650]">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
