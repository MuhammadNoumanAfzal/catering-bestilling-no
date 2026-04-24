import { Link } from "react-router-dom";
import { FiArrowRight, FiHeadphones } from "react-icons/fi";

const heroStats = [
  { label: "Average reply", value: "< 1 day" },
  { label: "Coverage", value: "Office + private" },
  { label: "Support hours", value: "08:00-18:00" },
];

export default function ContactHeroContent() {
  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#ecd9cb] bg-white/85 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b56237] shadow-[0_10px_26px_rgba(94,54,24,0.08)] backdrop-blur">
        <FiHeadphones className="text-[15px]" />
        Contact & Event Support
      </div>

      <h1 className="mt-6 max-w-2xl font-serif text-[42px] leading-[1.02] text-[#1f1a16] sm:text-[56px] lg:text-[68px]">
        Planning lunch for ten or catering for two hundred?
      </h1>

      <p className="mt-5 max-w-xl text-[17px] leading-8 text-[#5d554f] sm:text-[18px]">
        Reach a team that understands food logistics, vendor coordination, and
        polished event delivery. We help turn vague requests into clear plans
        quickly.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="mailto:support@lunsjavtale.no"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c86135] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_18px_34px_rgba(200,97,53,0.24)] transition hover:bg-[#b5542b]"
        >
          Email support
          <FiArrowRight className="text-[16px]" />
        </a>
        <Link
          to="/browse/food-type"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dccbbd] bg-white/90 px-6 py-3 text-[15px] font-semibold text-[#2a2520] transition hover:border-[#c86135] hover:text-[#c86135]"
        >
          Explore menus
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[22px] border border-[#eadccf] bg-white/88 p-4 shadow-[0_16px_32px_rgba(43,31,20,0.06)] backdrop-blur"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#af7d5f]">
              {stat.label}
            </p>
            <p className="mt-2 text-[26px] font-semibold text-[#1e1a16]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
