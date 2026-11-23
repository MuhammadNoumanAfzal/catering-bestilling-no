import { acceptedOfferCart, offerMatchesCheckout } from './offerModel.js';

// Restore prices only from a fresh, accepted server snapshot for the same quote/account.
export function restoreMatchingOffer(cart, form, request, customerId, requestedOfferId) {
  const summary = cart?.orderSummary;
  if (!customerId || !summary?.offerRemoved || summary.offer) return null;
  const suspended = summary.suspendedOffer;
  const requestId = suspended?.requestId || requestedOfferId;
  if (!requestId || String(request?.id) !== String(requestId)) return null;
  if (suspended && (String(suspended.customerId) !== String(customerId) || String(suspended.quoteRevision) !== String(request.quote?.revision))) return null;
  let fresh;
  try { fresh = acceptedOfferCart(request); } catch { return null; }
  if (!offerMatchesCheckout(fresh.orderSummary.offer, cart, form)) return null;
  return {
    ...cart,
    orderSummary: {
      ...summary,
      items: fresh.orderSummary.items,
      offer: { ...fresh.orderSummary.offer, customerId: String(customerId) },
      suspendedOffer: null, offerRemoved: false,
      pricing: null, availability: null, previewItems: [],
    },
  };
}
