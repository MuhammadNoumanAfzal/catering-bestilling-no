import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FoodBrowsePreviewSection from "../components/FoodBrowsePreviewSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VendorShowcaseSection from "../components/VendorShowcaseSection";
import ProductShowcaseSection from "../components/ProductShowcaseSection";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import {
  filterItemsByVendorLocation,
  filterVendorsByDeliverySlot,
  filterVendorsByLocation,
  vendorProfiles,
} from "../../vendor/data/vendorData";
import { popularProducts } from "../data/homeData";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    deliveryAddress,
    deliveryDate,
    deliveryTime,
    locationValue,
    searchQuery,
    setDeliveryAddress,
  } = useBrowseFilters();
  const [postalCode, setPostalCode] = useState("");
  const normalizedPostalCode = postalCode.replace(/\D/g, "").slice(0, 4);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const activeHomeLocationFilter =
    normalizedPostalCode || deliveryAddress.trim() || locationValue;
  const homeVendorCards = useMemo(
    () =>
      vendorProfiles
        .map((vendor) => ({
          id: vendor.slug,
          slug: vendor.slug,
          name: vendor.name,
          image: vendor.banner ?? vendor.heroSideImage ?? vendor.logo,
          rating: vendor.rating,
          deliveryTime: vendor.leadTime,
          deliveryFee: vendor.deliveryFee,
          discount: vendor.cuisine,
        }))
        .sort((left, right) => right.rating - left.rating),
    [],
  );
  const filteredHomeVendors = useMemo(() => {
    const locationFiltered = filterVendorsByLocation(
      homeVendorCards,
      activeHomeLocationFilter,
    );

    return filterVendorsByDeliverySlot(
      locationFiltered,
      deliveryDate,
      deliveryTime,
    ).filter((vendor) => {
      if (!normalizedSearchQuery) {
        return true;
      }

      const searchableText = [vendor.name, vendor.deliveryFee, vendor.discount]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    });
  }, [
    activeHomeLocationFilter,
    deliveryDate,
    deliveryTime,
    homeVendorCards,
    normalizedSearchQuery,
  ]);
  const filteredPopularVendors = useMemo(() => {
    return filteredHomeVendors.slice(0, 3);
  }, [filteredHomeVendors]);
  const filteredFeaturedVendors = useMemo(() => {
    return filteredHomeVendors.slice(3, 6);
  }, [filteredHomeVendors]);
  const filteredPopularProducts = useMemo(
    () =>
      filterItemsByVendorLocation(
        popularProducts,
        activeHomeLocationFilter,
      ).filter((product) => {
        if (!normalizedSearchQuery) {
          return true;
        }

        const searchableText = [
          product.name,
          product.title,
          product.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearchQuery);
      }),
    [activeHomeLocationFilter, normalizedSearchQuery],
  );
  const availableVendorCount =
    filteredPopularVendors.length + filteredFeaturedVendors.length;

  return (
    <div>
      <HeroSection
        deliveryAddress={deliveryAddress}
        onDeliveryAddressChange={setDeliveryAddress}
        postalCode={normalizedPostalCode}
        onPostalCodeChange={setPostalCode}
        availableVendorCount={availableVendorCount}
      />
      <FoodBrowsePreviewSection />
      <VendorShowcaseSection
        title="Popular Vendors"
        vendors={filteredPopularVendors}
        emptyMessage={
          activeHomeLocationFilter
            ? `No popular vendors are currently available for ${activeHomeLocationFilter}.`
            : undefined
        }
        onSeeAllClick={() => navigate("/vendors/popular")}
      />
      <VendorShowcaseSection
        title="Featured Vendors"
        vendors={filteredFeaturedVendors}
        emptyMessage={
          activeHomeLocationFilter
            ? `No featured vendors are currently available for ${activeHomeLocationFilter}.`
            : undefined
        }
        onSeeAllClick={() => navigate("/vendors/featured")}
      />
      <ProductShowcaseSection
        title="Popular Products"
        products={filteredPopularProducts}
        onSeeAllClick={() => navigate("/products/popular")}
      />
      <HowItWorksSection />
    </div>
  );
}
