import { graphqlRequest } from '../../lib/api/graphqlClient';
export const isVendorApp = false;
export const offersBasePath = '/account/my-offers';
export { useAuth as useOfferAuth } from '../auth/hooks/useAuth';
export function requestOfferGraphql(query, variables) { return graphqlRequest({query, variables}); }

export async function storeAcceptedOffer(cart,customerId,text) {
 const {writeOrderSummary,readOrderSummary}=await import('../vendor/utils/orderSummaryStorage');
 const existing=readOrderSummary(cart.vendor);
 if(existing.items?.length && !window.confirm(text('Replace this vendor cart with the exact offered menu? Other vendors are kept.','Erstatte denne leverandørens handlekurv med den tilbudte menyen? Andre leverandører beholdes.')))return false;
 for(const key of ["checkout-form-draft"]) window.sessionStorage.removeItem(key);
 writeOrderSummary(cart.vendor,{...cart.orderSummary,offer:{...cart.orderSummary.offer,customerId:String(customerId)}});
 return true;
}
