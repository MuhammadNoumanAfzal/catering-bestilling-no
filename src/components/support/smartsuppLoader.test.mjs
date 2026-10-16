import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSmartsupp, SMARTSUPP_SCRIPT_ID } from "./smartsuppLoader.js";

function context() {
  const scripts = [];
  const document = {
    getElementById: (id) => scripts.find((script) => script.id === id),
    createElement: () => ({ remove() { scripts.splice(scripts.indexOf(this), 1); } }),
    head: { appendChild: (script) => scripts.push(script) },
  };
  return { window: { location: { origin: "https://gocatering.no" }, innerWidth: 390 }, document, scripts };
}
test("client chat loads once with Norwegian language and privacy notice", () => {
  const setup = context();
  loadSmartsupp(setup);
  loadSmartsupp(setup);
  assert.equal(setup.scripts.length, 1);
  assert.equal(setup.scripts[0].id, SMARTSUPP_SCRIPT_ID);
  assert.equal(setup.scripts[0].async, true);
  assert.deepEqual(setup.window.smartsupp._, [["language", "no"]]);
  assert.equal(setup.window._smartsupp.privacyNoticeUrl, "https://gocatering.no/privacy-policy");
  assert.equal(setup.window._smartsupp.privacyNoticeCheckRequired, true);
});
test("failed loading does not prevent a later retry", () => {
  const setup = context();
  loadSmartsupp(setup);
  setup.scripts[0].onerror();
  assert.equal(setup.scripts.length, 0);
  loadSmartsupp(setup);
  assert.equal(setup.scripts.length, 1);
});
