// Adapt the deployed offer schema to the existing checkout view model.
function amount(value, field) {
  if (value == null || value === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
    throw new Error(`Invalid offer pricing: ${field}`);
  }
  return Number(value);
}
export function normalizeOfferPreview(preview) {
  const pricing = preview?.pricing;
  if (!pricing || preview.currency !== 'NOK' || pricing.currency !== 'NOK' || !Array.isArray(preview.items) || !preview.items.length) throw new Error('Offer pricing unavailable');
  const food = amount(preview.offerBinding?.foodTotal, 'bound food');
  const merchandise = preview.items.reduce((total, item) => total + amount(item.lineTotal, 'line total'), 0);
  const addOns = merchandise - food;
  const reportedFood = amount(pricing.foodTotal, 'food total');
  const gross = amount(pricing.grossTotal, 'gross total');
  const delivery = amount(pricing.deliveryFee, 'delivery');
  const tip = amount(pricing.tipAmount, 'tip');
  const shortfall = amount(pricing.minimumOrderShortfall, 'minimum order supplement');
  const discount = amount(pricing.catalogueDiscount, 'discount');
  const tax = amount(pricing.taxTotal, 'tax');
  // Never silently swallow charges or apply a catalogue discount twice.
  if (addOns < -.02 || discount > .02 || (Math.abs(reportedFood-merchandise)>.02 && Math.abs(reportedFood-food)>.02) || Math.abs(gross-(merchandise+delivery+tip+shortfall))>.02 || tax>gross+.02) throw new Error('Offer payable total does not match its lines');
  return { ...preview, pricing: { ...pricing, subtotal:food, addOnsTotal:Math.max(0,addOns), grandTotal:gross, taxAmount:tax, taxRate:null, pricesIncludeVat:true, deliveryFee:delivery, tipAmount:tip, discountAmount:0, serviceFee:shortfall, minimumOrderShortfall:shortfall } };
}
export function validatePaymentGuard(guard, known) {
  if (guard?.allowed !== true) throw new Error('Offer payment denied');
  const requestId = guard.offerRequestId;
  if (known && (String(requestId || '') !== String(known.requestId) || guard.quoteRevision !== known.quoteRevision)) throw new Error('Offer payment binding changed');
  if (requestId && !guard.quoteRevision) throw new Error('Missing offer payment revision');
  return {requiresOfferValidation:Boolean(requestId),valid:true,requestId,quoteRevision:guard.quoteRevision};
}
export function validatePayableRequest(request, guard, now=Date.now()) {
  const deadline=Date.parse(request?.quote?.expiresAt);
  if (!request?.id || String(request.id)!==String(guard.requestId) || request.quote?.revision!==guard.quoteRevision || !['ACCEPTED','ORDERED'].includes(request.status) || !Number.isFinite(deadline) || deadline<=now) throw new Error('Offer expired or changed');
  return {...guard,expiresAt:request.quote.expiresAt};
}
