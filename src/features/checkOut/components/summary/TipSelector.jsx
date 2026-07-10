import { TIP_OPTIONS } from "./checkoutSummaryUtils";

export default function TipSelector({
  selectedTipRate,
  customTipAmount,
  onSelect,
}) {
  function handleOptionClick(optionValue) {
    if (selectedTipRate === optionValue) {
      onSelect(null, optionValue === "other" ? "" : undefined);
      return;
    }

    onSelect(optionValue);
  }

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
            onClick={() => handleOptionClick(option.value)}
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

      {selectedTipRate === "other" && (
        <div className="mt-3 max-w-[220px]">
          <label className="block text-[12px] font-medium text-[#8b8580]">
            Enter custom tip amount (NOK)
          </label>
          <div className="relative mt-1.5 rounded-[6px] shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-[13px] text-[#8b8580]">NOK</span>
            </div>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={customTipAmount ?? ""}
              onChange={(event) => onSelect("other", event.target.value)}
              className="block w-full rounded-[6px] border border-[#ddd5cc] py-2 pl-12 pr-3 text-[14px] text-[#2c2c2c] placeholder:text-[#a49b92] focus:border-[#cf6e38] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
