export const MODIFY_ORDER_PLACEHOLDERS = {
  address: "xxxx-xxxx-xxx",
  addressLine2: "5",
  city: "Bergen",
  postalCode: "1235",
  additionalDetails: "Please explain the changes you would like to make...",
};

export function createInitialModifyOrderFormState(initialValue) {
  return {
    address: initialValue?.address ?? "",
    addressLine2: initialValue?.addressLine2 ?? "",
    city: initialValue?.city ?? "",
    postalCode: initialValue?.postalCode ?? "",
    date: initialValue?.date ?? "",
    time: initialValue?.time ?? "",
    personCount: Math.max(1, Number(initialValue?.personCount ?? 1)),
    additionalDetails: initialValue?.additionalDetails ?? "",
  };
}
