import { formatCheckoutAddressPreview } from "../../utils/checkoutAddress";

export default function CheckoutAddressPreview({ formState, prefix, emptyText, title }) {
  const preview = formatCheckoutAddressPreview(formState, prefix);

  return (
    <div className="rounded-[12px] border border-[#eadfd5] bg-[#fffaf6] px-3 py-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a77b60]">
        {title}
      </p>
      <p className="mt-1 text-[14px] text-[#4a443f]">{preview || emptyText}</p>
    </div>
  );
}
