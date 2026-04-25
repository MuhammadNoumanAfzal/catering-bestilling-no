import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FoodBrowsePreviewSection from "../components/FoodBrowsePreviewSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VendorShowcaseSection from "../components/VendorShowcaseSection";
import ProductShowcaseSection from "../components/ProductShowcaseSection";
import { filterVendorsByPostalCode } from "../../vendor/data/vendorData";
import {
  popularVendors,
  featuredVendors,
  popularProducts,
} from "../data/homeData";

export default function HomePage() {
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const normalizedPostalCode = postalCode.replace(/\D/g, "").slice(0, 4);
  const filteredPopularVendors = useMemo(
    () => filterVendorsByPostalCode(popularVendors, normalizedPostalCode),
    [normalizedPostalCode],
  );
  const filteredFeaturedVendors = useMemo(
    () => filterVendorsByPostalCode(featuredVendors, normalizedPostalCode),
    [normalizedPostalCode],
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
          normalizedPostalCode
            ? `No popular vendors currently deliver to postal code ${normalizedPostalCode}.`
            : undefined
        }
        onSeeAllClick={() => navigate("/vendors/popular")}
      />
      <VendorShowcaseSection
        title="Featured Vendors"
        vendors={filteredFeaturedVendors}
        emptyMessage={
          normalizedPostalCode
            ? `No featured vendors currently deliver to postal code ${normalizedPostalCode}.`
            : undefined
        }
        onSeeAllClick={() => navigate("/vendors/featured")}
      />
      <ProductShowcaseSection
        title="Popular Products"
        products={popularProducts}
        onSeeAllClick={() => navigate("/products/popular")}
      />
      <HowItWorksSection />
    </div>
  );
}
