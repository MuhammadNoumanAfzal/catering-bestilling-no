export const PAYMENT_CHECKOUT_QUERY = `query BrandedPaymentOrder($id: ID!) {
 clientOrder(id:$id) { id invoiceNumber status customerPaymentStatus dinteroSessionId grandTotal dueAmount currency eventDate eventTime deliveryAddress deliveryCity deliveryPostalCode
 vendor { name logoUrl }
 items { id productName quantity personCount addOnType lineTotal }
 pricing { subtotal taxAmount deliveryFee addOnsTotal tipAmount grandTotal amountPaid amountDue pricesIncludeVat }
 }
}`;
export function paymentPagePath(orderId) { return "/payment/"+encodeURIComponent(String(orderId)); }
export function validDinteroSessionId(value) { return typeof value === "string" && /^[TP][0-9]+\.[A-Za-z0-9_-]+$/.test(value); }
export function hostedSessionUrl(sessionId) {
 if(!validDinteroSessionId(sessionId)) throw new Error("Invalid payment session.");
 return "https://checkout.dintero.com/v1/view/"+encodeURIComponent(sessionId)+"/";
}
export function normalizePaymentOrder(value) {
 if(!value?.id || value.grandTotal == null || !Number.isFinite(Number(value.grandTotal)) || Number(value.grandTotal)<0) throw new Error("Order unavailable.");
 return {...value, items:Array.isArray(value.items)?value.items:[], sessionId:validDinteroSessionId(value.dinteroSessionId)?value.dinteroSessionId:null};
}
