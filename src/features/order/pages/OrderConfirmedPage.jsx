import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ModifyOrderModal,
  OrderConfirmationActions,
  OrderConfirmationHero,
  OrderDetailsSummary,
  OrderStatusSummary,
} from "../components";
import { useOrderConfirmedPage } from "../hooks/useOrderConfirmedPage";

export default function OrderConfirmedPage() {
  const { t } = useTranslation();
  const {
    handleApproveVendorAdjustment,
    handleModifySave,
    handleRejectVendorAdjustment,
    isResolvingVendorAdjustment,
    isModifyLoading,
    isModifyModalOpen,
    isModifySaving,
    isWorkflowLoading,
    modifyError,
    modifyInitialValue,
    orderPreview,
    orderWorkflow,
    placedOrderDraft,
    primaryOrderId,
    setIsModifyModalOpen,
  } = useOrderConfirmedPage();
  const modificationRequest = orderPreview.modificationRequest || null;
  const pendingVendorAdjustment = orderWorkflow?.pendingVendorAdjustment || null;
  const latestVendorAdjustment = orderWorkflow?.latestVendorAdjustment || null;
  const normalizedModificationStatus = `${modificationRequest?.status ?? ""}`
    .trim()
    .toUpperCase();
  const hasPendingModificationRequest = normalizedModificationStatus === "PENDING";
  const hasPendingVendorAdjustment =
    `${pendingVendorAdjustment?.status ?? ""}`.trim().toUpperCase() === "PENDING";
  const modifyButtonLabel = hasPendingModificationRequest
    ? t("orderConfirmed.requestPending")
    : t("orderConfirmed.modifyOrder");
  const modifyDisabled = hasPendingModificationRequest || hasPendingVendorAdjustment;

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[linear-gradient(180deg,#faf6f1_0%,#fffdf9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[28px] border border-[#e7ddd3] bg-white shadow-[0_24px_60px_rgba(48,31,17,0.08)]">
          <div className="border-b border-[#f0e5db] px-6 py-5 sm:px-8">
            <Link to="/" className="inline-flex cursor-pointer">
              <img
                src="/home/logo.png"
                alt={t("orderConfirmed.logoAlt")}
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="px-6 py-10 text-center sm:px-8 sm:py-12">
            <OrderConfirmationHero />
            <OrderStatusSummary
              primaryOrderId={primaryOrderId}
              invoiceNumber={orderPreview.invoiceNumber}
              invoiceStatus={orderPreview.invoiceStatus}
              modificationRequest={modificationRequest}
              orderStatus={orderWorkflow?.status}
              pendingVendorAdjustment={pendingVendorAdjustment}
              latestVendorAdjustment={latestVendorAdjustment}
            />

            {hasPendingModificationRequest ? (
              <div className="mx-auto mt-4 max-w-2xl rounded-[16px] border border-[#f5d6c3] bg-[#fff7f1] px-4 py-3 text-left text-[14px] text-[#8a5a3a]">
                {t("orderConfirmed.changeRequestSent")}
              </div>
            ) : null}

            {hasPendingVendorAdjustment ? (
              <div className="mx-auto mt-4 max-w-2xl rounded-[18px] border border-[#f2d8cb] bg-[#fff8f3] px-4 py-4 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  {t("orderConfirmed.vendorAdjustmentPending")}
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                  {t("orderConfirmed.vendorAdjustmentDescription")}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[14px] border border-[#efe4da] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                      {t("orderConfirmed.proposedDate")}
                    </p>
                    <p className="mt-2 text-[14px] font-semibold text-[#201b17]">
                      {pendingVendorAdjustment.proposedEventDate || orderPreview.date || t("orderConfirmed.noChange")}
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[#efe4da] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                      {t("orderConfirmed.proposedTime")}
                    </p>
                    <p className="mt-2 text-[14px] font-semibold text-[#201b17]">
                      {pendingVendorAdjustment.proposedDeliveryWindowStart || orderPreview.time || t("orderConfirmed.noChange")}
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[#efe4da] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                      {t("orderConfirmed.proposedGuests")}
                    </p>
                    <p className="mt-2 text-[14px] font-semibold text-[#201b17]">
                      {pendingVendorAdjustment.proposedGuestCount || orderPreview.personCount}
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[#efe4da] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                      {t("orderConfirmed.proposedTotal")}
                    </p>
                    <p className="mt-2 text-[14px] font-semibold text-[#201b17]">
                      {pendingVendorAdjustment.newTotal != null
                        ? `NOK ${pendingVendorAdjustment.newTotal}`
                        : t("orderConfirmed.willBeRecalculated")}
                    </p>
                  </div>
                </div>

                {pendingVendorAdjustment.vendorNote ? (
                  <div className="mt-3 rounded-[14px] border border-[#efe4da] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                      {t("orderConfirmed.vendorNote")}
                    </p>
                    <p className="mt-2 text-[14px] font-semibold leading-6 text-[#201b17]">
                      {pendingVendorAdjustment.vendorNote}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={isResolvingVendorAdjustment || isWorkflowLoading}
                    onClick={handleApproveVendorAdjustment}
                    className={`inline-flex items-center justify-center rounded-[10px] px-5 py-3 text-[15px] font-semibold text-white transition ${
                      isResolvingVendorAdjustment || isWorkflowLoading
                        ? "cursor-not-allowed bg-[#d7c5b9]"
                        : "cursor-pointer bg-[#cf6e38] hover:bg-[#bb602d]"
                    }`}
                  >
                    {isResolvingVendorAdjustment ? t("orderConfirmed.updating") : t("orderConfirmed.acceptVendorChanges")}
                  </button>
                  <button
                    type="button"
                    disabled={isResolvingVendorAdjustment || isWorkflowLoading}
                    onClick={handleRejectVendorAdjustment}
                    className={`inline-flex items-center justify-center rounded-[10px] border px-5 py-3 text-[15px] font-semibold transition ${
                      isResolvingVendorAdjustment || isWorkflowLoading
                        ? "cursor-not-allowed border-[#e2d8cf] bg-[#f6f1eb] text-[#9b8f84]"
                        : "cursor-pointer border-[#d9cec3] bg-white text-[#2b2622] hover:border-[#cf6e38] hover:text-[#cf6e38]"
                    }`}
                  >
                    {t("orderConfirmed.rejectVendorChanges")}
                  </button>
                </div>
              </div>
            ) : null}

            {placedOrderDraft ? (
              <OrderDetailsSummary orderPreview={orderPreview} />
            ) : null}

            <OrderConfirmationActions
              canModify={Boolean(placedOrderDraft)}
              modifyButtonLabel={modifyButtonLabel}
              modifyDisabled={modifyDisabled}
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
