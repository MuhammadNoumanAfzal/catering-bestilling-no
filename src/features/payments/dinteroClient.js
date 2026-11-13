export const CREATE_DINTERO_SESSION = `mutation CreateDinteroPaymentSession($input: CreateDinteroCheckoutSessionInput!) { createDinteroCheckoutSession(input:$input) { success message orderId sessionId paymentUrl } }`;
export const ORDER_PAYMENT_STATUS = `query ClientOrderPaymentStatus($id: ID!) { clientOrder(id:$id) { id status customerPaymentStatus paymentMethod dinteroTransactionId grandTotal } }`;
export function checkoutPaymentUrl(value) {
 let url; try { url=new URL(value); } catch { throw new Error("Invalid payment URL."); }
 if (url.protocol!=="https:" || url.username || url.password || !["checkout.dintero.com","checkout.api.dintero.com"].includes(url.hostname)) throw new Error("Invalid payment URL.");
 return url.href;
}
export function dinteroReturnUrl(origin, orderId) {
 const base = new URL(origin).origin;
 // The backend substitutes this literal placeholder after creating the order.
 const target = orderId == null ? "{orderId}" : encodeURIComponent(String(orderId));
 return base + "/orders/" + target + "?payment=dintero";
}
export function buildDinteroOrderInput(payload, origin) {
 return {...payload, paymentMethod: "DINTERO", returnUrl: dinteroReturnUrl(origin)};
}
export function paymentState(order) {
 const status=String(order?.customerPaymentStatus || "").trim().toUpperCase();
 if (status==="PAID") return "paid";
 if (["CANCELLED","CANCELED","REJECTED"].includes(String(order?.status).toUpperCase())) return "orderCancelled";
 if (status === "AUTHORIZED") return "reserved";
 if (["CANCELLED","CANCELED","VOIDED","RELEASED"].includes(status)) return "released";
 if (status === "FAILED") return "retry";
 if (["PENDING","UNPAID","AWAITING_PAYMENT","PARTIALLY_PAID"].includes(status)) return "pending";
 return "unknown";
}
export function createDinteroClient(request) {
 return {
  async status(id) {
   const data=await request({query:ORDER_PAYMENT_STATUS,variables:{id:String(id)}});
   if (!data?.clientOrder?.id || !data.clientOrder.customerPaymentStatus) throw new Error("Payment status unavailable.");
   return data.clientOrder;
  },
  async session(orderId,origin) {
   const returnUrl=dinteroReturnUrl(origin,orderId);
   const data=await request({query:CREATE_DINTERO_SESSION,variables:{input:{orderId:String(orderId),returnUrl}}});
   const result=data?.createDinteroCheckoutSession;
   if (!result?.success || !result.sessionId || !result.orderId) throw new Error(result?.message || "Unable to start payment.");
   return {...result,paymentUrl:checkoutPaymentUrl(result.paymentUrl)};
  }
 };
}
