import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FoodBrowsePreviewSection from "../components/FoodBrowsePreviewSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VendorShowcaseSection from "../components/VendorShowcaseSection";
import ProductShowcaseSection from "../components/ProductShowcaseSection";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import {
  filterItemsByVendorLocation,
  filterVendorsByLocation,
} from "../../vendor/data/vendorData";
import {
  popularVendors,
  featuredVendors,
  popularProducts,
} from "../data/homeData";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    deliveryAddress,
    locationValue,
    setDeliveryAddress,
    setLocationValue,
  } = useBrowseFilters();
  const filteredPopularVendors = useMemo(
    () => filterVendorsByLocation(popularVendors, locationValue),
    [locationValue],
  );
  const filteredFeaturedVendors = useMemo(
    () => filterVendorsByLocation(featuredVendors, locationValue),
    [locationValue],
  );
  const filteredPopularProducts = useMemo(
    () => filterItemsByVendorLocation(popularProducts, locationValue),
    [locationValue],
  );
  const availableVendorCount =
    filteredPopularVendors.length + filteredFeaturedVendors.length;

  return (
    <div>
      <HeroSection
        deliveryAddress={deliveryAddress}
        onDeliveryAddressChange={setDeliveryAddress}
        locationValue={locationValue}
        onLocationChange={setLocationValue}
        availableVendorCount={availableVendorCount}
      />
      <FoodBrowsePreviewSection />
      <VendorShowcaseSection
        title="Popular Vendors"
        vendors={filteredPopularVendors}
        emptyMessage={
          locationValue
            ? `No popular vendors are currently available for ${locationValue}.`
            : undefined
        }
        onSeeAllClick={() => navigate("/vendors/popular")}
      />
      <VendorShowcaseSection
        title="Featured Vendors"
        vendors={filteredFeaturedVendors}
        emptyMessage={
          locationValue
            ? `No featured vendors are currently available for ${locationValue}.`
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
