import test from 'node:test';
import assert from 'node:assert/strict';
import { recoverModuleLoad } from './moduleLoadRecovery.js';
function storage(){const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};}
test('a stale module automatically reloads once, never in an infinite reload loop',()=>{const cache=storage();let reloads=0;const options={storage:cache,now:100000,reload:()=>reloads++};assert.equal(recoverModuleLoad(new Error('Failed to fetch dynamically imported module: /menu.js'),options),true);assert.equal(recoverModuleLoad('Failed to fetch dynamically imported module',options),false);assert.equal(reloads,1);assert.equal(recoverModuleLoad('Failed to fetch dynamically imported module',{...options,now:160001}),true);assert.equal(reloads,2);});
test('ordinary errors and unavailable storage cannot cause repeated navigation',()=>{let reloads=0;assert.equal(recoverModuleLoad('ordinary render error',{storage:storage(),reload:()=>reloads++}),false);assert.equal(recoverModuleLoad('Failed to fetch dynamically imported module',{storage:{getItem(){throw Error('blocked');}},reload:()=>reloads++}),false);assert.equal(reloads,0);});
