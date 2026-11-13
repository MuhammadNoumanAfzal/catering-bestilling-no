import test from 'node:test';
import assert from 'node:assert/strict';
import {checkoutPaymentUrl,paymentState,createDinteroClient,dinteroReturnUrl,buildDinteroOrderInput} from './dinteroClient.js';
test('redirects only to trusted HTTPS Dintero checkout hosts',()=>{
 assert.equal(checkoutPaymentUrl('https://checkout.dintero.com/session/abc'),'https://checkout.dintero.com/session/abc');
 assert.equal(checkoutPaymentUrl('https://checkout.api.dintero.com/v1/view/abc/'),'https://checkout.api.dintero.com/v1/view/abc/');
 for(const url of ['javascript:alert(1)','https://checkout.dintero.com.evil.test','https://user:pass@checkout.dintero.com','http://checkout.dintero.com','https://evil.test'])assert.throws(()=>checkoutPaymentUrl(url));
});
test('only backend PAID means paid; pending and failed are never success',()=>{
 assert.equal(paymentState({customerPaymentStatus:'PAID'}),'paid');
 for(const status of ['PENDING','UNPAID','PARTIALLY_PAID'])assert.equal(paymentState({customerPaymentStatus:status}),'pending');
 assert.equal(paymentState({customerPaymentStatus:'FAILED'}),'retry');
 for(const status of ['CANCELLED','VOIDED','RELEASED'])assert.equal(paymentState({customerPaymentStatus:status}),'released');
 assert.equal(paymentState({status:'CANCELLED',customerPaymentStatus:'UNPAID'}),'orderCancelled');
 assert.equal(paymentState({customerPaymentStatus:'AUTHORIZED'}),'reserved');
});
test('retry creates a payment session for the existing order and local return URL',async()=>{
 let input;
 const client=createDinteroClient(async request=>{input=request.variables.input;assert.match(request.query,/createDinteroCheckoutSession/);return {createDinteroCheckoutSession:{success:true,orderId:'43',sessionId:'test.session',paymentUrl:'https://checkout.dintero.com/session/43'}};});
 await client.session('43','https://gocatering.no');
 assert.deepEqual(input,{orderId:'43',returnUrl:'https://gocatering.no/orders/43?payment=dintero'});
});
test('backend failures and unsafe payment URLs never produce a usable checkout',async()=>{
 for(const result of [{success:false,message:'Not allowed'},{success:true,orderId:'43',sessionId:'a',paymentUrl:'https://evil.test'}])await assert.rejects(()=>createDinteroClient(async()=>({createDinteroCheckoutSession:result})).session('43','https://gocatering.no'));
});
test('status uses authenticated order query and rejects missing responses',async()=>{
 let variables;
 const client=createDinteroClient(async input=>{variables=input.variables;return {clientOrder:{id:'43',customerPaymentStatus:'PENDING'}};});
 assert.equal((await client.status('43')).customerPaymentStatus,'PENDING');assert.deepEqual(variables,{id:'43'});
 await assert.rejects(()=>createDinteroClient(async()=>({})).status('43'));
});

test('initial placement preserves literal backend placeholder and current local or production origin',()=>{
 for(const origin of ['http://localhost:5174','http://127.0.0.1:3000','https://gocatering.no']) {
  const payload={vendorId:'12',items:[{product:'45',quantity:15}],deliveryPostalCode:'0182'};
  const input=buildDinteroOrderInput(payload,origin);
  assert.equal(input.returnUrl,origin+'/orders/{orderId}?payment=dintero');
  assert.equal(input.paymentMethod,'DINTERO');assert.deepEqual(input.items,payload.items);
  assert.equal(input.deliveryPostalCode,'0182');assert.equal(payload.returnUrl,undefined);
 }
});
test('retry returns to the local testing origin and encodes order IDs',()=>{
 assert.equal(dinteroReturnUrl('http://localhost:5174','38'),'http://localhost:5174/orders/38?payment=dintero');
 assert.equal(dinteroReturnUrl('https://gocatering.no','ClientOrder:38'),'https://gocatering.no/orders/ClientOrder%3A38?payment=dintero');
});
test('rejected orders do not offer payment',()=>assert.equal(paymentState({status:'REJECTED',customerPaymentStatus:'UNPAID'}),'orderCancelled'));

test('reserved funds never become captured payments or an eligible payment retry',()=>{
 const state=paymentState({customerPaymentStatus:'AUTHORIZED'});
 assert.equal(state,'reserved');assert.notEqual(state,'paid');assert.equal(['pending','retry'].includes(state),false);
});
