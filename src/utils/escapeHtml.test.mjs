import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "./escapeHtml.js";
test("untrusted dialog text cannot introduce HTML or attributes", () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)"> & \'test\''), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;test&#39;");
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml("Meny ???"), "Meny ???");
});
