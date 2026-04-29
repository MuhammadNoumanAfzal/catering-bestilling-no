export function normalizeCategorySelection(selection) {
  if (Array.isArray(selection)) {
    const normalizedSelection = selection
      .map((item) => `${item ?? ""}`.trim())
      .filter(Boolean);

    if (normalizedSelection.length === 0) {
      return null;
    }

    return normalizedSelection;
  }

  const normalizedSelection = `${selection ?? ""}`.trim();
  return normalizedSelection || null;
}

export function formatCategoryLabel(selection) {
  const normalizedSelection = normalizeCategorySelection(selection);

  if (Array.isArray(normalizedSelection)) {
    return normalizedSelection.join(", ");
  }

  return normalizedSelection;
}

export function matchesCategorySelection(tags = [], selection) {
  const normalizedSelection = normalizeCategorySelection(selection);

  if (!normalizedSelection) {
    return true;
  }

  const normalizedTags = tags.map((tag) => `${tag ?? ""}`.trim()).filter(Boolean);

  return Array.isArray(normalizedSelection)
    ? normalizedSelection.some((tag) => normalizedTags.includes(tag))
    : normalizedTags.includes(normalizedSelection);
}

export function filterItemsByCategory(
  items,
  selection,
  getTags = (item) => item?.categoryTags ?? [],
) {
  return items.filter((item) => matchesCategorySelection(getTags(item), selection));
}

export function getCategoryParamValue(selection) {
  const normalizedSelection = normalizeCategorySelection(selection);

  if (Array.isArray(normalizedSelection)) {
    return normalizedSelection.join(",");
  }

  return normalizedSelection;
}

export function parseCategoryParamValue(value) {
  if (!value) {
    return null;
  }

  const categories = `${value}`
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (categories.length === 0) {
    return null;
  }

  return categories.length === 1 ? categories[0] : categories;
}
