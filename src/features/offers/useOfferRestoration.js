import { useEffect, useState } from 'react';
import { offerRequest } from './offerApi';
import { cartSignature, offerMatchesCheckout } from './offerModel';
import { restoreMatchingOffer } from './offerRestoration';

export default function useOfferRestoration({ carts, setCarts, form, customerId, requestedOfferId }) {
  const [retry, setRetry] = useState(0);
  const candidates = carts.filter(cart => {
    const summary = cart.orderSummary;
    if (!summary.offerRemoved || summary.offer) return false;
    const binding = summary.suspendedOffer;
    if (!binding) return Boolean(requestedOfferId);
    return String(binding.customerId) === String(customerId) && offerMatchesCheckout(binding, cart, form);
  });
  const key = JSON.stringify({ customerId, requestedOfferId, date:form.date, time:form.time, postcode:form.deliveryPostalCode, guests:form.personCount, carts:candidates.map(cart=>({id:cart.vendor.id,guests:cart.orderSummary.personCount,signature:cartSignature(cart.orderSummary),offer:cart.orderSummary.suspendedOffer})) });

  useEffect(() => {
    const refresh = () => setRetry(value => value + 1);
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  useEffect(() => {
    if (!customerId || !candidates.length) return;
    let active = true;
    const ids = [...new Set(candidates.map(cart=>cart.orderSummary.suspendedOffer?.requestId || requestedOfferId))];
    Promise.all(ids.map(async id => {
      try { return await offerRequest('detail', { id }); } catch { return null; }
    })).then(requests => {
      if (!active) return;
      setCarts(current => {
        let changed = false;
        const next = current.map(cart => {
          for (const request of requests) {
            if (!request) continue;
            const restored = restoreMatchingOffer(cart, form, request, customerId, requestedOfferId);
            if (restored) { changed = true; return restored; }
          }
          return cart;
        });
        return changed ? next : current;
      });
    });
    return () => { active = false; };
    // The key captures the exact account, form, cart and quote being revalidated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, retry, setCarts]);
}
