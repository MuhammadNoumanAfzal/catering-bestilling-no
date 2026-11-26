import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptedOfferCart } from '../../offers/offerModel.js';
import { buildOrderItems, buildCheckoutPreviewItems } from './checkoutItems.js';
import { buildDinteroOrderInput } from '../../payments/dinteroClient.js';
import { buildCreateOrderVariables } from './checkoutMutations.js';
const request=()=>({id:'14',revision:'3',status:'ACCEPTED',deliveryDate:'2099-12-10',deliveryTime:'11:15',personCount:20,postalCode:'0001',quote:{revision:'q',pricePerPerson:'200',expiresAt:'2099-12-09T20:00:00Z'},checkoutSnapshot:{vendor:{id:'v',slug:'vendor'},items:[{id:'line',productId:'menu',name:'Menu',unitPrice:'200',catalogueUnitPrice:'700',pricingType:'per-person',quantity:1}]}});
test('accepted discounted offer without independent metadata sends guests in preview and final order',()=>{
 const cart=acceptedOfferCart(request());const {items,personCount}=cart.orderSummary;
 const preview=buildCheckoutPreviewItems(items,personCount);
 const order=buildOrderItems(items,personCount);
 assert.equal(preview[0].personCount,20);assert.equal(order[0].personCount,20);
 const variables=buildCreateOrderVariables(buildDinteroOrderInput({items:order,personCount,offerRequestId:'14',offerQuoteRevision:'q'},'https://gocatering.no'));
 assert.equal(variables.input.items[0].personCount,20);
 assert.equal(variables.input.offerQuoteRevision,'q');
 assert.equal(cart.orderSummary.items[0].unitPrice,'200');
 assert.equal(cart.orderSummary.offer.itemsSignature.includes('menu'),true);
});
test('legacy saved offer carts and changed shared guest counts use the current order count',()=>{
 const items=request().checkoutSnapshot.items;
 for(const count of [20,21,30])assert.equal(buildOrderItems([{...items[0],personCount:19}],count)[0].personCount,count);
});
test('independent products retain their own guest count and missing counts use order guests',()=>{
 const item={productId:'dish',quantity:1,pricingType:'per-person',addOnType:'INDEPENDENT',personCount:8,minimumGuests:5};
 assert.equal(buildOrderItems([item],20)[0].personCount,8);
 assert.equal(buildOrderItems([{...item,personCount:null}],20)[0].personCount,20);
});
test('missing, zero, fractional and invalid guest counts fail before an order write',()=>{
 for(const count of [undefined,null,0,-1,1.5,Infinity,'bad'])assert.throws(()=>buildOrderItems(request().checkoutSnapshot.items,count));
});
test('ordinary quantity products and attached addons retain their existing payload contract',()=>{
 const items=[{productId:'menu',pricingType:'fixed',quantity:2,selectedOptions:{size:'large'}},{productId:'extra',isAddOn:true,parentMenuItemId:'menu',name:'Bread',quantity:3}];
 assert.deepEqual(buildOrderItems(items,20),[{product:'menu',quantity:2,selectedOptions:{size:'large'},selectedAddons:[{name:'Bread',quantity:3}]}]);
 assert.deepEqual(buildCheckoutPreviewItems(items,20),[{productId:'menu',quantity:2,selectedAddons:[{name:'Bread',quantity:3}]}]);
});

test('accepted offer binds independent primary line to agreed guests even in old normalized carts',()=>{
 const r=request();r.checkoutSnapshot.items[0].addOnType='INDEPENDENT';r.checkoutSnapshot.items[0].personCount=1;
 const cart=acceptedOfferCart(r);assert.equal(cart.orderSummary.items[0].personCount,20);
 const old=[{...r.checkoutSnapshot.items[0],personCount:1}];
 assert.equal(buildOrderItems(old,20,true)[0].personCount,20);
 assert.equal(buildCheckoutPreviewItems(old,20,true)[0].personCount,20);
});
