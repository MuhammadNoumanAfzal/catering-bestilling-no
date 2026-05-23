export default function SupportField({
  as = "input",
  children,
  className = "",
  label,
  ...props
}) {
  const Component = as;
  const isSelect = as === "select";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#2d2d2d]">
        {label}
      </span>
      <Component
        {...props}
        className={[
          "w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-sm text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]",
          as === "textarea" ? "min-h-[126px] py-3 resize-none" : "h-11",
          className,
        ].join(" ")}
      >
        {isSelect ? children : null}
      </Component>
      {isSelect ? null : children}
    </label>
  );
}
