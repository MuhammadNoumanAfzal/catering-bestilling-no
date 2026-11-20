import test from 'node:test';import assert from 'node:assert/strict';
import {readVendorCatalogue,mergeVendorCatalogue} from './vendorCatalogue.js';
test('all pages load, duplicate edges deduplicate, stalled pagination fails',async()=>{
 const pages=[{edges:[{node:{id:'1'}}],pageInfo:{hasNextPage:true,endCursor:'next'}},{edges:[{node:{id:'1'}},{node:{id:'2'}}],pageInfo:{hasNextPage:false}}];
 const cursors=[];assert.equal((await readVendorCatalogue(async after=>{cursors.push(after);return pages.shift();})).length,2);assert.deepEqual(cursors,[null,'next']);
 await assert.rejects(()=>readVendorCatalogue(async()=>({edges:[],pageInfo:{hasNextPage:true,endCursor:'same'}})),/did not advance/);
});
test('uncategorized active singles appear once; paused and dependent add-ons stay hidden',()=>{
 const existing={id:'1',menuStatus:'active',productType:'add-on',addOnType:'INDEPENDENT'};
 const vendor={menuCategories:[{id:'c',name:'Enkeltprodukter',vendorProducts:[existing]}]};
 const added={...existing,id:'2'};const merged=mergeVendorCatalogue(vendor,[existing,added,added,{...added,id:'3',menuStatus:'paused'},{...added,id:'4',addOnType:'DEPENDENT'}]);
 assert.deepEqual(merged.menuCategories[0].vendorProducts.map(p=>p.id),['1','2']);assert.equal(vendor.menuCategories[0].vendorProducts.length,1);
 assert.equal(mergeVendorCatalogue({menuCategories:[]},[added]).menuCategories[0].vendorProducts[0].id,'2');
});
