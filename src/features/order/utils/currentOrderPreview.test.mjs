import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { currentOrderPreview } from "./currentOrderPreview.js";

test("confirmation uses applied server values rather than checkout snapshot or pending proposals", () => {
  const result = currentOrderPreview({ personCount: 10, address: "Old address" }, {
    personCount: 12, address: "Current address", addressLine2: "",
    pendingModificationRequest: { requestedChanges: { personCount: 13 } },
  }, 1);
  assert.equal(result.personCount, 12);
  assert.equal(result.address, "Current address");
  assert.equal(result.addressLine2, "");
});
test("does not overwrite a multi-vendor checkout summary with a single order", () => {
  const preview = { personCount: 10 };
  assert.equal(currentOrderPreview(preview, { personCount: 12 }, 2), preview);
  assert.equal(currentOrderPreview(preview, null, 1), preview);
});

test("loading modify details does not depend on the server-derived preview it updates", () => {
  const hook = readFileSync(new URL("../hooks/useOrderConfirmedPage.js", import.meta.url), "utf8");
  const effect = hook.split("async function loadModifyDetails()")[1].split("const handleModifySave")[0];
  assert.doesNotMatch(effect, /\[isModifyModalOpen, orderPreview,/);
  assert.match(effect, /\[isModifyModalOpen, placedOrderDraft, rawPrimaryOrderId\]/);
});
