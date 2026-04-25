import { TIP_OPTIONS } from "./checkoutSummary.utils";

export default function TipSelector({ selectedTipRate, onSelect }) {
  return (
    <div className="mt-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9a8f83]">
        Add a tip
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {TIP_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`min-w-[60px] cursor-pointer rounded-full border px-3 py-2 text-[13px] font-semibold transition ${
              selectedTipRate === option.value
                ? "border-[#cf6e38] bg-[#fff3ec] text-[#cf6e38]"
                : "border-[#ddd5cc] bg-white text-[#4f4a45]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
