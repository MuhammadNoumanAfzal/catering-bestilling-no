export default function AddressField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="type-para mb-2 block text-[#8a8279]">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-subpara h-10 w-full rounded-[10px] border border-[#dad2ca] bg-white px-3 text-[#2d2d2d] outline-none placeholder:text-[#b2aaa1]"
      />
    </label>
  );
}
