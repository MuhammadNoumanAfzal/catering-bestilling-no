function getModificationSummary(modificationRequest) {
  const normalizedStatus = `${modificationRequest?.status ?? ""}`.trim().toUpperCase();

  if (normalizedStatus === "PENDING") {
    return {
      statusLabel: "Modification requested",
      nextStepLabel: "Vendor review pending",
    };
  }

  if (normalizedStatus === "APPROVED") {
    return {
      statusLabel: "Modification approved",
      nextStepLabel: "Updated order is confirmed",
    };
  }

  if (normalizedStatus === "REJECTED") {
    return {
      statusLabel: "Modification rejected",
      nextStepLabel: "Original order remains active",
    };
  }

  if (normalizedStatus === "CANCELED") {
    return {
      statusLabel: "Modification replaced",
      nextStepLabel: "Vendor review pending",
    };
  }

  return {
    statusLabel: "Placed",
    nextStepLabel: "Check your email inbox",
  };
}

export default function OrderStatusSummary({ primaryOrderId, modificationRequest }) {
  const { statusLabel, nextStepLabel } = getModificationSummary(modificationRequest);

  return (
    <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[20px] border border-[#eee4da] bg-[#fcf9f6] p-5 text-left sm:grid-cols-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          Status
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {statusLabel}
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
          {nextStepLabel}
        </p>
      </div>
    </div>
  );
}
