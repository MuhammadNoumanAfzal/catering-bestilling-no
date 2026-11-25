import test from 'node:test';
import assert from 'node:assert/strict';
import { offerSavings } from './offerSavings.js';
test('checkout displays snapshot savings without changing payable amounts',()=>{
 const summary={personCount:30,offer:{personCount:30,pricePerPerson:'500'},items:[{quantity:1,pricingType:'per-person',catalogueUnitPrice:'700',unitPrice:'500'}]};
 const saved=JSON.stringify(summary);
 assert.deepEqual(offerSavings(summary),{original:21000,agreed:15000,savings:6000});
 assert.equal(JSON.stringify(summary),saved);
 assert.equal(offerSavings({...summary,offer:null}),null);
 assert.equal(offerSavings({...summary,personCount:31}),null);
});
