import { useTranslation } from "react-i18next";

function getModificationSummary({
  modificationRequest,
  orderStatus = "",
  pendingVendorAdjustment = null,
  latestVendorAdjustment = null,
  t,
}) {
  const normalizedOrderStatus = `${orderStatus ?? ""}`.trim().toUpperCase();
  const normalizedStatus = `${modificationRequest?.status ?? ""}`.trim().toUpperCase();
  const normalizedVendorAdjustmentStatus =
    `${pendingVendorAdjustment?.status ?? latestVendorAdjustment?.status ?? ""}`
      .trim()
      .toUpperCase();

  if (normalizedVendorAdjustmentStatus === "PENDING") {
    return {
      statusLabel: t("orderConfirmed.vendorAdjustmentRequested"),
      nextStepLabel: t("orderConfirmed.reviewVendorChanges"),
    };
  }

  if (normalizedVendorAdjustmentStatus === "APPROVED" || normalizedOrderStatus === "MODIFIED") {
    return {
      statusLabel: t("orderConfirmed.modified"),
      nextStepLabel: t("orderConfirmed.updatedOrderConfirmed"),
    };
  }

  if (normalizedVendorAdjustmentStatus === "REJECTED") {
    return {
      statusLabel: normalizedOrderStatus === "CONFIRMED" ? t("orderConfirmed.confirmed") : t("orderConfirmed.placed"),
      nextStepLabel: t("orderConfirmed.originalOrderActive"),
    };
  }

  if (normalizedStatus === "PENDING") {
    return {
      statusLabel: t("orderConfirmed.modificationRequested"),
      nextStepLabel: t("orderConfirmed.vendorReviewPending"),
    };
  }

  if (normalizedStatus === "APPROVED") {
    return {
      statusLabel: t("orderConfirmed.modificationApproved"),
      nextStepLabel: t("orderConfirmed.updatedOrderIsConfirmed"),
    };
  }

  if (normalizedStatus === "REJECTED") {
    return {
      statusLabel: t("orderConfirmed.modificationRejected"),
      nextStepLabel: t("orderConfirmed.originalOrderActive"),
    };
  }

  if (normalizedStatus === "CANCELED") {
    return {
      statusLabel: t("orderConfirmed.modificationReplaced"),
      nextStepLabel: t("orderConfirmed.vendorReviewPending"),
    };
  }

  return {
    statusLabel: normalizedOrderStatus === "CONFIRMED" ? t("orderConfirmed.confirmed") : t("orderConfirmed.placed"),
    nextStepLabel: t("orderConfirmed.checkEmailInbox"),
  };
}

export default function OrderStatusSummary({
  primaryOrderId,
  modificationRequest,
  orderStatus,
  pendingVendorAdjustment,
  latestVendorAdjustment,
}) {
  const { t } = useTranslation();
  const { statusLabel, nextStepLabel } = getModificationSummary({
    modificationRequest,
    orderStatus,
    pendingVendorAdjustment,
    latestVendorAdjustment,
    t,
  });

  return (
    <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[20px] border border-[#eee4da] bg-[#fcf9f6] p-5 text-left sm:grid-cols-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.status")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {statusLabel}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.orderId")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#cf6e38]">
          {primaryOrderId}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
          {t("orderConfirmed.nextStep")}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
          {nextStepLabel}
        </p>
      </div>
    </div>
  );
}
