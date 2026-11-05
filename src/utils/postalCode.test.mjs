import test from "node:test";
import assert from "node:assert/strict";
import { postalCodeText, preservePostalCode, accountPostalCode } from "./postalCode.js";
test("postal codes retain exact digits including leading zeros",()=>{
 for(const code of ["0001","1010","0010","0000","0150"]) assert.equal(postalCodeText(code),code);
});
test("numeric API echo does not overwrite submitted leading zeros",()=>{
 assert.equal(preservePostalCode(1,"0001"),"0001");
 assert.equal(preservePostalCode(1010,"1010"),"1010");
 assert.equal(preservePostalCode(0,"0000"),"0000");
});
test("does not pretend that a different server value is the original postal code",()=>{
 assert.equal(preservePostalCode(2,"1010"),"2");
 assert.equal(postalCodeText(null),"");
});

test("preserves a saved leading-zero code across reloads without leaking it to other accounts",()=>{
 const values=new Map();globalThis.window={localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}};
 try {
  assert.equal(accountPostalCode({id:"a",postCode:1},"0001"),"0001");
  assert.equal(accountPostalCode({id:"a",postCode:1}),"0001");
  assert.equal(accountPostalCode({id:"b",postCode:1}),"1");
  assert.equal(accountPostalCode({id:"a",postCode:1010}),"1010");
 } finally { delete globalThis.window; }
});
