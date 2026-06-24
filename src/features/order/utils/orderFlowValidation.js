export function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateOrderSummaryBasics({
  deliveryDate,
  deliveryTime,
  deliveryAddress,
  personCount,
  minimumPersons = 1,
}) {
  const normalizedDate = `${deliveryDate ?? ""}`.trim();
  const normalizedTime = `${deliveryTime ?? ""}`.trim();
  const normalizedAddress = `${deliveryAddress ?? ""}`.trim();
  const normalizedPersonCount = Math.max(
    Number(minimumPersons ?? 1) || 1,
    Number(personCount ?? 0) || 0,
  );

  if (!normalizedDate) {
    return "Please select a delivery date.";
  }

  if (normalizedDate < getTodayDateValue()) {
    return "Please select today or a future delivery date.";
  }

  if (!normalizedTime) {
    return "Please select a delivery time.";
  }

  if (!normalizedAddress) {
    return "Please enter the delivery address.";
  }

  if (normalizedPersonCount < (Number(minimumPersons ?? 1) || 1)) {
    return `Person count must be at least ${minimumPersons}.`;
  }

  return "";
}

function isValidEmail(value) {
  const normalizedValue = `${value ?? ""}`.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
}

export function validateCheckoutForm({ formState, checkoutType }) {
  const commonError = validateOrderSummaryBasics({
    deliveryDate: formState.date,
    deliveryTime: formState.time,
    deliveryAddress: formState.deliveryAddress,
    personCount: formState.personCount,
    minimumPersons: 1,
  });

  if (commonError) {
    return commonError;
  }

  if (!`${formState.deliveryPostalCode ?? ""}`.trim()) {
    return "Please enter the delivery postal code.";
  }

  if (!`${formState.deliveryCity ?? ""}`.trim()) {
    return "Please enter the delivery city.";
  }

  if (!`${formState.invoiceAddress ?? ""}`.trim()) {
    return "Please enter the invoice address.";
  }

  if (!`${formState.invoicePostalCode ?? ""}`.trim()) {
    return "Please enter the invoice postal code.";
  }

  if (!`${formState.invoiceCity ?? ""}`.trim()) {
    return "Please enter the invoice city.";
  }

  if (!`${formState.invoiceReference ?? ""}`.trim()) {
    return "Please enter the invoice reference.";
  }

  if (!`${formState.phone ?? ""}`.trim()) {
    return "Please enter the phone number.";
  }

  if (!isValidEmail(formState.email)) {
    return "Please enter a valid email address.";
  }

  if (checkoutType === "corporate") {
    if (!`${formState.companyName ?? ""}`.trim()) {
      return "Please enter the company name.";
    }

    if (!`${formState.organizationNumber ?? ""}`.trim()) {
      return "Please enter the organization number.";
    }

    if (!`${formState.eventName ?? ""}`.trim()) {
      return "Please enter the event name.";
    }
  } else {
    if (!`${formState.firstName ?? ""}`.trim()) {
      return "Please enter the first name.";
    }

    if (!`${formState.lastName ?? ""}`.trim()) {
      return "Please enter the last name.";
    }

    if (!`${formState.occasion ?? ""}`.trim()) {
      return "Please enter the occasion.";
    }
  }

  return "";
}
