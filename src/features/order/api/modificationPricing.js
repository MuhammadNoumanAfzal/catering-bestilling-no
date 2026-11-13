export const MODIFICATION_PRICING_CONTEXT = `query ModificationPricingContext($id: ID!) {
 clientOrder(id:$id) { id status customerType customerPaymentStatus grandTotal currency personCount invoiceRevision
 pricing {subtotal taxAmount deliveryFee addOnsTotal tipAmount grandTotal}
 vendor {id name slug}
 items {id productName quantity personCount addOnType selectedOptions specialInstructions product {id} selectedAddons {name quantity}}
 }
}`;
export function buildModificationEstimateInput(order, form) {
 if (!order?.vendor?.id || !Array.isArray(order.items) || !order.items.length) return null;
 const personCount=Number(form.personCount);
 if(!Number.isInteger(personCount) || personCount<1 || !form.date || !form.time || !form.address?.trim() || !/^\d{4}$/.test(form.postalCode?.trim()||"")) return null;
 const items=order.items.map(item=>{
  const quantity=Number(item.quantity);
  if(!item.product?.id || !Number.isInteger(quantity) || quantity<1) throw new Error("Order item pricing details unavailable.");
  if(item.addOnType==="INDEPENDENT" && (!Number.isInteger(Number(item.personCount)) || Number(item.personCount)<1)) throw new Error("Independent product guest count unavailable.");
  return {productId:item.product.id,quantity,
   ...(item.addOnType==="INDEPENDENT" ? {personCount:item.personCount}:{}),
   ...(item.selectedOptions ? {selectedOptions:item.selectedOptions}:{}),
   ...(item.specialInstructions ? {specialInstructions:item.specialInstructions}:{}),
   selectedAddons:(item.selectedAddons||[]).map(addon=>({name:addon.name,quantity:addon.quantity}))};
 });
 return {vendorId:order.vendor.id,customerType:order.customerType,eventDate:form.date,eventTime:form.time,personCount,
 deliveryAddress:form.address.trim(),deliveryPostalCode:form.postalCode.trim(),deliveryCity:form.city?.trim()||"",
 tipAmount:order.pricing?.tipAmount ?? "0",items};
}
export function modificationAmounts(currentTotal, preview) {
 const current=currentTotal==null ? null : Number(currentTotal);
 const proposed=preview?.pricing?.grandTotal==null ? null : Number(preview.pricing.grandTotal);
 return {current:Number.isFinite(current)?current:null,proposed:Number.isFinite(proposed)?proposed:null,
 delta:Number.isFinite(current)&&Number.isFinite(proposed)?Math.round((proposed-current)*100)/100:null};
}
export function notifyOrderChanged(orderId) {
 window.dispatchEvent(new CustomEvent("gocatering-order-updated",{detail:{orderId:String(orderId)}}));
}

export const ORDER_MODIFICATION_PREVIEW = `query OrderModificationPreview($orderId:ID!,$input:OrderModificationPreviewInput) {
 orderModificationPreview(orderId:$orderId,input:$input) {orderId currency currentTotal proposedTotal delta invoiceRevision isEligible eligibilityReason paymentAdjustmentState requiresCustomerReauthorization}
}`;
export function buildOrderModificationPreviewInput(order, form) {
 const personCount=Number(form.personCount);
 if(!order?.id || !Number.isInteger(personCount) || personCount<1 || !/^\d{4}$/.test(form.postalCode?.trim()||"") || !form.address?.trim()) return null;
 return {personCount,deliveryPostalCode:form.postalCode.trim(),deliveryAddress:form.address.trim()};
}
export function orderModificationAmounts(preview, fallback) {
 const number=value=>value==null || value==="" || !Number.isFinite(Number(value))?null:Number(value);
 return {current:number(preview?.currentTotal ?? fallback),proposed:number(preview?.proposedTotal),delta:number(preview?.delta)};
}
