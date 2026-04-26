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
  filterVendorsByDeliverySlot,
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
    deliveryDate,
    deliveryTime,
    locationValue,
    setDeliveryAddress,
    setLocationValue,
  } = useBrowseFilters();
  const filteredPopularVendors = useMemo(() => {
    const locationFiltered = filterVendorsByLocation(popularVendors, locationValue);
    return filterVendorsByDeliverySlot(
      locationFiltered,
      deliveryDate,
      deliveryTime,
    );
  }, [deliveryDate, deliveryTime, locationValue]);
  const filteredFeaturedVendors = useMemo(() => {
    const locationFiltered = filterVendorsByLocation(featuredVendors, locationValue);
    return filterVendorsByDeliverySlot(
      locationFiltered,
      deliveryDate,
      deliveryTime,
    );
  }, [deliveryDate, deliveryTime, locationValue]);
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
