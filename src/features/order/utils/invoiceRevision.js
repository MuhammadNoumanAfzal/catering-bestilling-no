export function invoiceRevisionsMatch(invoiceRevision, orderRevision) {
  return invoiceRevision == null || orderRevision == null ||
    String(invoiceRevision) === String(orderRevision);
}
