import { cartSignature } from './offerModel';
import { confirmOfferAction } from './offerFeedback';
import { graphqlRequest } from '../../lib/api/graphqlClient';
export const isVendorApp = false;
export const offersBasePath = '/my-offers';
export { useAuth as useOfferAuth } from '../auth/hooks/useAuth';
export function requestOfferGraphql(query, variables) { return graphqlRequest({query, variables}); }

export async function storeAcceptedOffer(cart,customerId,text) {
 const {writeOrderSummary,readOrderSummary}=await import('../vendor/utils/orderSummaryStorage');
 const existing=readOrderSummary(cart.vendor);
 const sameOffer=existing.offer&&String(existing.offer.customerId)===String(customerId)&&String(existing.offer.requestId)===String(cart.orderSummary.offer.requestId)&&String(existing.offer.quoteRevision)===String(cart.orderSummary.offer.quoteRevision)&&cartSignature(existing)===cartSignature(cart.orderSummary);
 if(existing.items?.length&&!sameOffer){
  const decision=await confirmOfferAction({
   title:text('Replace this vendor cart?', 'Erstatte denne leverand\u00f8rens handlekurv?'),
   text:text('Replace this vendor cart with the exact offered menu? Other vendors are kept.', 'Erstatte denne leverand\u00f8rens handlekurv med den tilbudte menyen? Andre leverand\u00f8rer beholdes.'),
   confirmButtonText:text('Replace cart','Erstatt handlekurv'),
   cancelButtonText:text('Keep cart','Behold handlekurv'),icon:'question'
  });
  if(!decision.isConfirmed)return false;
 }

 for(const key of ["checkout-form-draft"]) window.sessionStorage.removeItem(key);
 writeOrderSummary(cart.vendor,{...cart.orderSummary,offer:{...cart.orderSummary.offer,customerId:String(customerId)}});
 return true;
}
