export default function SettingsField({
  id,
  label,
  onChange,
  placeholder,
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
        placeholder={placeholder}
        className="type-para h-10 w-full rounded-[4px] border border-[#d9d1c8] bg-white px-3 text-[#1f1f1f] outline-none placeholder:text-[#b4aca4]"
      />
    </label>
  );
}
