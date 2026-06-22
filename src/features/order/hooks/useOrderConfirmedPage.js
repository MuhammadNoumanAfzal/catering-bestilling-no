import { useMemo, useState } from "react";
import { readPlacedOrderDraft, savePlacedOrderDraftChanges } from "../services";
import { formatOrderPreview } from "../utils/orderPreview";

export function useOrderConfirmedPage() {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [placedOrderDraft, setPlacedOrderDraft] = useState(() =>
    readPlacedOrderDraft(),
  );

  const orderPreview = useMemo(
    () => formatOrderPreview(placedOrderDraft),
    [placedOrderDraft],
  );
  const primaryOrderId = orderPreview.orderIds[0] || "#23459";

  const handleModifySave = async (nextValues) => {
    if (!placedOrderDraft) {
      setIsModifyModalOpen(false);
      return;
    }

    const nextPlacedOrderDraft = await savePlacedOrderDraftChanges(
      placedOrderDraft,
      nextValues,
    );

    setPlacedOrderDraft(nextPlacedOrderDraft);
    setIsModifyModalOpen(false);
  };

  return {
    handleModifySave,
    isModifyModalOpen,
    orderPreview,
    placedOrderDraft,
    primaryOrderId,
    setIsModifyModalOpen,
  };
}
