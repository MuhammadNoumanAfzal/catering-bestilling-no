// Creation only needs an acknowledgement. Load optional offer details on their own page.
export const createOfferDocument = `mutation RequestMenuOffer($input: RequestMenuOfferInput!) {
  requestMenuOffer(input: $input) { request { id } }
}`;

export async function createOfferRequest(sendGraphql, input) {
  const data = await sendGraphql(createOfferDocument, { input });
  const request = data?.requestMenuOffer?.request;
  if (request?.id == null || String(request.id).trim() === '') {
    const error = new Error('Offer submission could not be confirmed');
    error.code = 'OFFER_SUBMISSION_UNCONFIRMED';
    throw error;
  }
  return request;
}
