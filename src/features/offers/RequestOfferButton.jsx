import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Send, Tag, Users, X } from 'lucide-react';
import { useAuth } from '../auth';
import { offerRequest, newIdempotencyKey, offersEnabled } from './offerApi';
import { hasContactDetails, moneyToOre } from './offerModel';
import { useOfferText, offerError } from './offerText';
import { fetchVendors } from '../vendor/api/vendorService';
import { adaptApiVendorToProfile } from '../vendor/api/vendorMappers';
import { isVendorAvailableForPostalCode } from '../vendor/services/vendorAvailability';
import DeliveryAreas from './DeliveryAreas';
import './Offers.css';
export default function RequestOfferButton({vendor,menu,summary,items,eligible=true}) {
 const text=useOfferText(),{isLoggedIn}=useAuth(),navigate=useNavigate(),location=useLocation();
 const [open,setOpen]=useState(false),[message,setMessage]=useState(''),[target,setTarget]=useState(''),[postcode,setPostcode]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [coverage,setCoverage]=useState(null),[coverageLoading,setCoverageLoading]=useState(false),[coverageFailed,setCoverageFailed]=useState(false),[coverageAttempt,setCoverageAttempt]=useState(0);
 const loadCoverage=useCallback(async()=>{
  const vendors=await fetchVendors();
  const current=vendors.find(candidate=>String(candidate.id)===String(vendor.id));
  if(!current)throw new Error('Vendor unavailable');
  return adaptApiVendorToProfile(current);
 },[vendor.id]);
 useEffect(()=>{
  if(!open)return;
  let active=true;
  loadCoverage().then(profile=>{if(active)setCoverage(profile);}).catch(()=>{if(active)setCoverageFailed(true);}).finally(()=>{if(active)setCoverageLoading(false);});
  return ()=>{active=false;};
 },[open,loadCoverage,coverageAttempt]);
 const validPostcode=/^\d{4}$/.test(postcode);
 const covered=validPostcode&&Boolean(coverage)&&isVendorAvailableForPostalCode(coverage,postcode);
 const deliveryAreas=coverage?.serviceAreas||[];
 const pending=useRef(false),keys=useRef(new Map()),dialog=useRef(null),button=useRef(null);
 useEffect(()=>{
  if(open){dialog.current?.showModal();dialog.current?.querySelector('input')?.focus();}else {dialog.current?.close();}
 },[open]);
 if(!offersEnabled||!eligible)return null;
 const ready=Boolean(summary?.deliveryDate&&summary?.deliveryTime&&Number(summary?.personCount)>0);
 async function submit(event){
  event.preventDefault();if(pending.current||!ready||!covered||coverageLoading||coverageFailed)return;pending.current=true;setBusy(true);setError('');
  const input={vendorId:String(vendor.id),menuId:String(menu.id),deliveryDate:summary.deliveryDate,deliveryTime:summary.deliveryTime,personCount:Number(summary.personCount),postalCode:postcode,message:message.trim(),targetPricePerPerson:target?target.replace(',','.'):null,items};
  const signature=JSON.stringify(input);if(!keys.current.has(signature))keys.current.set(signature,newIdempotencyKey());
  try{
   const freshCoverage=await loadCoverage();setCoverage(freshCoverage);
   if(!isVendorAvailableForPostalCode(freshCoverage,postcode)){
    setError(text('This vendor does not deliver to this postcode. Choose a postcode in their delivery area.','Leverand\u00f8ren leverer ikke til dette postnummeret. Velg et postnummer i leveringsomr\u00e5det.'));return;
   }
   await offerRequest('create',{input:{...input,idempotencyKey:keys.current.get(signature)}});setOpen(false);navigate('/account/my-offers',{state:{requestSent:true}});}
  catch(err){setError(offerError(err,text));}finally{pending.current=false;setBusy(false);}
 }
 function close(){if(!pending.current){setOpen(false);button.current?.focus();}}
 return <div className="offer-request-entry"><button ref={button} type="button" className="offer-button request full" disabled={!ready} onClick={()=>{
  if(!isLoggedIn){navigate('/signin',{state:{from:location}});return;}
  setPostcode(/^\d{4}$/.test(String(summary.deliveryAddress||''))?String(summary.deliveryAddress):'');setError('');setCoverage(null);setCoverageLoading(true);setCoverageFailed(false);setOpen(true);
 }}><Tag size={16}/>{text('Request an offer','Be om tilbud')}</button><p>{ready?text('Get a personal price before you order.','Få en personlig pris før du bestiller.'):text('Choose date, time and number of guests first.','Velg dato, tid og antall gjester først.')}</p>
 <dialog ref={dialog} className="offer-dialog" onCancel={e=>{e.preventDefault();close();}} onClose={()=>setOpen(false)} aria-labelledby="request-offer-title"><form onSubmit={submit}><header><div><p className="offers-eyebrow">{vendor.name}</p><h2 id="request-offer-title">{text('Request an offer','Be om tilbud')}</h2></div><button type="button" className="offer-close" disabled={busy} onClick={close} aria-label={text('Close','Lukk')}><X size={20}/></button></header><div className="offer-request-summary"><Tag size={22}/><div><strong>{menu.title||menu.name||menu.modal?.heading}</strong><div className="offer-meta"><span><CalendarDays size={13}/>{summary.deliveryDate} · {summary.deliveryTime}</span><span><Users size={13}/>{summary.personCount} {text('guests','gjester')}</span></div></div></div><p className="offer-fine-print">{text('The vendor has 72 hours to respond. You will receive an email when they reply.','Leverandøren har 72 timer til å svare. Du får en e-post når de svarer.')}</p><label>{text('Delivery postcode','Postnummer for levering')}<input required pattern="[0-9]{4}" inputMode="numeric" maxLength={4} autoComplete="postal-code" value={postcode} aria-describedby="offer-postcode-coverage" aria-invalid={validPostcode&&Boolean(coverage)&&!covered} onChange={e=>{setPostcode(e.target.value.replace(/\D/g,'').slice(0,4));setError('');}}/></label><div id="offer-postcode-coverage" className="offer-postcode-coverage" role="status" aria-live="polite">
 {coverageLoading?<p>{text('Checking delivery areas...','Sjekker leveringsomr\u00e5der...')}</p>:coverageFailed?<><p>{text('Delivery coverage could not be checked. Please retry before sending.','Kunne ikke sjekke levering. Pr\u00f8v igjen f\u00f8r du sender.')}</p><button type="button" className="offer-button secondary" onClick={()=>{setCoverage(null);setCoverageLoading(true);setCoverageFailed(false);setCoverageAttempt(value=>value+1);}}>{text('Retry','Pr\u00f8v igjen')}</button></>:validPostcode&&coverage?<>
 <p className={covered?'offer-coverage-available':'offer-coverage-unavailable'}>{covered?text('Delivery is available to this postcode.','Levering er tilgjengelig til dette postnummeret.'):text('Sorry, this vendor does not deliver to this postcode.','Beklager, leverand\u00f8ren leverer ikke til dette postnummeret.')}</p>
 {!covered&&(deliveryAreas.length?<DeliveryAreas areas={deliveryAreas} text={text}/>:<p>{text('No delivery areas are currently available for this vendor.','Ingen leveringsomr\u00e5der er tilgjengelige for denne leverand\u00f8ren.')}</p>)}
 </>:null}</div><label>{text('Message to the vendor','Melding til leverandøren')}<textarea required minLength={2} maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)} placeholder={text('Tell the vendor what you are looking for…','Fortell leverandøren hva du ønsker…')}/></label><label>{text('Target price per person (optional, NOK)','Ønsket pris per person (valgfritt, NOK)')}<input inputMode="decimal" value={target} onChange={e=>setTarget(e.target.value)} /></label>{hasContactDetails(message)?<div className="offer-notice warning">{text('Contact details and links will be hidden. Please keep the conversation on GoCatering.','Kontaktopplysninger og lenker skjules. Hold samtalen på GoCatering.')}</div>:null}{error?<div className="offer-notice error" role="alert">{error}</div>:null}<footer><button type="button" className="offer-button secondary" disabled={busy} onClick={close}>{text('Cancel','Avbryt')}</button><button className="offer-button primary" disabled={busy||!ready||!covered||coverageLoading||coverageFailed||!message.trim()||(target&&(moneyToOre(target)===null||moneyToOre(target)<=0))}><Send size={16}/>{busy?text('Sending…','Sender…'):text('Send request','Send forespørsel')}</button></footer><p className="offer-fine-print">{text('You pay nothing until you accept an offer and pay in checkout.','Du betaler ingenting før du godtar et tilbud og betaler i kassen.')}</p></form></dialog></div>;
}
