export default function SettingsCheckboxField({
  checked,
  description,
  id,
  label,
  onChange,
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2 rounded-[8px] py-1"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 cursor-pointer rounded-[2px] border border-[#cfc7be] accent-[#cf5c2f]"
      />
      <span>
        <span className="type-h6 block text-[#1f1f1f]">{label}</span>
        {description ? (
          <span className="mt-0.5 block type-para leading-3 text-[#aaa29a]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
