import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  filterDeliverySlotsForDate,
  fetchVendorProfileBySlug,
  fetchVendorProfiles,
  getAvailableVendorsForSlot,
  getVendorClosureForDate,
  isVendorDeliverySlotAvailable,
} from "../../vendor";
import {
  clearOtherStoredOrderSummaries,
  readOrderSummary,
  writeOrderSummary,
} from "../../vendor/utils/orderSummaryStorage";
import { useAuth } from "../../auth";
import {
  confirmRemoveItem,
  promptSignInRequired,
  showAuthErrorAlert,
  showMenuUnavailableAlert,
  showSuccessToast,
  showVendorClosureAlert,
} from "../../../utils/alerts";
import {
  VendorAvailabilityPopup,
  VendorOrderSidebar,
} from "../../vendor/components";
import {
  MenuAddOnsSection,
  MenuDeliveryForm,
  MenuHeroBanner,
  MenuIncludedSection,
  MenuOverviewSection,
} from "../components";
import { useMenuDetails } from "../hooks/useMenuDetails";
import { useSavedVendorStatus } from "../../vendor/hooks/useSavedVendorStatus";
import { fetchAvailableDeliverySlots } from "../../checkOut/api";
import {
  getMenuAvailabilityError,
  validateOrderSummaryBasics,
} from "../../order/utils/orderFlowValidation";

