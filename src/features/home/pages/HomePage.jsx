import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FoodBrowsePreviewSection from "../components/FoodBrowsePreviewSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VendorShowcaseSection from "../components/VendorShowcaseSection";
import ProductShowcaseSection from "../components/ProductShowcaseSection";
import {
  popularVendors,
  featuredVendors,
  popularProducts,
} from "../data/homeData";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />
      <FoodBrowsePreviewSection />
      <VendorShowcaseSection
        title="Popular Vendors"
        vendors={popularVendors}
        onSeeAllClick={() => navigate("/vendors/popular")}
      />
      <VendorShowcaseSection
        title="Featured Vendors"
        vendors={featuredVendors}
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
