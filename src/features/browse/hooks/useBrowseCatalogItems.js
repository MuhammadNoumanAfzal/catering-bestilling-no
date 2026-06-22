import { useEffect, useState } from "react";
import { fetchVendorProfiles } from "../../vendor";

function formatBrowsePrice(item) {
  const amount = Number(
    item?.modal?.unitPrice ?? item?.modal?.pricePerPerson ?? item?.price ?? 0,
  );
  const priceLabel = item?.modal?.priceLabel ?? "per person";

  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  return `NOK ${amount.toFixed(2)} ${priceLabel}`;
}

function normalizeBrowseItem(vendor, section, item) {
  return {
    ...item,
    vendorSlug: vendor.slug,
    vendor: vendor.name,
    vendorName: vendor.name,
    vendorData: vendor,
    image: item.image || vendor.banner || vendor.image || "",
    price: formatBrowsePrice(item),
    categoryTags: Array.isArray(item.categoryTags)
      ? item.categoryTags
      : [section.title].filter(Boolean),
    dietaryTags: Array.isArray(item.dietaryLabels) ? item.dietaryLabels : [],
    offerTags: [],
    pricingTier: "",
    individualPackaging: false,
    newlyAdded: false,
    smallBusiness: false,
    minimumOrderValue: 0,
    distanceKm: 0,
    popularityScore: Number(item.rating || 0),
    minimumGuests: item.minimumGuests ?? item.serves ?? 0,
  };
}

export function useBrowseCatalogItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      setIsLoading(true);

      try {
        const vendors = await fetchVendorProfiles();
        const nextItems = vendors.flatMap((vendor) =>
          (vendor.menuSections || []).flatMap((section) =>
            (section.items || []).map((item) =>
              normalizeBrowseItem(vendor, section, item),
            ),
          ),
        );

        if (isMounted) {
          setItems(nextItems);
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    items,
    isLoading,
  };
}
