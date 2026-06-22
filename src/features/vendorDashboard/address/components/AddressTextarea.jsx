export default function AddressTextarea({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="type-subpara mb-2 block text-[#8a8279]">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-subpara min-h-[100px] w-full rounded-[10px] border border-[#dad2ca] bg-white px-3 py-2 text-[#2d2d2d] outline-none placeholder:text-[#b2aaa1]"
      />
    </label>
  );
}
