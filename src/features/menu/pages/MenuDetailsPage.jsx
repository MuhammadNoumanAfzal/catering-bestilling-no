import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchVendorProfiles,
  getAvailableVendorsForSlot,
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
  const addOnsSliderRef = useRef(null);
  const lastMenuAvailabilityAlertKeyRef = useRef("");
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
    setSelectedOptional({});
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
    const date = `${orderSummary?.deliveryDate ?? ""}`.trim();
    const vendorId = vendor?.id;

    if (!date || !vendorId) {
      setDeliverySlots([]);
      return;
    }

    let isCancelled = false;

    async function loadSlots() {
      setIsLoadingSlots(true);

      try {
        const nextSlots = await fetchAvailableDeliverySlots({
          vendorId,
          date,
        });

        if (isCancelled) {
          return;
        }

        setDeliverySlots(nextSlots);

        if (orderSummary?.deliveryTime) {
          const matchesExistingSlot = nextSlots.some(
            (slot) =>
              !slot.isFullyBooked &&
              orderSummary.deliveryTime >= slot.start &&
              orderSummary.deliveryTime <= slot.end,
          );

          if (!matchesExistingSlot && nextSlots.length > 0) {
            setOrderSummary((current) => ({
              ...current,
              deliveryTime: "",
            }));
          }
        }
      } catch {
        if (!isCancelled) {
          setDeliverySlots([]);
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
  }, [orderSummary?.deliveryDate, orderSummary?.deliveryTime, vendor?.id]);

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

  useEffect(() => {
    if (!menuItem || !addOnItems.length) {
      return;
    }

    setOrderSummary((current) => {
      if (!current) {
        return current;
      }

      const syncedAddOnItems = Object.entries(selectedOptional)
        .filter(([, quantity]) => quantity > 0)
        .map(([key, quantity]) => {
          const matchedOption = addOnItems.find(
            (option) => `${option.groupTitle}:${option.label}` === key,
          );

          if (!matchedOption) {
            return null;
          }

          return {
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
          };
        })
        .filter(Boolean);

      const remainingItems = current.items.filter(
        (item) => !(item.isAddOn && item.parentMenuItemId === menuItem.id),
      );

      return {
        ...current,
        items: [...remainingItems, ...syncedAddOnItems],
      };
    });
  }, [addOnItems, menuItem, selectedOptional]);

  const includedMenuItems = useMemo(() => {
    if (!menuItem || !menuItem.menuItems) {
      return [];
    }
    return menuItem.menuItems.map((item) => {
      const descParts = [];
      if (item.description) {
        descParts.push(item.description);
      }
      if (item.allergens && item.allergens.length > 0) {
        const allergenLabels = item.allergens
          .map((allergen) =>
            typeof allergen === "string" ? allergen : allergen?.name,
          )
          .filter(Boolean);

        if (allergenLabels.length > 0) {
          descParts.push(`Allergens: ${allergenLabels.join(", ")}.`);
        }
      }
      return {
        label: item.title || item.name,
        description: descParts.join(" "),
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
    if (delta > 0) {
      showSuccessToast(`${optionLabel} add-on added to cart`);
    }

    setSelectedOptional((current) => {
      const key = `${groupTitle}:${optionLabel}`;
      const nextValue = Math.max(0, (current[key] ?? 0) + delta);

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
        "This caterer is unavailable at your selected delivery time. Please choose another date or time.",
        "Unavailable for selected time",
      );
      return;
    }

    if (!isMenuAvailableForSelection) {
      await showAuthErrorAlert(
        menuAvailabilityError || "This menu is unavailable for the selected date.",
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
    const itemName = menuItem.modal?.heading ?? menuItem.title ?? "Item";
    const linePrice =
      baseItemPrice > 0
        ? baseItemPrice * quantityCount
        : baseItemUnitPrice * quantityCount;
    const normalizedVendorNote = vendorNote.trim();
    const selectedOptions = {};

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
      isAvailabilityWindowEnabled: Boolean(menuItem.isAvailabilityWindowEnabled),
      availableFrom: menuItem.availableFrom || "",
      availableUntil: menuItem.availableUntil || "",
      menuAvailability: {
        availableDays: Array.isArray(menuItem.availableDays) ? menuItem.availableDays : [],
        isAvailabilityWindowEnabled: Boolean(menuItem.isAvailabilityWindowEnabled),
        availableFrom: menuItem.availableFrom || "",
        availableUntil: menuItem.availableUntil || "",
      },
      selectedOptions,
      specialInstructions: normalizedVendorNote,
      details: [
        `Serves ${menuItem.serves}`,
        selectedQuantity,
        selectedRequired,
        normalizedVendorNote ? `Note: ${normalizedVendorNote}` : null,
      ].filter(Boolean),
    };

    clearOtherStoredOrderSummaries(vendor.slug);

    setOrderSummary((current) => ({
      ...current,
      personCount: Math.max(
        minimumPersons,
        Number(current.personCount ?? minimumPersons),
      ),
      items: [summaryItem, ...current.items],
    }));

    showSuccessToast(`${itemName} added to cart`);
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

  return (
    <section className="px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-[#ddd3c8] bg-[#fffaf6] shadow-[0_14px_40px_rgba(55,34,19,0.08)]">
        <MenuHeroBanner
          vendorSlug={vendor.slug}
          image={menuItem.image}
          title={menuItem.modal.heading}
          isSaved={isSaved}
          onSaveToggle={handleSaveToggle}
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 border-r border-[#e7dfd6] bg-white">
            <div className="p-4 sm:p-5">
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
                onDeliveryDateChange={(deliveryDate) =>
                  setOrderSummary((current) => ({
                    ...current,
                    deliveryDate,
                    deliveryTime: "",
                  }))
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

        {addOnItems.length > 0 ? (
          <MenuAddOnsSection
            addOnsSliderRef={addOnsSliderRef}
            addOnItems={addOnItems}
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
    </section>
  );
}
