export default function OrderStatusSummary({ primaryOrderId }) {
  return (
    <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[20px] border border-[#eee4da] bg-[#fcf9f6] p-5 text-left sm:grid-cols-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Status
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          Confirmed
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Order ID
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#cf6e38]">
          {primaryOrderId}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Next step
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          Check your email inbox
        </p>
      </div>
    </div>
  );
}
