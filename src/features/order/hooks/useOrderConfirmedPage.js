import { useEffect, useMemo, useState } from "react";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import {
  fetchOrderModificationDetails,
  submitOrderModification,
} from "../api/orderModificationService";
import { readPlacedOrderDraft, savePlacedOrderDraftChanges } from "../services";
import { formatOrderPreview } from "../utils/orderPreview";

export function useOrderConfirmedPage() {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [modifyInitialValue, setModifyInitialValue] = useState(null);
  const [modifyError, setModifyError] = useState("");
  const [isModifyLoading, setIsModifyLoading] = useState(false);
  const [isModifySaving, setIsModifySaving] = useState(false);
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
          setModifyError("This order can no longer be modified.");
        }

        setModifyInitialValue(nextValue);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setModifyError(
          error instanceof Error
            ? error.message
            : "Unable to load current order details.",
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
        "This order does not have a valid id for modification.",
        "Modify order failed",
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
      const nextPlacedOrderDraft = await savePlacedOrderDraftChanges(
        placedOrderDraft,
        nextValues,
      );

      setPlacedOrderDraft(nextPlacedOrderDraft);
      await showSuccessToast(result.message);
      setIsModifyModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to modify this order right now.";
      setModifyError(message);
    } finally {
      setIsModifySaving(false);
    }
  };

  return {
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
  };
}
