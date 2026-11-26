import test from "node:test";
import assert from "node:assert/strict";
import { postalCodeText, accountPostalCodeText, preservePostalCode, accountPostalCode } from "./postalCode.js";
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
  assert.equal(accountPostalCode({id:"b",postCode:1}),"0001");
  assert.equal(accountPostalCode({id:"a",postCode:1010}),"1010");
 } finally { delete globalThis.window; }
});

test('fresh devices restore Norway leading zeros from the numeric API without saved state',()=>{
 for(const [value,expected] of [[1,'0001'],['1','0001'],[10,'0010'],[150,'0150'],['0001','0001'],[1010,'1010'],[null,''],['',''],['invalid','invalid'],[12345,'12345']]) assert.equal(accountPostalCodeText(value),expected);
 assert.equal(accountPostalCode({id:'new-device',postCode:1}),'0001');
 assert.equal(accountPostalCode({id:'alternate-field',postalCode:150}),'0150');
});

test('blocked browser storage does not strip postcode zeros',()=>{
 globalThis.window={localStorage:{getItem(){throw new Error('Storage denied');}}};
 try {assert.equal(accountPostalCode({id:'blocked',postCode:1}),'0001');} finally {delete globalThis.window;}
});
