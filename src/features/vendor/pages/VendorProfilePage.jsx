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
import { fetchVendorProfiles } from "../api";
import {
  readOrderSummary,
  writeOrderSummary,
} from "../utils/orderSummaryStorage";
import {
  confirmRemoveItem,
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../utils/alerts";
import {
  VendorAvailabilityPopup,
  VendorCategoryTabs,
  VendorLocationModal,
  VendorMenuSection,
  VendorOrderSidebar,
  VendorProfileHeader,
} from "../components";
import { useVendorProfile } from "../hooks/useVendorProfile";
import { useSavedVendorStatus } from "../hooks/useSavedVendorStatus";

function VendorPageStatus({ message, onRetry }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6] px-4">
      <div className="w-full max-w-lg rounded-[24px] border border-[#eadfd2] bg-white p-6 text-center shadow-[0_18px_40px_rgba(31,19,8,0.08)]">
        <p className="text-[24px] font-semibold text-[#171512]">
          Unable to load vendor page
        </p>
        <p className="mt-3 text-[15px] leading-6 text-[#6c6259]">
          {message}
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-full bg-[#cf6e38] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#bb602d]"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function VendorProfilePage() {
  const CATEGORY_BAR_TOP_OFFSET = 78;
  const { vendorSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { vendor, isLoading: loading, error } = useVendorProfile(vendorSlug);

  const [activeCategory, setActiveCategory] = useState("");
  const [orderSummary, setOrderSummary] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAvailabilityPopupDismissed, setIsAvailabilityPopupDismissed] =
    useState(false);
  const [isCategoryBarFixed, setIsCategoryBarFixed] = useState(false);
  const [categoryBarStyle, setCategoryBarStyle] = useState({});
  const [vendorOptions, setVendorOptions] = useState([]);
  const sectionRefs = useRef({});
  const categoryBarAnchorRef = useRef(null);
  const categoryBarInnerRef = useRef(null);
  const menuSectionsRef = useRef(null);
  const { isSaved, toggle: toggleSavedState } = useSavedVendorStatus(vendor);

  useEffect(() => {
    if (!vendor) {
      return;
    }

    setOrderSummary(readOrderSummary(vendor));
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

    writeOrderSummary(vendor, orderSummary);
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
    let isMounted = true;

    async function loadVendorOptions() {
      if (!vendor || !orderSummary) {
        return;
      }

      const isAvailabilityBlocked = !isVendorDeliverySlotAvailable(
        vendor,
        orderSummary.deliveryDate,
        orderSummary.deliveryTime,
      );

      if (!isAvailabilityBlocked) {
        if (isMounted) {
          setVendorOptions([]);
        }
        return;
      }

      try {
        const nextVendors = await fetchVendorProfiles();

        if (isMounted) {
          setVendorOptions(nextVendors);
        }
      } catch {
        if (isMounted) {
          setVendorOptions([]);
        }
      }
    }

    loadVendorOptions();

    return () => {
      isMounted = false;
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
    return (
      <VendorPageStatus
        message={error || "This vendor could not be found."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!orderSummary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  const showAvailabilityPopup = !isVendorDeliverySlotAvailable(
    vendor,
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
  );
  const availableRestaurants = getAvailableVendorsForSlot(
    vendorOptions,
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
    vendor.slug,
  );
  const isVendorAvailable = !showAvailabilityPopup;

  const handleSaveToggle = async () => {
    try {
      const nextSavedState = await toggleSavedState();
      showSuccessToast(
        nextSavedState
          ? `${vendor.name} saved successfully`
          : `${vendor.name} removed from saved restaurants`,
      );
    } catch (saveError) {
      await showAuthErrorAlert(
        saveError.message || "Unable to update saved vendor right now.",
        "Save vendor failed",
      );
    }
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
                {vendor.banner || vendor.logo ? (
                  <img
                    src={vendor.banner || vendor.logo}
                    alt={vendor.name}
                    className="h-[260px] w-full rounded-[14px] object-cover"
                  />
                ) : (
                  <div className="h-[260px] w-full rounded-[14px] border border-[#e7dfd6] bg-[#f7f1ea]" />
                )}
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
            isVendorAvailable={isVendorAvailable}
            onRemoveItem={async (itemId) => {
              const itemName = orderSummary.items.find((item) => item.id === itemId)?.name;
              const result = await confirmRemoveItem(itemName);

              if (!result.isConfirmed) {
                return;
              }

              setOrderSummary((current) => {
                return {
                  ...current,
                  items: current.items.filter((item) => item.id !== itemId),
                };
              });
            }}
            onTipChange={(tipRate, customTipAmount) =>
              setOrderSummary((current) => ({
                ...current,
                tipRate,
                customTipAmount:
                  customTipAmount !== undefined
                    ? customTipAmount
                    : current.customTipAmount,
              }))
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
