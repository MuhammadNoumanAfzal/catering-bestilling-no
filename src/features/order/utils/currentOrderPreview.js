export function currentOrderPreview(preview, workflow, orderCount) {
  if (!workflow || orderCount !== 1) return preview;
  return {
    ...preview,
    address: workflow.address ?? preview.address,
    addressLine2: workflow.addressLine2 ?? preview.addressLine2,
    city: workflow.city ?? preview.city,
    postalCode: workflow.postalCode ?? preview.postalCode,
    date: workflow.date ?? preview.date,
    time: workflow.time ?? preview.time,
    personCount: workflow.personCount ?? preview.personCount,
    additionalDetails: workflow.additionalDetails ?? preview.additionalDetails,
  };
}
