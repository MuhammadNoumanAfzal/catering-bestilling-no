import { getOfferCapabilities } from './offerCapabilities.js';
import { graphqlRequest } from '../../lib/api/graphqlClient';
import { validatePaymentGuard, validatePayableRequest } from './offerBackendModel';
export const OFFER_PAYMENT_GUARD_QUERY=`query OfferPaymentGuard($orderId: ID!) { offerPaymentGuard(orderId:$orderId) { allowed code message offerRequestId quoteRevision } }`;
export const PAYABLE_OFFER_QUERY=`query PayableOffer($id:ID!) { myOfferRequest(id:$id) { id status quote { revision expiresAt } } }`;
const key=id=>'offer-payment:'+id;
export function rememberOfferOrder(orderId,offer,customerId){if(offer)sessionStorage.setItem(key(orderId),JSON.stringify({requestId:offer.requestId,quoteRevision:offer.quoteRevision,customerId:String(customerId)}));}
export function readOfferOrder(orderId){try{return JSON.parse(sessionStorage.getItem(key(orderId))||'null');}catch{return null;}}
export async function validateOfferPayment(orderId,customerId){
 const known=readOfferOrder(orderId);
 if(!customerId || (known&&known.customerId!==String(customerId)))throw new Error('Wrong offer account');
 try {
 const data=await graphqlRequest({query:OFFER_PAYMENT_GUARD_QUERY,variables:{orderId}});
 const guard=validatePaymentGuard(data?.offerPaymentGuard,known);
 if(!guard.requiresOfferValidation)return guard;
 const capabilities=await getOfferCapabilities((query,variables)=>graphqlRequest({query,variables}));
 const query=capabilities.quoteTiming ? PAYABLE_OFFER_QUERY.replace('revision expiresAt','revision expiresAt startsAt isActive isScheduled') : PAYABLE_OFFER_QUERY;
 const current=await graphqlRequest({query,variables:{id:guard.requestId}});
 return validatePayableRequest(current?.myOfferRequest,guard);
 } catch(cause) {const error=new Error("Offer payment could not be verified",{cause});error.code="OFFER_PAYMENT_BLOCKED";throw error;}
}
