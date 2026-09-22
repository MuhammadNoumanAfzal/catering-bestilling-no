import { FILTER_DEFAULTS } from "../../../components/shared/browseFilters/browseFilterConfig";

function extractFirstNumber(value) {
  const numericMatch = `${value ?? ""}`.match(/(\d+(\.\d+)?)/);
  return numericMatch ? Number(numericMatch[1]) : 0;
}

function extractLeadTimeMinutes(leadTimeLabel) {
  const values = `${leadTimeLabel ?? ""}`
    .match(/\d+/g)
    ?.map((value) => Number(value));

  if (!values || values.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.min(...values);
}

function extractPriceValue(priceLabel) {
  const numericMatch = `${priceLabel ?? ""}`.match(/(\d+(\.\d+)?)/);
  return numericMatch ? Number(numericMatch[1]) : Number.POSITIVE_INFINITY;
}

export function matchesRatingFilter(rating, selectedRating) {
  if (!selectedRating || selectedRating === FILTER_DEFAULTS.rating) {
    return true;
  }

  const minimumRating = extractFirstNumber(selectedRating);
  return Number(rating ?? 0) >= minimumRating;
}

export function matchesDietaryFilter(item, selectedDietary) {
  if (!selectedDietary || selectedDietary.length === 0) {
    return true;
  }

  const dietaryTags = item.dietaryTags ?? [];
  return selectedDietary.every((option) => dietaryTags.includes(option));
}

export function matchesOfferFilter(item, selectedOffers) {
  const selectedDelivery = selectedOffers?.[0];
  if (!selectedDelivery || selectedDelivery === "Any Delivery") {
    return true;
  }

  if (selectedDelivery === "Free Delivery") {
    return (item.offerTags ?? []).includes("Free Delivery");
  }

  const deliveryFee = extractFirstNumber(item?.vendorData?.deliveryFee);
  if (selectedDelivery === "Delivery Fee: 0-150") return deliveryFee >= 0 && deliveryFee <= 150;
  if (selectedDelivery === "Delivery Fee: 150-300") return deliveryFee >= 150 && deliveryFee <= 300;
  if (selectedDelivery === "Delivery Fee: 300+") return deliveryFee >= 300;
  return true;
}

export function matchesPricingFilter(item, selectedPricing) {
  if (!selectedPricing || selectedPricing === FILTER_DEFAULTS.pricing || selectedPricing === "Any price") {
    return true;
  }

  const price = extractPriceValue(item.price);
  const ranges = {
    "Under 500": price < 500,
    "500 - 1000": price >= 500 && price <= 1000,
    "1000 - 2000": price >= 1000 && price <= 2000,
    "2000 - 5000": price >= 2000 && price <= 5000,
    "5000+": price >= 5000,
  };

  return ranges[selectedPricing] ?? true;
}

export function matchesOtherFilters(item, otherFilters) {
  if (!otherFilters) {
    return true;
  }

  if (otherFilters.individualPackaging && !item.individualPackaging) {
    return false;
  }

  if (otherFilters.newlyAdded && !item.newlyAdded) {
    return false;
  }

  if (otherFilters.smallBusiness && !item.smallBusiness) {
    return false;
  }

  if (otherFilters.budgetPerPerson) {
    const budget = extractFirstNumber(otherFilters.budgetPerPerson);

    if (budget > 0 && extractFirstNumber(item.price) > budget) {
      return false;
    }
  }

  if (otherFilters.orderMinimum !== FILTER_DEFAULTS.orderMinimum) {
    const minimumOrderValue = item.minimumOrderValue ?? extractFirstNumber(item.price);

    if (otherFilters.orderMinimum === "Under 250" && minimumOrderValue >= 250) {
      return false;
    }

    if (
      otherFilters.orderMinimum === "250 - 500" &&
      (minimumOrderValue < 250 || minimumOrderValue > 500)
    ) {
      return false;
    }

    if (otherFilters.orderMinimum === "500+" && minimumOrderValue < 500) {
      return false;
    }
  }

  if (otherFilters.distance !== FILTER_DEFAULTS.distance) {
    const maxDistance = extractFirstNumber(otherFilters.distance);
    const itemDistance = item.distanceKm ?? Number.POSITIVE_INFINITY;

    if (maxDistance > 0 && itemDistance > maxDistance) {
      return false;
    }
  }

  return true;
}

export function sortCatalogItems(items, selectedSort) {
  if (!selectedSort || selectedSort === FILTER_DEFAULTS.sort || selectedSort === "Recommended") {
    return [...items].sort((left, right) => {
      const rightScore = right.popularityScore ?? right.rating ?? 0;
      const leftScore = left.popularityScore ?? left.rating ?? 0;
      return rightScore - leftScore;
    });
  }

  if (selectedSort === "Most Popular") {
    return [...items].sort(
      (left, right) => (right.popularityScore ?? right.rating ?? 0) - (left.popularityScore ?? left.rating ?? 0),
    );
  }

  if (selectedSort === "Highest Rated") {
    return [...items].sort(
      (left, right) => Number(right.rating ?? 0) - Number(left.rating ?? 0),
    );
  }

  if (selectedSort === "Price: Low to High") {
    return [...items].sort(
      (left, right) => extractPriceValue(left.price) - extractPriceValue(right.price),
    );
  }

  if (selectedSort === "Price: High to Low") {
    return [...items].sort(
      (left, right) => extractPriceValue(right.price) - extractPriceValue(left.price),
    );
  }

  if (selectedSort === "Newest") {
    return [...items];
  }

  return items;
}
