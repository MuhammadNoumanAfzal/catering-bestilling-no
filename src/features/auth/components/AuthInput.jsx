export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  readOnly = false,
  className = "",
}) {
  return (
    <label className="block">
      {label ? (
        <span className="type-h5 mb-2 block text-black">{label}</span>
      ) : (
        <span className="mb-2 block h-[17px]" aria-hidden="true" />
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`type-para w-full rounded-xl border border-[#ddd6ce] bg-white px-4 py-2 text-[#1d1a17] outline-none transition placeholder:text-[#b4aba2] focus:border-[#c85f33] focus:ring-2 focus:ring-[#c85f33]/15 ${className}`}
      />
    </label>
  );
}
