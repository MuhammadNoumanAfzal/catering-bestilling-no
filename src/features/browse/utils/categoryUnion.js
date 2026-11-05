// The API accepts one category slug. Fetch each selected category and union by product ID.
export async function fetchCategoryUnion(fetchPage, variables, slugs, field) {
  const categories = [...new Set(slugs.filter(Boolean))];
  if (categories.length <= 1) return fetchPage({ ...variables, [field]: categories[0] || null });
  const groups = await Promise.all(categories.map(async slug => {
    const items = []; const cursors = new Set(); let after = null;
    do {
      const page = await fetchPage({ ...variables, [field]: slug, after });
      items.push(...(page.items || []));
      if (!page.pageInfo?.hasNextPage) return items;
      const cursor = page.pageInfo.endCursor;
      if (!cursor || cursors.has(cursor)) throw new Error("Category pagination did not advance.");
      cursors.add(cursor); after = cursor;
    } while (true);
  }));
  const items = [...new Map(groups.flat().map(item => [String(item.id), item])).values()];
  return { items, totalCount: items.length, pageInfo: { hasNextPage: false, endCursor: null } };
}
