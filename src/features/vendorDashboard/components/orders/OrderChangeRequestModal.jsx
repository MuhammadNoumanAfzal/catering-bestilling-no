import { FiArrowRight, FiX } from "react-icons/fi";

const PENDING_STATUSES = new Set(["PENDING", "PENDING_CUSTOMER_APPROVAL"]);

function isPending(adjustment) {
  return PENDING_STATUSES.has(`${adjustment?.status ?? ""}`.trim().toUpperCase());
}

export default function OrderChangeRequestModal({
  order,
  isOpen,
  isLoading = false,
  isResolving = false,
  error = "",
  onApprove,
  onReject,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  const adjustment = order?.pendingVendorAdjustment || order?.latestVendorAdjustment;
  const replacements = Array.isArray(adjustment?.includedDishReplacements)
    ? adjustment.includedDishReplacements
    : [];
  const canRespond = isPending(adjustment);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#241b16]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="change-request-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#f0d9cb] bg-[#fffdfb] shadow-[0_28px_70px_rgba(35,24,16,0.30)]">
        <div className="flex items-start justify-between border-b border-[#f0e5dc] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c67a4d]">Vendor change request</p>
            <h2 id="change-request-title" className="mt-1 text-2xl font-bold text-[#231e1a]">Review requested changes</h2>
            {order?.id ? <p className="mt-1 text-sm text-[#786d64]">Order {order.id}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd6] bg-white text-[#5f554d] transition hover:border-[#cf6e38] hover:text-[#cf6e38]" aria-label="Close change request">
            <FiX />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-[#786d64]">Loading change request...</div>
          ) : error ? (
            <div className="rounded-2xl border border-[#f0c7b6] bg-[#fff4ef] p-4 text-sm text-[#9a5132]">{error}</div>
          ) : !adjustment ? (
            <div className="rounded-2xl border border-[#eadfd6] bg-[#faf7f3] p-4 text-sm text-[#786d64]">No change request is available for this order.</div>
          ) : (
            <>
              {adjustment.vendorNote ? <div className="rounded-2xl bg-[#fff7f1] p-4 text-sm leading-6 text-[#5f554d]">{adjustment.vendorNote}</div> : null}

              {replacements.length > 0 ? (
                <section>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-[#27211d]">Dish replacements</h3>
                    <span className="rounded-full bg-[#fff0e7] px-3 py-1 text-xs font-semibold text-[#cf6e38]">{replacements.length} requested</span>
                  </div>
                  <div className="space-y-3">
                    {replacements.map((replacement, index) => (
                      <article key={`${replacement.orderItemId}-${replacement.removedMenuItem?.id || index}`} className="rounded-2xl border border-[#eadfd6] bg-white p-4">
                        <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">Current dish</p>
                            <p className="mt-1 font-semibold text-[#665b52] line-through">{replacement.removedMenuItem?.title || "Included dish"}</p>
                          </div>
                          <FiArrowRight className="hidden text-xl text-[#cf6e38] sm:block" />
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5d8b68]">Replacement</p>
                            <p className="mt-1 font-semibold text-[#28382c]">{replacement.replacementMenuItem?.title || "Replacement dish"}</p>
                            {replacement.replacementMenu?.name ? <p className="mt-1 text-xs text-[#6f786f]">From {replacement.replacementMenu.name}</p> : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {canRespond ? (
                <div className="flex flex-col gap-3 border-t border-[#f0e5dc] pt-5 sm:flex-row">
                  <button type="button" onClick={onApprove} disabled={isResolving} className="rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b95d2b] disabled:cursor-not-allowed disabled:opacity-50">
                    {isResolving ? "Updating..." : "Accept changes"}
                  </button>
                  <button type="button" onClick={onReject} disabled={isResolving} className="rounded-full border border-[#d9cec4] bg-white px-5 py-3 text-sm font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38] disabled:cursor-not-allowed disabled:opacity-50">
                    Reject changes
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
