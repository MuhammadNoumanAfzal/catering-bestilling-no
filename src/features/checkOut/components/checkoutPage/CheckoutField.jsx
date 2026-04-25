export default function CheckoutField({
  label,
  className = "",
  inputClassName = "",
  placeholder = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="type-h5 mb-3 block text-[#2d2d2d]">{label}</span>
      <input
        {...props}
        placeholder={placeholder}
        className={`type-para h-8 w-full rounded-[2px] border border-[#d9d1c7] bg-white px-2 text-[#2d2d2d] outline-none placeholder:text-[#a49b92] ${inputClassName}`}
      />
    </label>
  );
}
