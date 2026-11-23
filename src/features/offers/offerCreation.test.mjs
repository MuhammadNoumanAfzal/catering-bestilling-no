import test from 'node:test';
import assert from 'node:assert/strict';
import { createOfferDocument, createOfferRequest } from './offerCreation.js';

test('creation requests only the saved id, without optional detail resolvers', async () => {
  const input = { menuId: '12', targetPricePerPerson: '200', idempotencyKey: 'same-request-key' };
  const calls = [];
  const result = await createOfferRequest(async (query, variables) => {
    calls.push({ query, variables });
    // The acknowledgement does not need revision, quote, messages or checkout data.
    return { requestMenuOffer: { request: { id: '3' } } };
  }, input);
  assert.deepEqual(result, { id: '3' });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].variables, { input });
  assert.equal(calls[0].query, createOfferDocument);
  assert.match(createOfferDocument, /request\s*\{\s*id\s*\}/);
  assert.doesNotMatch(createOfferDocument, /createdAt|messages|checkoutSnapshot|permissions|quote/);
});

test('missing acknowledgement never claims a request was sent', async () => {
  for (const data of [null, {}, { requestMenuOffer: {} }, { requestMenuOffer: { request: { id: '' } } }]) {
    await assert.rejects(createOfferRequest(async () => data, {}), { code: 'OFFER_SUBMISSION_UNCONFIRMED' });
  }
});

test('errors remain visible and the service does not repeat a write automatically', async () => {
  let calls = 0;
  const failure = Object.assign(new Error('Connection lost'), { code: 'NETWORK_ERROR' });
  await assert.rejects(createOfferRequest(async () => { calls += 1; throw failure; }, { idempotencyKey: 'preserved' }), error => error === failure);
  assert.equal(calls, 1);
});
