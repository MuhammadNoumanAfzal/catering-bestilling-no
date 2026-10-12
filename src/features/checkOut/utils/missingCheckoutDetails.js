export function getMissingCheckoutDetails(form, mode) {
  const missing = [];
  const text = (key) => `${form[key] ?? ""}`.trim();
  const required = (key, message = key) => {
    if (!text(key)) missing.push({ field: key, message });
  };
  if (mode === "corporate") {
    required("companyName");
    required("organizationNumber");
  } else {
    required("firstName");
    required("lastName");
  }
  required("phone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email"))) {
    missing.push({ field: "email", message: "validEmail" });
  }
  for (const prefix of ["delivery", ...(form.invoiceSameAsDelivery ? [] : ["invoice"])]) {
    required(`${prefix}Address`);
    if (!/^\d{4}$/.test(text(`${prefix}PostalCode`))) {
      missing.push({ field: `${prefix}PostalCode`, message: `${prefix}PostalCode` });
    }
    required(`${prefix}City`);
  }
  required("date", "selectDeliveryDate");
  required("time", "selectDeliveryTime");
  return missing;
}
