import { useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  getAvailableVendorsForSlot,
  isVendorDeliverySlotAvailable,
} from "../services";
import {
  isVendorSaved,
  toggleSavedVendor,
} from "../utils/savedVendorsStorage";
import {
  readOrderSummary,
  writeOrderSummary,
} from "../utils/orderSummaryStorage";
import { confirmRemoveItem, showSuccessToast } from "../../../utils/alerts";
import {
  VendorAvailabilityPopup,
  VendorCategoryTabs,
  VendorLocationModal,
  VendorMenuSection,
  VendorOrderSidebar,
  VendorProfileHeader,
} from "../components";
import { useVendorProfile } from "../hooks/useVendorProfile";

export default function VendorProfilePage() {
  const CATEGORY_BAR_TOP_OFFSET = 78;
  const { vendorSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { vendor, isLoading: loading, error } = useVendorProfile(vendorSlug);

  const [activeCategory, setActiveCategory] = useState("");
  const [orderSummary, setOrderSummary] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAvailabilityPopupDismissed, setIsAvailabilityPopupDismissed] =
    useState(false);
  const [isCategoryBarFixed, setIsCategoryBarFixed] = useState(false);
  const [categoryBarStyle, setCategoryBarStyle] = useState({});
  const sectionRefs = useRef({});
  const categoryBarAnchorRef = useRef(null);
  const categoryBarInnerRef = useRef(null);
  const menuSectionsRef = useRef(null);

  useEffect(() => {
    if (!vendor) {
      return;
    }

    setOrderSummary(readOrderSummary(vendor));
    setIsSaved(isVendorSaved(vendor.slug));
    setActiveCategory(vendor.categories?.[0] || "All - in - One Order");
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

  useEffect(() => {
    if (!vendor || !orderSummary) {
      return undefined;
    }

    const visibleElements = vendor.menuSections
      .map((section) => sectionRefs.current[section.id])
      .filter(Boolean);

    if (visibleElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          )[0];

        if (!activeEntry) {
          return;
        }

        const nextCategory = activeEntry.target.getAttribute("data-category");

        if (nextCategory) {
          setActiveCategory(nextCategory);
        }
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    visibleElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [orderSummary, vendor]);

  useEffect(() => {
    function updateCategoryBarPosition() {
      const anchorElement = categoryBarAnchorRef.current;
      const menuSectionsElement = menuSectionsRef.current;
      const categoryBarElement = categoryBarInnerRef.current;

      if (!anchorElement || !menuSectionsElement || !categoryBarElement) {
        return;
      }

      const anchorRect = anchorElement.getBoundingClientRect();
      const sectionsRect = menuSectionsElement.getBoundingClientRect();
      const barHeight = categoryBarElement.offsetHeight;
      const shouldFix =
        anchorRect.top <= CATEGORY_BAR_TOP_OFFSET &&
        sectionsRect.bottom > CATEGORY_BAR_TOP_OFFSET + barHeight;

      setIsCategoryBarFixed(shouldFix);

      if (!shouldFix) {
        setCategoryBarStyle({});
        return;
      }

      setCategoryBarStyle({
        left: anchorRect.left,
        top: CATEGORY_BAR_TOP_OFFSET,
        width: anchorRect.width,
      });
    }

    updateCategoryBarPosition();
    window.addEventListener("scroll", updateCategoryBarPosition, { passive: true });
    window.addEventListener("resize", updateCategoryBarPosition);

    return () => {
      window.removeEventListener("scroll", updateCategoryBarPosition);
      window.removeEventListener("resize", updateCategoryBarPosition);
    };
  }, [orderSummary, vendor]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !vendor) {
    return <Navigate to="/" replace />;
  }

  if (!orderSummary) {
    return null;
  }

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
  const isVendorAvailable = !showAvailabilityPopup;

  const handleSaveToggle = () => {
    const nextSavedState = toggleSavedVendor(vendor.slug);
    setIsSaved(nextSavedState);
    showSuccessToast(
      nextSavedState
        ? `${vendor.name} saved successfully`
        : `${vendor.name} removed from saved restaurants`,
    );
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/vendor/${vendor.slug}`
        : `/vendor/${vendor.slug}`;
    const sharePayload = {
      title: vendor.name,
      text: `Check out ${vendor.name} on Lunsjavtale.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        await showSuccessToast(`${vendor.name} shared successfully`);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        await showSuccessToast("Restaurant link copied to clipboard");
        return;
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }

    showSuccessToast("Sharing is not supported on this device");
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    const matchedSection = vendor.menuSections.find(
      (section) => section.title === category,
    );
    const targetElement = matchedSection
      ? sectionRefs.current[matchedSection.id]
      : null;

    targetElement?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
                <VendorProfileHeader
                  vendor={vendor}
                  isAvailable={isVendorAvailable}
                  isSaved={isSaved}
                  onLocationClick={() => setIsLocationModalOpen(true)}
                  onReviewsClick={() =>
                    navigate(`/vendor/${vendor.slug}/reviews`, {
                      state: { from: location },
                    })
                  }
                  onSaveToggle={handleSaveToggle}
                  onShare={handleShare}
                />
              </div>

              <div className="mt-5">
                <p className="type-h3 font-semibold text-[#1a1a1a]">
                  Catering Menu
                </p>
              </div>

              <div
                ref={categoryBarAnchorRef}
                className="relative mt-6"
                style={
                  isCategoryBarFixed && categoryBarInnerRef.current
                    ? { minHeight: categoryBarInnerRef.current.offsetHeight }
                    : undefined
                }
              >
                <div
                  ref={categoryBarInnerRef}
                  className={`border-b border-[#ece5dc] bg-white/95 px-4 py-3 backdrop-blur-[6px] sm:px-5 ${
                    isCategoryBarFixed ? "fixed z-30 shadow-[0_8px_24px_rgba(24,24,24,0.08)]" : ""
                  }`}
                  style={isCategoryBarFixed ? categoryBarStyle : undefined}
                >
                  <VendorCategoryTabs
                    categories={vendor.categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
              </div>

              <div ref={menuSectionsRef} className="mt-6 space-y-5">
                {vendor.menuSections.map((section) => (
                  <div
                    key={section.id}
                    ref={(element) => {
                      sectionRefs.current[section.id] = element;
                    }}
                    data-category={section.title}
                  >
                    <VendorMenuSection
                      section={section}
                      onItemClick={(item) =>
                        navigate(
                          `/vendor/${vendor.slug}/menu/${encodeURIComponent(item.id)}`,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <VendorOrderSidebar
            vendor={vendor}
            orderSummary={orderSummary}
            onRemoveItem={async (itemId) => {
              const itemName = orderSummary.items.find((item) => item.id === itemId)?.name;
              const result = await confirmRemoveItem(itemName);

              if (!result.isConfirmed) {
                return;
              }

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
              });
            }}
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

      {isLocationModalOpen ? (
        <VendorLocationModal
          vendor={vendor}
          onClose={() => setIsLocationModalOpen(false)}
        />
      ) : null}
    </section>
  );
}
