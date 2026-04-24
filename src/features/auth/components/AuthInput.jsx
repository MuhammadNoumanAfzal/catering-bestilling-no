export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  readOnly = false,
  className = "",
  required = false,
}) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-2.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6d6259]">
          {label}
        </span>
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
        required={required}
        className={`type-para h-13 w-full rounded-[18px] border border-[#ddd3ca] bg-[#fffdfa] px-4 text-[#1d1a17] outline-none transition placeholder:text-[#b4aba2] focus:border-[#c85f33] focus:bg-white focus:ring-4 focus:ring-[#c85f33]/10 ${className}`}
      />
    </label>
  );
}
