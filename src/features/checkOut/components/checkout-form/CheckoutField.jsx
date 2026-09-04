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
      <span className="mb-1.5 block text-[13px] font-medium text-[#2d2d2d]">{label}</span>
      <input
        {...props}
        placeholder={placeholder}
        className={`h-9 w-full rounded-[8px] border border-[#ded6ce] bg-[#fffdfa] px-3 text-[13px] text-[#2d2d2d] outline-none transition focus:border-[#cf6e38] focus:ring-2 focus:ring-[#cf6e38]/10 placeholder:text-[#a49b92] ${inputClassName}`}
      />
      {helperText ? (
        <span className="mt-1 block text-[11px] leading-4 text-[#8b8177]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
