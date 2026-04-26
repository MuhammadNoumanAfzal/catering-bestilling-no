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
  } = useBrowseFilters();
  const [postalCode, setPostalCode] = useState("");
  const normalizedPostalCode = postalCode.replace(/\D/g, "").slice(0, 4);
  const activeHomeLocationFilter =
    normalizedPostalCode || deliveryAddress.trim() || locationValue;
  const filteredPopularVendors = useMemo(() => {
    const locationFiltered = filterVendorsByLocation(
      popularVendors,
      activeHomeLocationFilter,
    );
    return filterVendorsByDeliverySlot(
      locationFiltered,
      deliveryDate,
      deliveryTime,
    );
  }, [activeHomeLocationFilter, deliveryDate, deliveryTime]);
  const filteredFeaturedVendors = useMemo(() => {
    const locationFiltered = filterVendorsByLocation(
      featuredVendors,
      activeHomeLocationFilter,
    );
    return filterVendorsByDeliverySlot(
      locationFiltered,
      deliveryDate,
      deliveryTime,
    );
  }, [activeHomeLocationFilter, deliveryDate, deliveryTime]);
  const filteredPopularProducts = useMemo(
    () => filterItemsByVendorLocation(popularProducts, activeHomeLocationFilter),
    [activeHomeLocationFilter],
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
