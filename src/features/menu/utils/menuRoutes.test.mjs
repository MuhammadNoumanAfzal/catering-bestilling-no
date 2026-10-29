import {test} from "node:test";
import assert from "node:assert/strict";
import {menuSlug,menuPath,resolveMenuName} from "./menuRoutes.js";
test("menu paths use names without database IDs",()=>{assert.equal(menuPath("gastronomen",{id:39,name:"Pincho - Iberico og oliven"}),"/vendor/gastronomen/menu/pincho-iberico-og-oliven");});
test("Norwegian names and accents become readable slugs",()=>{assert.equal(menuSlug("Smørbrød med ærter & Crème"),"smorbrod-med-aerter-creme");});
test("slug resolves only one vendor menu and rejects ambiguity",()=>{assert.equal(resolveMenuName([{id:39,name:"Pincho"}],"pincho"),39);assert.throws(()=>resolveMenuName([],"pincho"));assert.throws(()=>resolveMenuName([{id:1,name:"Pincho"},{id:2,name:"Pincho"}],"pincho"));});
