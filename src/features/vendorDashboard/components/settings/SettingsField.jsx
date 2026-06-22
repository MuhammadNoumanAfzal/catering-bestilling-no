export default function SettingsField({
  disabled = false,
  id,
  label,
  onChange,
  placeholder,
  readOnly = false,
  type = "text",
  value,
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="type-para mb-2 block text-[#8b837b]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className="type-para h-10 w-full rounded-[4px] border border-[#d9d1c8] bg-white px-3 text-[#1f1f1f] outline-none placeholder:text-[#b4aca4] disabled:cursor-not-allowed disabled:bg-[#f5f1ed] disabled:text-[#80776e]"
      />
    </label>
  );
}
