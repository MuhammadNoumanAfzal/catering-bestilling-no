import test from 'node:test';
import assert from 'node:assert/strict';
import {buildModificationEstimateInput,modificationAmounts} from './modificationPricing.js';
const form={date:'2026-12-20',time:'12:00',personCount:12,address:'Street 1',city:'Oslo',postalCode:'0182'};
const order={vendor:{id:'12'},customerType:'Private',pricing:{tipAmount:'20'},items:[{product:{id:'menu'},quantity:1,selectedOptions:{size:'large'},selectedAddons:[{name:'Bread',quantity:2,price:999}]},{product:{id:'single'},quantity:2,addOnType:'INDEPENDENT',personCount:7}]};
test('server preview receives new menu guests but keeps independent guests, quantities and add-ons',()=>{
 const input=buildModificationEstimateInput(order,form);
 assert.equal(input.personCount,12);assert.equal(input.items[0].quantity,1);assert.equal(input.items[0].personCount,undefined);
 assert.equal(input.items[1].personCount,7);assert.equal(input.items[1].quantity,2);
 assert.deepEqual(input.items[0].selectedAddons,[{name:'Bread',quantity:2}]);
 assert.equal(input.deliveryPostalCode,'0182');assert.equal(input.tipAmount,'20');
});
test('incomplete details cannot produce a fabricated estimate',()=>{
 assert.equal(buildModificationEstimateInput(null,form),null);
 assert.equal(buildModificationEstimateInput(order,{...form,personCount:0}),null);
 assert.equal(buildModificationEstimateInput(order,{...form,postalCode:'1'}),null);
 assert.throws(()=>buildModificationEstimateInput({...order,items:[{quantity:1}]},form));
});
test('server totals compare safely and missing totals stay unavailable',()=>{
 assert.deepEqual(modificationAmounts('3800.00',{pricing:{grandTotal:'4560'}}),{current:3800,proposed:4560,delta:760});
 assert.deepEqual(modificationAmounts(null,null),{current:null,proposed:null,delta:null});
 assert.equal(modificationAmounts('bad',{pricing:{grandTotal:'0'}}).current,null);
 assert.equal(modificationAmounts('100',{pricing:{grandTotal:'80'}}).delta,-20);
});

import {buildOrderModificationPreviewInput,orderModificationAmounts} from './modificationPricing.js';
test('order-specific preview retains stored items and tip by omitting unsupported edits',()=>{
 assert.deepEqual(buildOrderModificationPreviewInput({id:'42'},form),{personCount:12,deliveryPostalCode:'0182',deliveryAddress:'Street 1'});
 assert.equal(buildOrderModificationPreviewInput({},form),null);
});
test('order-specific preview uses server delta and keeps missing totals unavailable',()=>{
 assert.deepEqual(orderModificationAmounts({currentTotal:'100',proposedTotal:'120',delta:'20'},90),{current:100,proposed:120,delta:20});
 assert.deepEqual(orderModificationAmounts(null,'90'),{current:90,proposed:null,delta:null});
});
