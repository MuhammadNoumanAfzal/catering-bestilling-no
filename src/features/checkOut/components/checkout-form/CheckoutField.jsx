export default function CheckoutField({
  label,
  className = "",
  inputClassName = "",
  helperText = "",
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
      {helperText ? (
        <span className="mt-2 block text-[12px] leading-5 text-[#8b8177]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
