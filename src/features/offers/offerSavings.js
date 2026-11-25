export function offerSavings(summary) {
 if(!summary?.offer||Number(summary.personCount)!==Number(summary.offer.personCount))return null;
 const main=summary.items?.filter(item=>!item.isAddOn)||[];
 if(main.length!==1)return null;
 const item=main[0],original=Number(item.catalogueUnitPrice),agreed=Number(item.unitPrice),guests=Number(summary.personCount);
 if(item.pricingType!=='per-person'||Number(item.quantity)!==1||!Number.isFinite(original)||!Number.isFinite(agreed)||!Number.isFinite(guests)||guests<=0||agreed<=0||original<agreed||agreed!==Number(summary.offer.pricePerPerson))return null;
 return {original:original*guests,agreed:agreed*guests,savings:(original-agreed)*guests};
}
