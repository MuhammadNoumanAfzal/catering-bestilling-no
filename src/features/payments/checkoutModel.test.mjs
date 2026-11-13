import test from 'node:test';
import assert from 'node:assert/strict';
import {paymentPagePath,validDinteroSessionId,hostedSessionUrl,normalizePaymentOrder} from './checkoutModel.js';
import {mountCheckout} from './mountCheckout.js';
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
test('payment routes and hosted fallbacks cannot inject external destinations',()=>{
 assert.equal(paymentPagePath('ClientOrder:39'),'/payment/ClientOrder%3A39');
 assert.equal(hostedSessionUrl('T11117207.test-session'),'https://checkout.dintero.com/v1/view/T11117207.test-session/');
 for(const value of ['https://evil.test','T123.a/../b','T123.a?redirect=evil','T123.a#b',null,'']){assert.equal(validDinteroSessionId(value),false);assert.throws(()=>hostedSessionUrl(value));}
});
test('server amounts stay unchanged and missing totals do not become zero',()=>{
 const result=normalizePaymentOrder({id:'39',grandTotal:'3800.00',dinteroSessionId:'T123.abc',items:[{productName:'Menu',lineTotal:'3800.00'}]});
 assert.equal(result.grandTotal,'3800.00');assert.equal(result.sessionId,'T123.abc');
 for(const value of [null,{id:'39'},{id:'39',grandTotal:'bad'},{id:'39',grandTotal:'-1'}])assert.throws(()=>normalizePaymentOrder(value));
 assert.equal(normalizePaymentOrder({id:'39',grandTotal:'0',dinteroSessionId:'https://evil.test'}).sessionId,null);
});
test('SDK uses pop-out, disables sensitive logging and sends all outcomes to server verification',async()=>{
 let options,returned=0,destroyed=0,ready=0;
 const cleanup=mountCheckout({embed:async value=>{options=value;return {destroy(){destroyed++;}};},container:{},sessionId:'T123.abc',language:'no',onReturn:()=>returned++,onReady:()=>ready++,onError:()=>{}});
 await tick();assert.equal(options.popOut,true);assert.equal(options.debug,false);assert.equal(ready,0);
 options.onSession();assert.equal(ready,1);
 options.onPayment({type:'SessionPaymentOnHold'});options.onPaymentError();options.onSessionCancel();assert.equal(returned,3);
 cleanup();assert.equal(destroyed,1);options.onPayment();assert.equal(returned,3);
});
test('SDK instances finishing after unmount are destroyed without publishing UI state',async()=>{
 let resolve,destroyed=0;
 const cleanup=mountCheckout({embed:()=>new Promise(value=>{resolve=value;}),container:{},sessionId:'T123.abc',language:'en',onReady:()=>assert.fail('Unmounted'),onReturn:()=>assert.fail('Unmounted'),onError:()=>assert.fail('Unmounted')});
 await tick();cleanup();resolve({destroy(){destroyed++;}});await tick();assert.equal(destroyed,1);
});
test('SDK failures expose fallback rather than marking a payment successful',async()=>{
 let failed=0;
 mountCheckout({embed:async()=>{throw new Error('Unavailable');},container:{},sessionId:'T123.abc',language:'en',onReady:()=>assert.fail('Failed'),onReturn:()=>assert.fail('Failed'),onError:()=>failed++});
 await tick();assert.equal(failed,1);
});
