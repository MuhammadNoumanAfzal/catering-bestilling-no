export default function SupportAudienceSelector({
  value,
  onChange,
  options,
}) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      {options.map((option) => (
        <label
          key={option.value}
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#4e4640]"
        >
          <span
            className={[
              "flex h-4 w-4 items-center justify-center rounded-full border transition",
              value === option.value
                ? "border-[#cf6e38]"
                : "border-[#cfc2b7] bg-white",
            ].join(" ")}
          >
            <span
              className={[
                "h-2 w-2 rounded-full transition",
                value === option.value ? "bg-[#cf6e38]" : "bg-transparent",
              ].join(" ")}
            />
          </span>

          <input
            type="radio"
            name="support-audience"
            value={option.value}
            checked={value === option.value}
            onChange={(event) => onChange(event.target.value)}
            className="sr-only"
          />

          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
