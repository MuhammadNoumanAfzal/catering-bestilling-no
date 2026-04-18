import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import VendorProfileHeader from "../components/VendorProfileHeader";
import VendorCategoryTabs from "../components/VendorCategoryTabs";
import VendorMenuSection from "../components/VendorMenuSection";
import VendorMenuItemModal from "../components/VendorMenuItemModal";
import VendorOrderSidebar from "../components/VendorOrderSidebar";
import VendorAvailabilityPopup from "../components/VendorAvailabilityPopup";
import {
  getAvailableVendorsForSlot,
  getVendorProfileBySlug,
  isVendorDeliverySlotAvailable,
} from "../data/vendorData";

function createInitialOrderSummary(vendor) {
  return {
    ...vendor.orderSummary,
    items: [],
    deliveryDate: "2026-03-25",
    deliveryTime: "14:30",
    personCount: vendor.orderSummary.personCount,
    deliveryAddress: vendor.orderSummary.deliveryAddress,
    invoiceAddress: vendor.orderSummary.invoiceAddress,
    tipRate: 0,
  };
}

export default function VendorProfilePage() {
  const { vendorSlug } = useParams();
  const vendor = getVendorProfileBySlug(vendorSlug);
  const [activeCategory, setActiveCategory] = useState("All - in - One Order");
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [isAvailabilityPopupDismissed, setIsAvailabilityPopupDismissed] =
    useState(false);

  useEffect(() => {
    if (!vendor) {
      return;
    }

    setOrderSummary(createInitialOrderSummary(vendor));
    setActiveCategory("All - in - One Order");
    setSelectedItem(null);
    setIsAvailabilityPopupDismissed(false);
  }, [vendor]);

  useEffect(() => {
    if (!orderSummary) {
      return;
    }

    setIsAvailabilityPopupDismissed(false);
  }, [orderSummary?.deliveryDate, orderSummary?.deliveryTime]);

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

  const handleAddToOrder = (summaryItem) => {
    setOrderSummary((current) => ({
      ...current,
      personCount:
        current.items.length === 0
          ? summaryItem.totalServes
          : current.personCount + summaryItem.totalServes,
      items: [summaryItem, ...current.items],
    }));
    setSelectedItem(null);
  };

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
                  onItemClick={setSelectedItem}
                />
              ))}
            </div>
          </div>

          <VendorOrderSidebar
            orderSummary={orderSummary}
            onRemoveItem={(itemId) =>
              setOrderSummary((current) => ({
                ...current,
                personCount: Math.max(
                  1,
                  current.personCount -
                    (current.items.find((item) => item.id === itemId)?.totalServes ?? 0),
                ),
                items: current.items.filter((item) => item.id !== itemId),
              }))
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
          />
        </div>
      </div>

      {selectedItem ? (
        <VendorMenuItemModal
          item={selectedItem}
          onClose={(summaryItem) => {
            if (summaryItem) {
              handleAddToOrder(summaryItem);
              return;
            }
            setSelectedItem(null);
          }}
        />
      ) : null}

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
