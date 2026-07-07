import { fetchVendorReviews } from "../features/vendor/api/vendorService";

export async function hydrateRatingsForItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return items;
  }

  const slugsToHydrate = new Set();
  
  for (const item of items) {
    if (!item) continue;
    
    if (item.vendorSlug) {
      const vRating = Number(item.rating || 0);
      const vReviewCount = Number(item.vendorData?.reviewCount ?? 0);
      if (vRating <= 0 && vReviewCount > 0) {
        slugsToHydrate.add(item.vendorSlug);
      }
    } else if (item.slug) {
      const vRating = Number(item.rating || 0);
      const vReviewCount = Number(item.reviewCount ?? 0);
      if (vRating <= 0 && vReviewCount > 0) {
        slugsToHydrate.add(item.slug);
      }
    }
  }
  
  if (slugsToHydrate.size === 0) {
    return items;
  }
  
  const cache = {};
  await Promise.all(
    Array.from(slugsToHydrate).map(async (slug) => {
      try {
        const reviewConnection = await fetchVendorReviews(slug, { first: 50 });
        const ratings = (reviewConnection.reviews || [])
          .map((review) => Number(review.rating ?? 0))
          .filter((value) => value > 0);
          
        if (ratings.length > 0) {
          const avg = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
          cache[slug] = avg.toFixed(1);
        } else {
          cache[slug] = "0.0";
        }
      } catch {
        cache[slug] = "0.0";
      }
    })
  );
  
  return items.map((item) => {
    if (!item) return item;
    
    if (item.vendorSlug && cache[item.vendorSlug]) {
      return {
        ...item,
        rating: cache[item.vendorSlug],
        vendorData: item.vendorData ? {
          ...item.vendorData,
          rating: cache[item.vendorSlug],
        } : null,
      };
    } else if (item.slug && cache[item.slug]) {
      return {
        ...item,
        rating: cache[item.slug],
      };
    }
    return item;
  });
}
