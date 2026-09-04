import { formatCheckoutAddressPreview } from "../../utils/checkoutAddress";

export default function CheckoutAddressPreview({ formState, prefix, emptyText, title }) {
  const preview = formatCheckoutAddressPreview(formState, prefix);

  return (
    <div className="rounded-[10px] bg-[#faf6f1] px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a77b60]">
        {title}
      </p>
      <p className="mt-0.5 text-[12px] text-[#4a443f]">{preview || emptyText}</p>
    </div>
  );
}
