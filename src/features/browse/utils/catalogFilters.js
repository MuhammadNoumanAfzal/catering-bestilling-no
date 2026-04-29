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

export function matchesRatingFilter(rating, selectedRating) {
  if (!selectedRating || selectedRating === "Ratings") {
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
  if (!selectedOffers || selectedOffers.length === 0) {
    return true;
  }

  const offerTags = item.offerTags ?? [];
  return selectedOffers.every((option) => offerTags.includes(option));
}

export function matchesPricingFilter(item, selectedPricing) {
  if (!selectedPricing || selectedPricing === "Pricing") {
    return true;
  }

  return item.pricingTier === selectedPricing;
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

  if (otherFilters.orderMinimum !== "Any price") {
    const minimumOrderValue = item.minimumOrderValue ?? extractFirstNumber(item.price);

    if (otherFilters.orderMinimum === "Under NOK 250" && minimumOrderValue >= 250) {
      return false;
    }

    if (
      otherFilters.orderMinimum === "NOK 250 - NOK 500" &&
      (minimumOrderValue < 250 || minimumOrderValue > 500)
    ) {
      return false;
    }

    if (otherFilters.orderMinimum === "NOK 500+" && minimumOrderValue < 500) {
      return false;
    }
  }

  if (otherFilters.distance !== "Any distance") {
    const maxDistance = extractFirstNumber(otherFilters.distance);
    const itemDistance = item.distanceKm ?? Number.POSITIVE_INFINITY;

    if (maxDistance > 0 && itemDistance > maxDistance) {
      return false;
    }
  }

  return true;
}

export function sortCatalogItems(items, selectedSort) {
  if (!selectedSort || selectedSort === "Sort by" || selectedSort === "Recommended") {
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

  if (selectedSort === "Fastest delivery") {
    return [...items].sort((left, right) => {
      const leftMinutes = extractLeadTimeMinutes(left.deliveryTimeLabel ?? left.deliveryTime);
      const rightMinutes = extractLeadTimeMinutes(right.deliveryTimeLabel ?? right.deliveryTime);
      return leftMinutes - rightMinutes;
    });
  }

  return items;
}
