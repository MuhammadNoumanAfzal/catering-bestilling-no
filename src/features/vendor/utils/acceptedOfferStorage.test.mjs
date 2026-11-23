import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptedOfferCart } from '../../offers/offerModel.js';
import { readOrderSummary, writeOrderSummary, readAllStoredOrderSummaries } from './orderSummaryStorage.js';

test('accepted offer with minimal server vendor stores and restores without crashing or changing prices', () => {
  const previous = globalThis.window;
  const storage = {};
  Object.defineProperties(storage, {
    getItem: {value(key) { return this[key] ?? null; }},
    setItem: {value(key,value) { this[key] = value; }},
    removeItem: {value(key) { delete this[key]; }},
  });
  globalThis.window = { sessionStorage: storage, dispatchEvent() {} };
  try {
    const request = {id:'5',revision:'2',status:'ACCEPTED',deliveryDate:'2099-12-10',deliveryTime:'12:00',postalCode:'1400',personCount:10,quote:{revision:'q1',pricePerPerson:'400.00',expiresAt:'2099-12-09T12:00:00Z'},checkoutSnapshot:{vendor:{id:'2',slug:'gastronomen',name:'Gastronomen'},items:[{productId:'12',quantity:1,pricingType:'per-person',unitPrice:'400.00',catalogueUnitPrice:'500.00'}]}};
    const cart=acceptedOfferCart(request);
    assert.deepEqual(readOrderSummary(cart.vendor).items,[]);
    writeOrderSummary('other-vendor',{items:[{productId:'other',unitPrice:99}]},{id:'other',slug:'other-vendor',name:'Other'});
    writeOrderSummary(cart.vendor,{...cart.orderSummary,offer:{...cart.orderSummary.offer,customerId:'customer'}});
    const restored=readAllStoredOrderSummaries();
    assert.equal(restored.length,2);
    const offered=restored.find(item=>item.vendor.slug==='gastronomen');
    assert.equal(offered.orderSummary.offer.requestId,'5');
    assert.equal(offered.orderSummary.offer.customerId,'customer');
    assert.equal(offered.orderSummary.items[0].unitPrice,'400.00');
    assert.equal(offered.orderSummary.items[0].catalogueUnitPrice,'500.00');
    assert.equal(offered.orderSummary.deliveryDate,'2099-12-10');
    assert.equal(offered.orderSummary.personCount,10);
  } finally { if(previous===undefined)delete globalThis.window;else globalThis.window=previous; }
});
