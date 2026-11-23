import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
export function useOfferText() {
  const { i18n } = useTranslation();
  const norwegian = /^(no|nb|nn)/i.test(i18n.resolvedLanguage || i18n.language);
  return useCallback((en, nb) => norwegian ? nb : en, [norwegian]);
}
export function offerStatus(status, text) {
  const labels = {
    WAITING_FOR_VENDOR:['Waiting for vendor','Venter på leverandør'], OFFERED:['Offer received','Tilbud mottatt'],
    ACCEPTED:['Accepted · awaiting payment','Godtatt · venter på betaling'], DECLINED:['Declined','Avslått'],
    EXPIRED:['Expired','Utløpt'], CLOSED:['Closed','Lukket'], ORDERED:['Ordered','Bestilt'],
  };
  return text(...(labels[status] || ['Status unavailable','Status utilgjengelig']));
}
export function offerError(error, text) {
 const extensions=error?.graphqlErrors?.[0]?.extensions;
 const serverMessage=text(extensions?.message_en,extensions?.message_nb);
 if(typeof serverMessage==='string' && serverMessage.trim())return serverMessage;
 const code=error?.code || error?.graphqlErrors?.[0]?.extensions?.code;
 const messages={OFFER_DETAILS_REFRESH_FAILED:["Your action was saved. Refresh to load the latest details before continuing.","Handlingen er lagret. Oppdater for \u00e5 laste de nyeste detaljene f\u00f8r du fortsetter."],OFFER_SUBMISSION_UNCONFIRMED:["We could not confirm the response. Check My offers before sending again.","Vi kunne ikke bekrefte svaret. Sjekk Mine tilbud f\u00f8r du sender p\u00e5 nytt."],OFFER_LIMIT_REACHED:['You already have the maximum number of open requests.','Du har allerede maksimalt antall åpne forespørsler.'],VENDOR_OFFER_LIMIT_REACHED:['You already have an open request with this vendor.','Du har allerede en åpen forespørsel hos denne leverandøren.'],OFFER_EXPIRED:['This offer has expired.','Tilbudet har utløpt.'],OFFER_REVISION_CONFLICT:['The offer changed. Refresh and review the latest price before continuing.','Tilbudet er endret. Oppdater og se gjennom den nye prisen før du fortsetter.'],OFFER_UNAVAILABLE:['This menu or vendor is no longer available.','Menyen eller leverandøren er ikke lenger tilgjengelig.'],OFFER_PRICE_INVALID:['The price must be above zero and below the original price.','Prisen må være over null og under den opprinnelige prisen.']};
 const detail=String(error?.technicalMessage || error?.message || '');
 if (error?.status===401 || ['UNAUTHENTICATED','AUTHENTICATION_REQUIRED','TOKEN_EXPIRED'].includes(code) || /invalid.*token|token.*expired|session expired|authentication required|unauthenticated|not logged in|login required/i.test(detail)) {
  return text('Please sign in again before sending your request.','Logg inn p\u00e5 nytt f\u00f8r du sender foresp\u00f8rselen.');
 }
 if (/failed to fetch|networkerror|network request|load failed|unable to connect|fetch failed/i.test(detail)) {
  return text('Could not connect. Check your internet connection and try again.','Kunne ikke koble til. Sjekk internettforbindelsen og pr\u00f8v igjen.');
 }
 const reference=typeof code==='string'&&/^[A-Z][A-Z0-9_]{1,63}$/.test(code)?code:(Number.isInteger(error?.status)?`HTTP_${error.status}`:'');
 const fallback=text('Unable to complete this action. Please try again.','Handlingen kunne ikke fullf\u00f8res. Pr\u00f8v igjen.');
 return messages[code]?text(...messages[code]):fallback+(reference?' ('+reference+')':'');
}
