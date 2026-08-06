import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import i18n from "../../../i18n";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { withBaseOptions } from "../../../utils/alerts";
import {
  approveVendorOrderAdjustment,
  fetchOrderModificationDetails,
  rejectVendorOrderAdjustment,
  submitOrderModification,
} from "../api/orderModificationService";
import {
  readPlacedOrderDraft,
  savePlacedOrderDraftChanges,
  savePlacedOrderDraftModificationRequest,
} from "../services";
import { formatOrderPreview } from "../utils/orderPreview";

export function useOrderConfirmedPage() {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [modifyInitialValue, setModifyInitialValue] = useState(null);
  const [modifyError, setModifyError] = useState("");
  const [isModifyLoading, setIsModifyLoading] = useState(false);
  const [isModifySaving, setIsModifySaving] = useState(false);
  const [orderWorkflow, setOrderWorkflow] = useState(null);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [isResolvingVendorAdjustment, setIsResolvingVendorAdjustment] = useState(false);
  const [placedOrderDraft, setPlacedOrderDraft] = useState(() =>
    readPlacedOrderDraft(),
  );

  const orderPreview = useMemo(
    () => formatOrderPreview(placedOrderDraft),
    [placedOrderDraft],
  );
  const primaryOrderId = orderPreview.orderIds[0] || "#23459";
  const rawPrimaryOrderId = placedOrderDraft?.placedOrders?.[0]?.orderId || "";

  useEffect(() => {
    let isMounted = true;

    async function loadOrderWorkflow() {
      if (!rawPrimaryOrderId) {
        setOrderWorkflow(null);
        return;
      }

      setIsWorkflowLoading(true);

      try {
        const details = await fetchOrderModificationDetails(rawPrimaryOrderId);

        if (!isMounted) {
          return;
        }

        setOrderWorkflow(details);
      } catch {
        if (isMounted) {
          setOrderWorkflow(null);
        }
      } finally {
        if (isMounted) {
          setIsWorkflowLoading(false);
        }
      }
    }

    loadOrderWorkflow();

    return () => {
      isMounted = false;
    };
  }, [rawPrimaryOrderId]);

  useEffect(() => {
    let isMounted = true;

    async function loadModifyDetails() {
      if (!isModifyModalOpen) {
        return;
      }

      setModifyError("");
      setModifyInitialValue(orderPreview);

      if (!rawPrimaryOrderId) {
        return;
      }

      setIsModifyLoading(true);

      try {
        const nextValue = await fetchOrderModificationDetails(rawPrimaryOrderId);

        if (!isMounted) {
          return;
        }

        if (!nextValue.canModify) {
          setModifyError(i18n.t("modifyOrder.noLongerModifiable"));
        }

        setModifyInitialValue(nextValue);
        setOrderWorkflow(nextValue);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setModifyError(
          error instanceof Error
            ? error.message
            : i18n.t("modifyOrder.loadFailed"),
        );
      } finally {
        if (isMounted) {
          setIsModifyLoading(false);
        }
      }
    }

    loadModifyDetails();

    return () => {
      isMounted = false;
    };
  }, [isModifyModalOpen, orderPreview, rawPrimaryOrderId]);

  const handleModifySave = async (nextValues) => {
    if (!placedOrderDraft) {
      setIsModifyModalOpen(false);
      return;
    }

    if (!rawPrimaryOrderId) {
      await showAuthErrorAlert(
        i18n.t("modifyOrder.invalidIdMessage"),
        i18n.t("modifyOrder.failedTitle"),
      );
      return;
    }

    setIsModifySaving(true);
    setModifyError("");

    try {
      const result = await submitOrderModification({
        orderId: rawPrimaryOrderId,
        ...nextValues,
      });
      const nextPlacedOrderDraft = await savePlacedOrderDraftModificationRequest(
        placedOrderDraft,
        result.request,
      );

      setPlacedOrderDraft(nextPlacedOrderDraft);
      setOrderWorkflow((current) =>
        current
          ? {
              ...current,
              pendingModificationRequest: result.request,
              latestModificationRequest: result.request,
            }
          : current,
      );
      await showSuccessToast(result.message);
      setIsModifyModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : i18n.t("modifyOrder.saveFailed");
      setModifyError(message);
    } finally {
      setIsModifySaving(false);
    }
  };

  const handleApproveVendorAdjustment = async () => {
    const pendingVendorAdjustment = orderWorkflow?.pendingVendorAdjustment;

    if (!pendingVendorAdjustment?.id || !placedOrderDraft) {
      return;
    }

    setIsResolvingVendorAdjustment(true);

    try {
      const result = await approveVendorOrderAdjustment({
        adjustmentId: pendingVendorAdjustment.id,
        note: i18n.t("orderConfirmed.customerApprovedNote"),
      });

      const nextPlacedOrderDraft = await savePlacedOrderDraftChanges(
        placedOrderDraft,
        {
          address:
            pendingVendorAdjustment.proposedAddressLine1 ||
            orderPreview.address,
          addressLine2:
            pendingVendorAdjustment.proposedAddressLine2 ||
            orderPreview.addressLine2,
          city: pendingVendorAdjustment.proposedCity || orderPreview.city,
          postalCode:
            pendingVendorAdjustment.proposedPostalCode || orderPreview.postalCode,
          date: pendingVendorAdjustment.proposedEventDate || orderPreview.date,
          time:
            pendingVendorAdjustment.proposedDeliveryWindowStart ||
            orderPreview.time,
          personCount:
            pendingVendorAdjustment.proposedGuestCount || orderPreview.personCount,
          additionalDetails: orderPreview.additionalDetails || "",
        },
      );

      const nextWorkflow = {
        ...(orderWorkflow || {}),
        status: result.order?.status || "Modified",
        pendingVendorAdjustment: null,
        latestVendorAdjustment: {
          ...(pendingVendorAdjustment || {}),
          status: result.adjustment?.status || "APPROVED",
          resolvedOn: result.adjustment?.resolvedOn || new Date().toISOString(),
        },
      };

      setPlacedOrderDraft(nextPlacedOrderDraft);
      setOrderWorkflow(nextWorkflow);
      await showSuccessToast(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : i18n.t("orderConfirmed.approveFailedMessage"),
        i18n.t("orderConfirmed.approveFailedTitle"),
      );
    } finally {
      setIsResolvingVendorAdjustment(false);
    }
  };

  const handleRejectVendorAdjustment = async () => {
    const pendingVendorAdjustment = orderWorkflow?.pendingVendorAdjustment;

    if (!pendingVendorAdjustment?.id) {
      return;
    }

    const response = await Swal.fire(
      withBaseOptions({
        title: i18n.t("alerts.rejectAdjustmentTitle"),
        text: i18n.t("alerts.rejectAdjustmentText"),
        input: "textarea",
        inputPlaceholder: i18n.t("alerts.rejectionPlaceholder"),
        inputAttributes: {
          "aria-label": i18n.t("alerts.rejectionReasonLabel"),
        },
        showCancelButton: true,
        confirmButtonText: i18n.t("alerts.rejectAdjustmentConfirm"),
        cancelButtonText: i18n.t("alerts.cancel"),
        cancelButtonColor: "#d7cec6",
        inputValidator: (value) => {
          if (!`${value ?? ""}`.trim()) {
            return i18n.t("alerts.rejectionReasonRequired");
          }

          return undefined;
        },
      }),
    );

    if (!response.isConfirmed) {
      return;
    }

    setIsResolvingVendorAdjustment(true);

    try {
      const result = await rejectVendorOrderAdjustment({
        adjustmentId: pendingVendorAdjustment.id,
        reason: `${response.value ?? ""}`.trim(),
      });

      setOrderWorkflow((current) =>
        current
          ? {
              ...current,
              status: "Confirmed",
              pendingVendorAdjustment: null,
              latestVendorAdjustment: {
                ...(pendingVendorAdjustment || {}),
                status: result.adjustment?.status || "REJECTED",
                customerResponse:
                  result.adjustment?.customerResponse || `${response.value ?? ""}`.trim(),
                resolvedOn: result.adjustment?.resolvedOn || new Date().toISOString(),
              },
            }
          : current,
      );
      await showSuccessToast(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : i18n.t("orderConfirmed.rejectFailedMessage"),
        i18n.t("orderConfirmed.rejectFailedTitle"),
      );
    } finally {
      setIsResolvingVendorAdjustment(false);
    }
  };

  return {
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
  };
}
