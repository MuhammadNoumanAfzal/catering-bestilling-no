import { dateTime } from './offerFormat';
import { useOfferText } from './offerText';
import './Offers.css';
export default function OfferCheckoutNotice({carts}) {
 const text=useOfferText();const offers=carts.filter(cart=>cart.orderSummary.offer);
 if(!offers.length)return carts.some(cart=>cart.orderSummary.offerRemoved)?<div className="offer-notice warning">{text('Order details changed, so normal prices apply. Returning to the original details will recheck and restore the offer if it is still valid.','Tilbudet ble fjernet fordi bestillingsdetaljene ble endret. Ordinære priser beregnes på nytt.')}</div>:null;
 return <div className="offer-notice warning"><strong>{text('Agreed offer price applied','Avtalt tilbudspris er brukt')}</strong>{offers.map(cart=><span key={cart.vendor.id}>{cart.vendor.name} · {text('Valid until','Gyldig til')} {dateTime(cart.orderSummary.offer.expiresAt,text)}</span>)}<span>{text('Changing date, time, guests, postcode or menu items removes the offer and restores normal pricing. The price is checked again before payment.','Endring av dato, tid, gjester, postnummer eller menyvarer fjerner tilbudet og gjenoppretter ordinær pris. Prisen kontrolleres igjen før betaling.')}</span></div>;
}
