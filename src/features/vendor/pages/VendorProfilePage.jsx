import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import VendorProfileHeader from "../components/VendorProfileHeader";
import VendorCategoryTabs from "../components/VendorCategoryTabs";
import VendorMenuSection from "../components/VendorMenuSection";
import VendorOrderSidebar from "../components/VendorOrderSidebar";
import VendorAvailabilityPopup from "../components/VendorAvailabilityPopup";
import {
  getAvailableVendorsForSlot,
  getVendorProfileBySlug,
  isVendorDeliverySlotAvailable,
} from "../data/vendorData";
import {
  readOrderSummary,
  writeOrderSummary,
} from "../utils/orderSummaryStorage";

export default function VendorProfilePage() {
  const { vendorSlug } = useParams();
  const navigate = useNavigate();
  const vendor = getVendorProfileBySlug(vendorSlug);
  const [activeCategory, setActiveCategory] = useState("All - in - One Order");
  const [orderSummary, setOrderSummary] = useState(null);
  const [isAvailabilityPopupDismissed, setIsAvailabilityPopupDismissed] =
    useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [vendorSlug]);

  useEffect(() => {
    if (!vendor) {
      return;
    }

    setOrderSummary(readOrderSummary(vendor));
    setActiveCategory("All - in - One Order");
    setIsAvailabilityPopupDismissed(false);
  }, [vendor]);

  useEffect(() => {
    if (!orderSummary) {
      return;
    }

    setIsAvailabilityPopupDismissed(false);
  }, [orderSummary?.deliveryDate, orderSummary?.deliveryTime]);

  useEffect(() => {
    if (!vendor || !orderSummary) {
      return;
    }

    writeOrderSummary(vendor.slug, orderSummary);
  }, [orderSummary, vendor]);

  if (!vendor) {
    return <Navigate to="/" replace />;
  }

  if (!orderSummary) {
    return null;
  }

  const visibleSections = vendor.menuSections.filter(
    (section) => section.title === activeCategory,
  );
  const showAvailabilityPopup = !isVendorDeliverySlotAvailable(
    vendor,
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
  );
  const availableRestaurants = getAvailableVendorsForSlot(
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
    vendor.slug,
  );

  return (
    <section className=" px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[12px] border border-[#ddd6cd] bg-white">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 border-r border-[#e7dfd6]">
            <div className="p-4 sm:p-5">
              <Link
                to="/"
                className="text-[16px] font-medium text-[#2C76FF] transition hover:text-[#cf6e38]"
              >
                &lt; Back to search
              </Link>

              <div className="mt-3">
                <img
                  src={vendor.banner}
                  alt={vendor.name}
                  className="h-[260px] w-full rounded-[14px] object-cover"
                />
              </div>

              <div className="mt-4">
                <VendorProfileHeader vendor={vendor} />
              </div>

              <div className="mt-5">
                <p className="type-h3 font-semibold text-[#1a1a1a]">
                  Catering Menu
                </p>
              </div>

              <div className="mt-6">
                <VendorCategoryTabs
                  categories={vendor.categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </div>

              {visibleSections.map((section) => (
                <VendorMenuSection
                  key={section.id}
                  section={section}
                  onItemClick={(item) =>
                    navigate(
                      `/vendor/${vendor.slug}/menu/${encodeURIComponent(item.id)}`,
                    )
                  }
                />
              ))}
            </div>
          </div>

          <VendorOrderSidebar
            vendor={vendor}
            orderSummary={orderSummary}
            onRemoveItem={(itemId) =>
              setOrderSummary((current) => {
                const removedItem = current.items.find((item) => item.id === itemId);

                return {
                  ...current,
                  personCount: Math.max(
                    1,
                    current.personCount -
                      (removedItem?.isAddOn ? 0 : (removedItem?.totalServes ?? 0)),
                  ),
                  items: current.items.filter((item) => item.id !== itemId),
                };
              })
            }
            onTipChange={(tipRate) =>
              setOrderSummary((current) => ({ ...current, tipRate }))
            }
            onDeliveryDateChange={(deliveryDate) =>
              setOrderSummary((current) => ({ ...current, deliveryDate }))
            }
            onDeliveryTimeChange={(deliveryTime) =>
              setOrderSummary((current) => ({ ...current, deliveryTime }))
            }
            onPersonCountChange={(personCount) =>
              setOrderSummary((current) => ({ ...current, personCount }))
            }
            onDeliveryAddressChange={(deliveryAddress) =>
              setOrderSummary((current) => ({ ...current, deliveryAddress }))
            }
            onInvoiceAddressChange={(invoiceAddress) =>
              setOrderSummary((current) => ({ ...current, invoiceAddress }))
            }
            onTablewareChange={(tableware) =>
              setOrderSummary((current) => ({ ...current, tableware }))
            }
          />
        </div>
      </div>

      {showAvailabilityPopup && !isAvailabilityPopupDismissed ? (
        <VendorAvailabilityPopup
          availability={vendor.availability}
          availableRestaurants={availableRestaurants}
          onClose={() => setIsAvailabilityPopupDismissed(true)}
        />
      ) : null}
    </section>
  );
}
