export default function CheckoutField({
  label,
  className = "",
  inputClassName = "",
  helperText = "",
  placeholder = "",
  required = false,
  optional = false,
  error = "",
  optionalLabel = "Valgfritt",
  ...props
}) {
  const hasError = Boolean(error);

  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-[#2d2d2d]">
        <span>{label}</span>
        {required ? <span className="font-bold text-[#d92d20]">*</span> : null}
        {!required && optional ? (
          <span className="text-[11px] font-medium text-[#8b8177]">({optionalLabel})</span>
        ) : null}
      </span>
      <input
        {...props}
        placeholder={placeholder}
        aria-invalid={hasError ? "true" : undefined}
        className={`h-9 w-full rounded-[8px] border bg-[#fffdfa] px-3 text-[13px] text-[#2d2d2d] outline-none transition placeholder:text-[#a49b92] ${
          hasError
            ? "border-[#d92d20] focus:border-[#d92d20] focus:ring-2 focus:ring-[#d92d20]/10"
            : "border-[#ded6ce] focus:border-[#cf6e38] focus:ring-2 focus:ring-[#cf6e38]/10"
        } ${inputClassName}`}
      />
      {hasError ? (
        <span className="mt-1 block text-[11px] font-semibold leading-4 text-[#d92d20]">
          {error}
        </span>
      ) : helperText ? (
        <span className="mt-1 block text-[11px] leading-4 text-[#8b8177]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}