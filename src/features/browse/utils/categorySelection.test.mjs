import test from "node:test";
import assert from "node:assert/strict";
import { toggleCategorySelection, getCategoryParamValue, parseCategoryParamValue, matchesCategorySelection } from "./categoryFilters.js";
import { fetchCategoryUnion } from "./categoryUnion.js";
test("selecting and removing categories preserves other choices and URL round trips",()=>{
 let selected=toggleCategorySelection(null,"birthday");selected=toggleCategorySelection(selected,"wedding");
 assert.deepEqual(selected,["birthday","wedding"]);assert.deepEqual(parseCategoryParamValue(getCategoryParamValue(selected)),selected);
 assert.deepEqual(toggleCategorySelection(selected,"birthday"),["wedding"]);
 assert.equal(toggleCategorySelection(["wedding"],"wedding"),null);
 assert.equal(matchesCategorySelection(["wedding"],selected),true);
});
test("food type and occasion requests include every selection and deduplicate overlapping menus across pages",async()=>{
 for(const field of ["foodTypeSlug","occasionSlug"]){const calls=[];
 const result=await fetchCategoryUnion(async vars=>{calls.push(vars);const slug=vars[field];return vars.after?{items:[{id:"later"}],pageInfo:{hasNextPage:false}}:{items:[{id:"shared"},{id:slug}],pageInfo:{hasNextPage:slug==="a",endCursor:slug==="a"?"next":null}};},{postCode:"0001",first:24},["a","b"],field);
 assert.equal(result.totalCount,4);assert.equal(result.pageInfo.hasNextPage,false);assert.deepEqual(new Set(result.items.map(item=>item.id)),new Set(["shared","a","b","later"]));
 assert.ok(calls.every(call=>call.postCode==="0001"));assert.ok(calls.some(call=>call[field]==="b"));}
});
test("single category preserves existing server pagination",async()=>{
 const result=await fetchCategoryUnion(async vars=>({items:[],totalCount:120,pageInfo:{hasNextPage:true,endCursor:vars.after}}),{after:"cursor"},["a"],"foodTypeSlug");
 assert.equal(result.totalCount,120);assert.equal(result.pageInfo.endCursor,"cursor");
});
test("failed categories and repeated pagination cursors are surfaced",async()=>{
 await assert.rejects(fetchCategoryUnion(async()=>{throw Error("Offline");},{},["a","b"],"occasionSlug"),/Offline/);
 await assert.rejects(fetchCategoryUnion(async()=>({items:[],pageInfo:{hasNextPage:true,endCursor:"same"}}),{},["a","b"],"occasionSlug"),/did not advance/);
});
