import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptedOfferCart, restoreCatalogueSummary } from './offerModel.js';
import { restoreMatchingOffer } from './offerRestoration.js';

function request() {
  return { id:'6',revision:'2',status:'ACCEPTED',deliveryDate:'2099-12-10',deliveryTime:'11:15',postalCode:'1400',personCount:30,quote:{revision:'q1',pricePerPerson:'500.00',expiresAt:'2099-12-09T12:00:00Z'},checkoutSnapshot:{vendor:{id:'2',slug:'gastronomen',name:'Gastronomen'},items:[{productId:'12',quantity:1,pricingType:'per-person',unitPrice:'500.00',catalogueUnitPrice:'700.00'}]}};
}
function suspended() {
  const cart=acceptedOfferCart(request());
  cart.orderSummary.offer.customerId='customer';
  return {...cart,orderSummary:restoreCatalogueSummary(cart.orderSummary)};
}
const form=()=>({date:'2099-12-10',time:'11:15',deliveryPostalCode:'1400',personCount:30});

test('30 to 31 removes negotiated pricing, and returning to 30 restores the fresh accepted price',()=>{
  const cart=suspended();cart.orderSummary.personCount=31;
  assert.equal(cart.orderSummary.items[0].unitPrice,'700.00');
  assert.equal(restoreMatchingOffer(cart,{...form(),personCount:31},request(),'customer','6'),null);
  cart.orderSummary.personCount=30;
  const restored=restoreMatchingOffer(cart,form(),request(),'customer','6');
  assert.equal(restored.orderSummary.items[0].unitPrice,'500.00');
  assert.equal(restored.orderSummary.offer.customerId,'customer');
  assert.equal(restored.orderSummary.offerRemoved,false);
  assert.equal(restored.orderSummary.suspendedOffer,null);
  assert.equal(restored.orderSummary.pricing,null);
});

test('date, time, postcode, items and guest counts must all return to the exact original terms',()=>{
  for(const patch of [{date:'2099-12-11'},{time:'12:00'},{deliveryPostalCode:'1401'},{personCount:31}])assert.equal(restoreMatchingOffer(suspended(),{...form(),...patch},request(),'customer','6'),null);
  const cart=suspended();cart.orderSummary.items[0].quantity=2;
  assert.equal(restoreMatchingOffer(cart,form(),request(),'customer','6'),null);
});

test('expired, changed, unaccepted and cross-account offers are never restored',()=>{
  for(const patch of [{id:'other'},{status:'DECLINED'},{quote:{revision:'new',pricePerPerson:'500.00',expiresAt:'2099-12-09T12:00:00Z'}},{quote:{revision:'q1',pricePerPerson:'500.00',expiresAt:'2000-01-01T00:00:00Z'}}])assert.equal(restoreMatchingOffer(suspended(),form(),{...request(),...patch},'customer','6'),null);
  assert.equal(restoreMatchingOffer(suspended(),form(),request(),'other-user','6'),null);
});

test('server snapshot prices are required and an already applied offer is not rewritten',()=>{
  const malformed=request();malformed.checkoutSnapshot.items[0].unitPrice='1.00';
  assert.equal(restoreMatchingOffer(suspended(),form(),malformed,'customer','6'),null);
  assert.equal(restoreMatchingOffer(acceptedOfferCart(request()),form(),request(),'customer','6'),null);
});
