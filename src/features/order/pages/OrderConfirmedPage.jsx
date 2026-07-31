import { Link } from "react-router-dom";
import {
  ModifyOrderModal,
  OrderConfirmationActions,
  OrderConfirmationHero,
  OrderDetailsSummary,
  OrderStatusSummary,
} from "../components";
import { useOrderConfirmedPage } from "../hooks/useOrderConfirmedPage";

export default function OrderConfirmedPage() {
  const {
    handleModifySave,
    isModifyLoading,
    isModifyModalOpen,
    isModifySaving,
    modifyError,
    modifyInitialValue,
    orderPreview,
    placedOrderDraft,
    primaryOrderId,
    setIsModifyModalOpen,
  } = useOrderConfirmedPage();
  const modificationRequest = orderPreview.modificationRequest || null;
  const normalizedModificationStatus = `${modificationRequest?.status ?? ""}`
    .trim()
    .toUpperCase();
  const hasPendingModificationRequest = normalizedModificationStatus === "PENDING";
  const modifyButtonLabel = hasPendingModificationRequest
    ? "Request pending"
    : "Modify Order";

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[linear-gradient(180deg,#faf6f1_0%,#fffdf9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[28px] border border-[#e7ddd3] bg-white shadow-[0_24px_60px_rgba(48,31,17,0.08)]">
          <div className="border-b border-[#f0e5db] px-6 py-5 sm:px-8">
            <Link to="/" className="inline-flex cursor-pointer">
              <img
                src="/home/logo.png"
                alt="Lunsjavtale"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="px-6 py-10 text-center sm:px-8 sm:py-12">
            <OrderConfirmationHero />
            <OrderStatusSummary
              primaryOrderId={primaryOrderId}
              modificationRequest={modificationRequest}
            />

            {hasPendingModificationRequest ? (
              <div className="mx-auto mt-4 max-w-2xl rounded-[16px] border border-[#f5d6c3] bg-[#fff7f1] px-4 py-3 text-left text-[14px] text-[#8a5a3a]">
                Your change request has been sent to the vendor. The original order stays active until they approve or reject it.
              </div>
            ) : null}

            {placedOrderDraft ? (
              <OrderDetailsSummary orderPreview={orderPreview} />
            ) : null}

            <OrderConfirmationActions
              canModify={Boolean(placedOrderDraft)}
              modifyButtonLabel={modifyButtonLabel}
              modifyDisabled={hasPendingModificationRequest}
              onModify={() => setIsModifyModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {isModifyModalOpen ? (
        <ModifyOrderModal
          error={modifyError}
          initialValue={modifyInitialValue || orderPreview}
          isLoading={isModifyLoading}
          isSaving={isModifySaving}
          onCancel={() => setIsModifyModalOpen(false)}
          onSave={handleModifySave}
        />
      ) : null}
    </section>
  );
}
