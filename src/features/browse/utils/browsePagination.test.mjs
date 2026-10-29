import {test} from "node:test";
import assert from "node:assert/strict";
import {BROWSE_PAGE_SIZE,fetchBrowseBatch} from "./browsePagination.js";
test("browse batch fills 100 items despite a smaller server page cap",async()=>{let calls=0;const result=await fetchBrowseBatch(async({first,after})=>{calls++;const start=Number(after||0),count=Math.min(first,24,150-start);return {items:Array.from({length:count},(_,i)=>({id:start+i})),totalCount:150,pageInfo:{hasNextPage:start+count<150,endCursor:String(start+count)}};},{});assert.equal(BROWSE_PAGE_SIZE,100);assert.equal(result.items.length,100);assert.equal(calls,5);assert.equal(result.pageInfo.endCursor,"100");});
test("small catalogs return all results without extra requests",async()=>{let calls=0;const result=await fetchBrowseBatch(async()=>{calls++;return {items:[{id:1}],pageInfo:{hasNextPage:false}};},{});assert.equal(result.items.length,1);assert.equal(calls,1);});
test("repeated cursors reject rather than loop indefinitely",async()=>{await assert.rejects(fetchBrowseBatch(async()=>({items:[{id:1}],pageInfo:{hasNextPage:true,endCursor:"same"}}),{}));});