export default function MenuDetailsPage() {
  const { t } = useTranslation();
  const { vendorSlug, itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const {
    menuItem,
    vendor,
    isLoading: loading,
    error,
  } = useMenuDetails({ itemId, vendorSlug });
  
  const [orderSummary, setOrderSummary] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState("1 order");
  const [selectedRequired, setSelectedRequired] = useState("");
  const [selectedOptional, setSelectedOptional] = useState({});
  const [vendorNote, setVendorNote] = useState("");
  const [isAvailabilityPopupDismissed, setIsAvailabilityPopupDismissed] =
    useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotAccessState, setSlotAccessState] = useState({
    requiresAuth: false,
    message: "",
  });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const addOnsSliderRef = useRef(null);
  const lastMenuAvailabilityAlertKeyRef = useRef("");
  const lastClosureAlertKeyRef = useRef("");
  const lastSlotAuthPromptKeyRef = useRef("");
  const { isSaved, toggle: toggleSavedState } = useSavedVendorStatus(vendor);
  const minimumPersons = menuItem?.serves ?? 1;
  const baseItemPricingType = menuItem?.modal?.pricingType ?? menuItem?.pricingType ?? "per-person";
  const baseItemPrice = Number(menuItem?.price ?? 0);
  const baseItemUnitPrice = Number(
    menuItem?.modal?.unitPrice ?? menuItem?.modal?.pricePerPerson ?? 0,
  );

  useEffect(() => {
    if (!vendor || !menuItem) {
      return;
    }

    const storedSummary = readOrderSummary(vendor);

    setOrderSummary({
      ...storedSummary,
      personCount: Math.max(
        minimumPersons,
        Number(storedSummary.personCount ?? minimumPersons),
      ),
    });
    setVendorNote(`${storedSummary.vendorNote ?? ""}`);
    setSelectedQuantity(menuItem.modal.quantityOptions[0] ?? "1 order");
    setSelectedRequired(menuItem.modal.requiredSelection?.options?.[0] ?? "");
    setSelectedOptional(
      (storedSummary.items || []).reduce((accumulator, item) => {
        if (
          item?.isAddOn &&
          item?.parentMenuItemId === menuItem.id &&
          item?.addOnKey &&
          Number(item?.quantity) > 0
        ) {
          accumulator[item.addOnKey] = Number(item.quantity);
        }

        return accumulator;
      }, {}),
    );
    setIsAvailabilityPopupDismissed(false);
  }, [menuItem, minimumPersons, vendor]);

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
    if (!vendor || !orderSummary) {
      return;
    }

    writeOrderSummary(vendor, orderSummary);
  }, [orderSummary, vendor]);

  useEffect(() => {
    function handleScroll() {
      setShowScrollToTop(window.scrollY > 480);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const date = `${orderSummary?.deliveryDate ?? ""}`.trim();
    const vendorId = vendor?.id;

    if (!date || !vendorId) {
      setDeliverySlots([]);
      setSlotAccessState({ requiresAuth: false, message: "" });
      lastSlotAuthPromptKeyRef.current = "";
      return;
    }

    if (!isLoggedIn) {
      const authMessage =
        t("menu.signInForSlots");
      const promptKey = `${vendorId}:${date}`;

      setDeliverySlots([]);
      setSlotAccessState({
        requiresAuth: true,
        message: authMessage,
      });
      setIsLoadingSlots(false);

      if (lastSlotAuthPromptKeyRef.current !== promptKey) {
        lastSlotAuthPromptKeyRef.current = promptKey;

        Promise.resolve()
          .then(() =>
            promptSignInRequired({
              title: "Sign in to view delivery slots",
              text: authMessage,
            }),
          )
          .then((result) => {
            if (result?.isConfirmed) {
              navigate("/signin", { state: { from: location } });
            } else if (result?.isDenied) {
              navigate("/signup", { state: { from: location } });
            }
          })
          .catch(() => {});
      }

      return;
    }

    let isCancelled = false;

    async function loadSlots() {
      setIsLoadingSlots(true);
      setSlotAccessState({ requiresAuth: false, message: "" });

      try {
        const nextSlots = await fetchAvailableDeliverySlots({
          vendorId,
          date,
        });
        let latestVendor = null;
        let didRefreshVendor = false;

        const filteredLiveSlots = filterDeliverySlotsForDate(nextSlots, vendor, date);

        if (filteredLiveSlots.length === 0 && vendorSlug) {
          try {
            latestVendor = await fetchVendorProfileBySlug(vendorSlug);
            didRefreshVendor = Boolean(latestVendor?.id);
          } catch {
            latestVendor = null;
            didRefreshVendor = false;
          }
        }

        const slotVendor = latestVendor || vendor;
        const refreshedFilteredLiveSlots =
          latestVendor && filteredLiveSlots.length === 0
            ? filterDeliverySlotsForDate(nextSlots, latestVendor, date)
            : filteredLiveSlots;
        const resolvedSlots = refreshedFilteredLiveSlots;

        if (isCancelled) {
          return;
        }

        setDeliverySlots(resolvedSlots);

        const matchedClosure =
          resolvedSlots.length === 0 && didRefreshVendor
            ? getVendorClosureForDate(slotVendor, date)
            : null;
        const closureAlertKey = matchedClosure
          ? `${slotVendor?.id || slotVendor?.slug || "vendor"}:${date}:${matchedClosure.id}`
          : "";

        if (
          matchedClosure &&
          resolvedSlots.length === 0 &&
          lastClosureAlertKeyRef.current !== closureAlertKey
        ) {
          lastClosureAlertKeyRef.current = closureAlertKey;
          showVendorClosureAlert({
            vendorName: slotVendor?.name || vendor?.name,
            selectedDate: date,
            closureReason: matchedClosure.reason,
            closureStartDate: matchedClosure.startDate,
            closureEndDate: matchedClosure.endDate,
          });
        }

        if (!matchedClosure || resolvedSlots.length > 0) {
          lastClosureAlertKeyRef.current = "";
        }

        if (orderSummary?.deliveryTime) {
          const matchesExistingSlot = resolvedSlots.some(
            (slot) =>
              !slot.isFullyBooked &&
              orderSummary.deliveryTime >= slot.start &&
              orderSummary.deliveryTime <= slot.end,
          );

          if (!matchesExistingSlot && resolvedSlots.length > 0) {
            setOrderSummary((current) => ({
              ...current,
              deliveryTime: "",
            }));
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setDeliverySlots([]);

          if (error?.code === "AUTH_REQUIRED" && !isLoggedIn) {
            const authMessage =
              error.message ||
              "Sign in to view live delivery availability for the selected date.";

            setSlotAccessState({
              requiresAuth: true,
              message: authMessage,
            });

            const promptKey = `${vendorId}:${date}`;

            if (lastSlotAuthPromptKeyRef.current !== promptKey) {
              lastSlotAuthPromptKeyRef.current = promptKey;

              const result = await promptSignInRequired({
                title: "Sign in to view delivery slots",
                text: authMessage,
              });

              if (isCancelled) {
                return;
              }

              if (result.isConfirmed) {
                navigate("/signin", { state: { from: location } });
              } else if (result.isDenied) {
                navigate("/signup", { state: { from: location } });
              }
            }
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      isCancelled = true;
    };
  }, [
    isLoggedIn,
    location,
    navigate,
    orderSummary?.deliveryDate,
    orderSummary?.deliveryTime,
    vendor?.id,
    vendorSlug,
  ]);

  const addOnItems = useMemo(() => {
    if (!menuItem || !vendor) {
      return [];
    }

    return menuItem.modal.optionalSelections.flatMap((group, groupIndex) =>
      group.options.map((option, optionIndex) => ({
        ...option,
        id: `${group.title}-${option.label}`,
        image:
          option.image ||
          (optionIndex % 2 === 0
            ? vendor.banner
            : vendor.heroSideImage ?? menuItem.image),
        groupTitle: group.title,
        order: groupIndex,
      })),
    );
  }, [menuItem, vendor]);

  const buildAddOnLineItem = (matchedOption, quantity, key) => ({
    id: `addon-${menuItem.id}-${key}`,
    productId: matchedOption.productId ?? matchedOption.id,
    addOnKey: key,
    parentMenuItemId: menuItem.id,
    name: matchedOption.label,
    quantity,
    serves: quantity,
    totalServes: quantity,
    unitPrice: Number(matchedOption.price),
    price: Number(matchedOption.price) * quantity,
    pricingType: "fixed",
    isAddOn: true,
    details: [`Qty: ${quantity}`, "Add-on item"],
  });

  const includedMenuItems = useMemo(() => {
    if (!menuItem || !menuItem.menuItems) {
      return [];
    }

    return menuItem.menuItems.map((item) => {
      const allergenLabels = (item.allergens || [])
        .map((allergen) =>
          typeof allergen === "string" ? allergen : allergen?.name,
        )
        .filter(Boolean)
        .join(", ");

      return {
        label: item.title || item.name,
        description: item.description || "",
        allergens: allergenLabels,
        image: item.imageUrl || item.image || menuItem.image || vendor.banner,
      };
    });
  }, [menuItem, vendor]);

  const vendorAvailableForSelection = isVendorDeliverySlotAvailable(
    vendor,
    orderSummary?.deliveryDate,
    orderSummary?.deliveryTime,
  );
  const hasDeliverySchedule = Boolean(
    vendor?.availability?.delivery?.days?.length ||
      vendor?.availability?.delivery?.slots?.length,
  );
  const hasNoSlotsForSelectedDate =
    Boolean(orderSummary?.deliveryDate) &&
    hasDeliverySchedule &&
    !isLoadingSlots &&
    deliverySlots.length === 0;
  const menuAvailabilityError = getMenuAvailabilityError(
    menuItem,
    orderSummary?.deliveryDate,
    orderSummary?.deliveryTime,
  );
  const menuAvailableDaysLabel = useMemo(() => {
    const labels = {
      su: "Sunday",
      mo: "Monday",
      tu: "Tuesday",
      we: "Wednesday",
      th: "Thursday",
      fr: "Friday",
      sa: "Saturday",
    };

    const availableDays = Array.isArray(menuItem?.availableDays)
      ? menuItem.availableDays
      : [];

    return availableDays
      .map((day) => labels[String(day || "").toLowerCase()])
      .filter(Boolean)
      .join(", ");
  }, [menuItem]);
  const isMenuAvailableForSelection = !menuAvailabilityError;
  const isOrderableForSelection =
    vendorAvailableForSelection &&
    isMenuAvailableForSelection &&
    !hasNoSlotsForSelectedDate;
  const hasMainDishInCart = Boolean(
    orderSummary?.items?.some(
      (item) => !item?.isAddOn && item?.productId === menuItem?.id,
    ),
  );

  useEffect(() => {
    const deliveryDate = `${orderSummary?.deliveryDate ?? ""}`.trim();

    if (!deliveryDate || !menuAvailabilityError || vendorAvailableForSelection === false) {
      lastMenuAvailabilityAlertKeyRef.current = "";
      return;
    }

    const nextAlertKey = `${menuItem?.id || "menu"}:${deliveryDate}:${menuAvailabilityError}`;

    if (lastMenuAvailabilityAlertKeyRef.current === nextAlertKey) {
      return;
    }

    lastMenuAvailabilityAlertKeyRef.current = nextAlertKey;

    showMenuUnavailableAlert({
      menuTitle: menuItem?.title || menuItem?.modal?.heading || "This menu",
      message: menuAvailabilityError,
      availableDaysLabel: menuAvailableDaysLabel,
    });
  }, [
    menuAvailabilityError,
    menuAvailableDaysLabel,
    menuItem?.id,
    menuItem?.modal?.heading,
    menuItem?.title,
    orderSummary?.deliveryDate,
    vendorAvailableForSelection,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !vendor || !menuItem) {
    return <Navigate to={vendor ? `/vendor/${vendor.slug}` : "/"} replace />;
  }

  if (!orderSummary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  const updateOptionalQuantity = (groupTitle, optionLabel, delta) => {
    if (delta > 0 && !hasMainDishInCart) {
      showAuthErrorAlert(
        t("menu.unavailableAddonBody"),
        t("menu.unavailableAddonTitle"),
      );
      return;
    }

    if (delta > 0) {
      showSuccessToast(t("menu.addonAdded", { name: optionLabel }));
    }

    setSelectedOptional((current) => {
      const key = `${groupTitle}:${optionLabel}`;
      const nextValue = Math.max(0, (current[key] ?? 0) + delta);

      setOrderSummary((currentSummary) => {
        if (!currentSummary) {
          return currentSummary;
        }

        const matchedOption = addOnItems.find(
          (option) => `${option.groupTitle}:${option.label}` === key,
        );

        if (!matchedOption) {
          return currentSummary;
        }

        const remainingItems = currentSummary.items.filter(
          (item) =>
            !(
              item?.isAddOn &&
              item?.parentMenuItemId === menuItem.id &&
              item?.addOnKey === key
            ),
        );

        if (nextValue === 0) {
          return {
            ...currentSummary,
            items: remainingItems,
          };
        }

        return {
          ...currentSummary,
          items: [...remainingItems, buildAddOnLineItem(matchedOption, nextValue, key)],
        };
      });

      if (nextValue === 0) {
        const { [key]: _removed, ...remaining } = current;
        return remaining;
      }

      return {
        ...current,
        [key]: nextValue,
      };
    });
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      const result = await promptSignInRequired();

      if (result.isConfirmed) {
        navigate("/signin", { state: { from: location } });
      } else if (result.isDenied) {
        navigate("/signup", { state: { from: location } });
      }

      return;
    }

    if (
      !vendorAvailableForSelection
    ) {
      await showAuthErrorAlert(
        t("menu.unavailableForSelectedTime"),
        t("menu.unavailableForSelectedTimeTitle"),
      );
      return;
    }

    if (!isMenuAvailableForSelection) {
      await showAuthErrorAlert(
        menuAvailabilityError || t("menu.unavailableForSelectedDate"),
        "Menu unavailable",
      );
      return;
    }

    const validationError = validateOrderSummaryBasics({
      deliveryDate: orderSummary.deliveryDate,
      deliveryTime: orderSummary.deliveryTime,
      deliveryAddress: orderSummary.deliveryAddress,
      personCount: orderSummary.personCount,
      minimumPersons,
    });

    if (validationError) {
      await showAuthErrorAlert(validationError, "Order details required");
      return;
    }

    const quantityCount = Number.parseInt(selectedQuantity, 10) || 1;
    const totalServes = menuItem.serves * quantityCount;
      const itemName = menuItem.modal?.heading ?? menuItem.title ?? t("menu.item");
    const linePrice =
      baseItemPrice > 0
        ? baseItemPrice * quantityCount
        : baseItemUnitPrice * quantityCount;
    const normalizedVendorNote = vendorNote.trim();
    const selectedOptions = {};
    const syncedAddOnItems = Object.entries(selectedOptional)
      .filter(([, quantity]) => quantity > 0)
      .map(([key, quantity]) => {
        const matchedOption = addOnItems.find(
          (option) => `${option.groupTitle}:${option.label}` === key,
        );

        if (!matchedOption) {
          return null;
        }

        return buildAddOnLineItem(matchedOption, quantity, key);
      })
      .filter(Boolean);

    if (selectedRequired) {
      const requiredSelectionLabel =
        menuItem.modal?.requiredSelection?.title || "Selection";
      selectedOptions[requiredSelectionLabel] = selectedRequired;
    }

    const summaryItem = {
      id: `${menuItem.id}-${Date.now()}`,
      productId: menuItem.id,
      name: itemName,
      quantity: quantityCount,
      serves: menuItem.serves,
      totalServes,
      unitPrice: baseItemUnitPrice,
      price: baseItemPricingType === "fixed" ? linePrice : 0,
      pricingType: baseItemPricingType,
      availableDays: Array.isArray(menuItem.availableDays) ? menuItem.availableDays : [],
      minLeadTimeHours: Number(menuItem.minLeadTimeHours || 0),
      minLeadTimeDays: Number(menuItem.minLeadTimeDays || 0),
      isAvailabilityWindowEnabled: Boolean(menuItem.isAvailabilityWindowEnabled),
      availableFrom: menuItem.availableFrom || "",
      availableUntil: menuItem.availableUntil || "",
      menuAvailability: {
        availableDays: Array.isArray(menuItem.availableDays) ? menuItem.availableDays : [],
        minLeadTimeHours: Number(menuItem.minLeadTimeHours || 0),
        minLeadTimeDays: Number(menuItem.minLeadTimeDays || 0),
        isAvailabilityWindowEnabled: Boolean(menuItem.isAvailabilityWindowEnabled),
        availableFrom: menuItem.availableFrom || "",
        availableUntil: menuItem.availableUntil || "",
      },
      selectedOptions,
      specialInstructions: normalizedVendorNote,
      details: [
        t("menu.serves", { count: menuItem.serves }),
        selectedQuantity,
        selectedRequired,
        normalizedVendorNote ? t("menu.note", { note: normalizedVendorNote }) : null,
      ].filter(Boolean),
    };

    clearOtherStoredOrderSummaries(vendor.slug);

    setOrderSummary((current) => ({
      ...current,
      personCount: Math.max(
        minimumPersons,
        Number(current.personCount ?? minimumPersons),
      ),
      items: [
        summaryItem,
        ...syncedAddOnItems,
        ...current.items.filter(
          (item) =>
            !(
              (item?.productId === menuItem.id && !item?.isAddOn) ||
              (item?.isAddOn && item?.parentMenuItemId === menuItem.id)
            ),
        ),
      ],
    }));

    showSuccessToast(t("menu.addedToCart", { name: itemName }));
  };

  const handleDeliveryDateChange = (deliveryDate) => {
    setOrderSummary((current) => ({
      ...current,
      deliveryDate,
      deliveryTime: "",
    }));
  };

  const showAvailabilityPopup = !vendorAvailableForSelection;
  const availableRestaurants = getAvailableVendorsForSlot(
    vendorOptions,
    orderSummary.deliveryDate,
    orderSummary.deliveryTime,
    vendor.slug,
  );

  const scrollAddOns = (direction) => {
    if (!addOnsSliderRef.current) {
      return;
    }

    const slider = addOnsSliderRef.current;
    const scrollAmount = Math.max(slider.clientWidth * 0.8, 220);

    slider.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSaveToggle = async () => {
    try {
      const nextSavedState = await toggleSavedState();
      showSuccessToast(
        nextSavedState
          ? t("menu.savedSuccess", { name: vendor.name })
          : t("menu.removedSaved", { name: vendor.name }),
      );
    } catch (saveError) {
      await showAuthErrorAlert(
        saveError.message || t("menu.saveFailedMessage"),
        t("menu.saveFailed"),
      );
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden px-4 py-5 md:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,236,224,0.9),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,229,215,0.82),transparent_32%),linear-gradient(180deg,#fff9f4_0%,#fffdfb_38%,#f8f1ea_100%)]" />
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#ddd3c8] bg-[#fffaf6] shadow-[0_24px_56px_rgba(55,34,19,0.09)]">
        <MenuHeroBanner
          vendorSlug={vendor.slug}
          image={menuItem.image}
          title={menuItem.modal.heading}
          isSaved={isSaved}
          onSaveToggle={handleSaveToggle}
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 border-r border-[#e7dfd6] bg-white">
            <div className="space-y-6 p-4 sm:p-5 lg:p-6">
              <MenuOverviewSection vendor={vendor} menuItem={menuItem} />
              <MenuIncludedSection
                vendorSlug={vendor.slug}
                menuItem={menuItem}
                includedMenuItems={includedMenuItems}
              />
              <MenuDeliveryForm
                isVendorAvailable={isOrderableForSelection}
                orderSummary={orderSummary}
                vendorNote={vendorNote}
                deliverySlots={deliverySlots}
                isLoadingSlots={isLoadingSlots}
                hasDeliverySchedule={hasDeliverySchedule}
                slotAccessRequiresAuth={slotAccessState.requiresAuth}
                slotAccessMessage={slotAccessState.message}
                onDeliveryDateChange={handleDeliveryDateChange}
                onDeliveryTimeChange={(deliveryTime) =>
                  setOrderSummary((current) => ({ ...current, deliveryTime }))
                }
                onPersonCountChange={(personCount) =>
                  setOrderSummary((current) => ({
                    ...current,
                    personCount: Math.max(minimumPersons, personCount),
                  }))
                }
                onDeliveryAddressChange={(deliveryAddress) =>
                  setOrderSummary((current) => ({ ...current, deliveryAddress }))
                }
                minimumPersons={minimumPersons}
                onVendorNoteChange={(nextVendorNote) => {
                  setVendorNote(nextVendorNote);
                  setOrderSummary((current) => ({
                    ...current,
                    vendorNote: nextVendorNote,
                  }));
                }}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,#fff9f4_0%,#fff6ef_100%)]">
            <div className="p-4 sm:p-5 lg:sticky lg:top-[92px] lg:p-6">
              <div className="mb-4 rounded-[24px] border border-[#eadfd5] bg-white/90 p-4 shadow-[0_14px_34px_rgba(55,34,19,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b37a59]">
                  {t("menu.orderSummary")}
                </p>
                <h2 className="mt-2 text-[22px] font-semibold text-[#1c1713]">
                  {t("menu.reviewBeforeCheckout")}
                </h2>
                <p className="mt-2 text-[14px] leading-6 text-[#6b5d53]">
                  {t("menu.summaryDescription")}
                </p>
              </div>

              <VendorOrderSidebar
            vendor={vendor}
            orderSummary={orderSummary}
            isVendorAvailable={isOrderableForSelection}
            onRemoveItem={async (itemKey) => {
              const itemName = orderSummary.items.find((item) => item.id === itemKey)?.name;
              const result = await confirmRemoveItem(itemName);

              if (!result.isConfirmed) {
                return;
              }

              setOrderSummary((current) => {
                return {
                  ...current,
                  items: current.items.filter((item) => item.id !== itemKey),
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
              setOrderSummary((current) => ({
                ...current,
                personCount: Math.max(minimumPersons, personCount),
              }))
            }
            onDeliveryAddressChange={(deliveryAddress) =>
              setOrderSummary((current) => ({ ...current, deliveryAddress }))
            }
            onInvoiceAddressChange={(invoiceAddress) =>
              setOrderSummary((current) => ({ ...current, invoiceAddress }))
            }
            minimumPersons={minimumPersons}
              />
            </div>
          </div>
        </div>

        {addOnItems.length > 0 ? (
          <MenuAddOnsSection
            addOnsSliderRef={addOnsSliderRef}
            addOnItems={addOnItems}
            hasMainDishInCart={hasMainDishInCart}
            selectedOptional={selectedOptional}
            onScroll={scrollAddOns}
            onUpdateOptionalQuantity={updateOptionalQuantity}
          />
        ) : null}
      </div>

      {showAvailabilityPopup && !isAvailabilityPopupDismissed ? (
        <VendorAvailabilityPopup
          availability={vendor.availability}
          availableRestaurants={availableRestaurants}
          onClose={() => setIsAvailabilityPopupDismissed(true)}
        />
      ) : null}

      {showScrollToTop ? (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label={t("menu.scrollToTop")}
          className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#cf6e38]/20 bg-[#cf6e38] text-white shadow-[0_18px_36px_rgba(207,110,56,0.28)] transition hover:bg-[#bb602d]"
        >
          <FiArrowUp className="text-[20px]" />
        </button>
      ) : null}
    </section>
  );
}
