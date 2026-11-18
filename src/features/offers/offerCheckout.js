import { normalizeOfferPreview } from './offerBackendModel';
import i18n from '../../i18n';
import { graphqlRequest } from '../../lib/api/graphqlClient';
import { GET_CHECKOUT_PREVIEW_QUERY } from '../checkOut/api/checkoutQueries';
import { offerMatchesCheckout, verifyOfferPreview } from './offerModel';
import { getStoredAccessToken } from '../../lib/auth/authSession';
import { store } from '../../app/store';
export const OFFER_CHECKOUT_PREVIEW_QUERY = GET_CHECKOUT_PREVIEW_QUERY.replace('query CheckoutPreview(', 'query OfferCheckoutPreview(').replace('checkoutPreview(input:', 'offerCheckoutPreview(input:').replace('      currency','      offerBinding { requestId quoteRevision foodTotal }\n      currency').replace(/pricing \{[\s\S]*?\n {6}\}/, 'pricing { currency foodTotal grossTotal netTotal taxTotal deliveryFee minimumOrderShortfall catalogueDiscount tipAmount }');
const translated=(en,nb)=>/^(no|nb|nn)/i.test(i18n.resolvedLanguage||i18n.language)?nb:en;
export function assertOfferCheckout(cart, form) {
 const offer=cart.orderSummary.offer;
 if (!offer) return {};
 const userId=store.getState().auth.user?.id;
 if(!getStoredAccessToken() || !userId || String(userId)!==offer.customerId) throw new Error(translated('Please sign in to the account that accepted this offer.','Logg inn med kontoen som godtok tilbudet.'));
 if(!offerMatchesCheckout(offer,cart,form)) throw new Error(translated('Order details changed. Remove the offer and refresh the normal price.','Bestillingsdetaljene er endret. Fjern tilbudet og oppdater ordinær pris.'));
 if(!offer.requestId || !offer.quoteRevision || !Number.isFinite(Date.parse(offer.expiresAt)) || Date.parse(offer.expiresAt)<=Date.now()) throw new Error(translated('This offer has expired. Return to My offers for a new offer.','Tilbudet er utløpt. Gå til Mine tilbud for et nytt tilbud.'));
 return {offerRequestId:offer.requestId,offerQuoteRevision:offer.quoteRevision};
}
export async function fetchOfferCheckoutPreview(cart,form,payload) {
 const binding=assertOfferCheckout(cart,form);
 const data=await graphqlRequest({query:OFFER_CHECKOUT_PREVIEW_QUERY,variables:{input:{...payload,...binding}}});
 const preview=normalizeOfferPreview(data?.offerCheckoutPreview),offer=cart.orderSummary.offer;
 if(!verifyOfferPreview(preview,offer)) throw new Error(translated('The offer price could not be verified. Refresh your offer before paying.','Tilbudsprisen kunne ikke verifiseres. Oppdater tilbudet før betaling.'));
 return {...preview,pricing:{...preview.pricing,offerValidated:{requestId:offer.requestId,quoteRevision:offer.quoteRevision}}};
}
