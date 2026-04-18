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
  return (
    <div>
      <HeroSection />
      <FoodBrowsePreviewSection />
      <VendorShowcaseSection title="Popular Vendors" vendors={popularVendors} />
      <VendorShowcaseSection title="Featured Vendors" vendors={featuredVendors} />
      <ProductShowcaseSection title="Popular Products" products={popularProducts} />
      <HowItWorksSection />
    </div>
  );
}
