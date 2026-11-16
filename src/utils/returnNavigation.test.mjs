import test from 'node:test';
import assert from 'node:assert/strict';
import {createReturnState,resolveReturnNavigation} from './returnNavigation.js';
test('returns to exact product listing with filters, pagination and hash',()=>{
 const source={pathname:'/browse/occasion',search:'?category=birthday&page=2',hash:'#menus',state:null};
 assert.equal(resolveReturnNavigation(createReturnState(source),'/').to,'/browse/occasion?category=birthday&page=2#menus');
});
test('vendor to product to vendor preserves original browse-all return',()=>{
 const listing={pathname:'/vendors/all',search:'?postalCode=1400',state:null};
 const vendor={pathname:'/vendor/gastronomen',state:createReturnState(listing)};
 const back=resolveReturnNavigation(createReturnState(vendor),'/');
 assert.equal(back.to,'/vendor/gastronomen');
 assert.equal(resolveReturnNavigation(back.state,'/').to,'/vendors/all?postalCode=1400');
});
test('direct links use deterministic fallback and reject unsafe targets',()=>{
 for(const state of [null,{from:'https://example.com'},{from:'//example.com'}]) assert.deepEqual(resolveReturnNavigation(state,'/vendors/all'),{to:'/vendors/all',state:null});
});
test('legacy location-object return state stays supported',()=>{
 assert.equal(resolveReturnNavigation({from:{pathname:'/products/popular',search:'?page=3'}},'/').to,'/products/popular?page=3');
});

test('return links restore listing scroll without losing nested return state',()=>{const result=resolveReturnNavigation({from:'/?category=selskapsmat',fromScrollY:1260,fromState:{from:'/browse/occasion?category=wedding'}},'/');assert.equal(result.to,'/?category=selskapsmat');assert.deepEqual(result.state,{from:'/browse/occasion?category=wedding',__restoreScrollY:1260});assert.equal(resolveReturnNavigation({from:'/',fromScrollY:-1},'/').state,null);assert.equal(resolveReturnNavigation({from:'/',fromScrollY:Infinity},'/').state,null);});
