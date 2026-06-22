export default function OrderDetailsSummary({ orderPreview }) {
  return (
    <div className="mx-auto mt-5 grid max-w-2xl gap-4 rounded-[20px] border border-[#f0e5db] bg-white p-5 text-left sm:grid-cols-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Address
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.address || "Not specified"}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Date
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {[orderPreview.date, orderPreview.time].filter(Boolean).join(" at ") ||
            "Not specified"}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Person Count
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {orderPreview.personCount}
        </p>
      </div>
    </div>
  );
}
