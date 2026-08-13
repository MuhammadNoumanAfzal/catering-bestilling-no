export function isPrimaryMenuProduct(node) {
  return `${node?.productType ?? "menu"}`.toLowerCase() === "menu";
}

export function isCustomerVisibleMenuProduct(node) {
  return `${node?.menuStatus ?? "active"}`.toLowerCase() === "active";
}

function getPublicMenuVisibility(node) {
  if (typeof node?.hasPublicActiveMenus === "boolean") {
    return node.hasPublicActiveMenus;
  }

  const categories = Array.isArray(node?.menuCategories) ? node.menuCategories : null;

  if (!categories) {
    return null;
  }

  const productCollections = categories
    .filter((category) => Array.isArray(category?.vendorProducts))
    .map((category) => category.vendorProducts);

  if (!productCollections.length) {
    return null;
  }

  const products = productCollections.flat().filter(Boolean);

  if (!products.length) {
    return null;
  }

  return products.some(
    (product) =>
      isPrimaryMenuProduct(product) && isCustomerVisibleMenuProduct(product),
  );
}

export function getPublicMenuCount(node) {
  if (Number.isFinite(Number(node?.publicActiveMenuCount))) {
    return Number(node.publicActiveMenuCount);
  }

  const categories = Array.isArray(node?.menuCategories) ? node.menuCategories : [];
  const products = categories
    .filter((category) => Array.isArray(category?.vendorProducts))
    .flatMap((category) => category.vendorProducts)
    .filter(Boolean);

  return products.filter(
    (product) =>
      isPrimaryMenuProduct(product) && isCustomerVisibleMenuProduct(product),
  ).length;
}

function isExplicitlyVisibleVendorStatus(node) {
  const status = `${node?.status ?? ""}`.trim().toUpperCase();
  const applicationStatus = `${node?.applicationStatus ?? ""}`.trim().toUpperCase();

  if (applicationStatus) {
    if (["ACTIVE", "APPROVED"].includes(applicationStatus)) {
      return true;
    }

    if (
      [
        "PENDING_APPROVAL",
        "REVIEWING",
        "CHANGES_REQUESTED",
        "REJECTED",
        "SUSPENDED",
        "DEACTIVATED",
        "INACTIVE",
      ].includes(applicationStatus)
    ) {
      return false;
    }
  }

  if (status) {
    if (["ACTIVE", "APPROVED", "PUBLISHED"].includes(status)) {
      return true;
    }

    if (
      [
        "PENDING",
        "PENDING_APPROVAL",
        "REVIEWING",
        "REJECTED",
        "SUSPENDED",
        "DEACTIVATED",
        "INACTIVE",
      ].includes(status)
    ) {
      return false;
    }
  }

  if (typeof node?.isActive === "boolean") {
    return node.isActive;
  }

  return null;
}

export function isPublicVendorVisible(node) {
  if (typeof node?.isPubliclyVisible === "boolean") {
    return node.isPubliclyVisible;
  }

  const statusVisibility = isExplicitlyVisibleVendorStatus(node);

  if (statusVisibility === false) {
    return false;
  }

  return true;
}
