import test from "node:test";
import assert from "node:assert/strict";
import { invoiceRevisionsMatch } from "./invoiceRevision.js";
test("only matching known invoice revisions may be combined", () => {
  assert.equal(invoiceRevisionsMatch(2, "2"), true);
  assert.equal(invoiceRevisionsMatch(1, 2), false);
  assert.equal(invoiceRevisionsMatch(0, 1), false);
  assert.equal(invoiceRevisionsMatch(null, 2), true);
});
