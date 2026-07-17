import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth";
import { getConfiguredDeliverySlotsForDate } from "../../vendor";
import {
  clearAllStoredOrderSummaries,
  clearStoredOrderSummary,
  readAllStoredOrderSummaries,
  writeOrderSummary,
} from "../../vendor/utils/orderSummaryStorage";
import {
  buildCheckoutAddressFields,
  readSavedAddresses,
  writeSavedAddresses,
  writeSavedSettings,
} from "../../../utils/customerProfileStorage";
import {
  confirmPlaceOrder,
  confirmRemoveItem,
  showAuthErrorAlert,
  showOrderPlacedSuccess,
} from "../../../utils/alerts";
import { writePlacedOrderDraft } from "../../order/services";
import {
  fetchAvailableDeliverySlots,
  fetchCheckoutAutofillProfile,
  fetchCheckoutPreview,
  placeCheckoutOrders,
} from "../api";
import {
  createInitialCheckoutFormState,
  VALID_CHECKOUT_TYPES,
} from "../constants/checkoutForm";
import { validateCheckoutForm } from "../../order/utils/orderFlowValidation";

const CHECKOUT_DRAFT_STORAGE_KEY = "checkout-form-draft";

function readCheckoutDrafts() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.sessionStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

function readCheckoutFormDraft(type) {
  const drafts = readCheckoutDrafts();
  return type ? drafts[type] ?? null : null;
}

function writeCheckoutFormDraft(type, formState) {
  if (typeof window === "undefined" || !type) {
    return;
  }

  const drafts = readCheckoutDrafts();
  drafts[type] = formState;
  window.sessionStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

function clearCheckoutFormDraft(type) {
  if (typeof window === "undefined" || !type) {
    return;
  }

  const drafts = readCheckoutDrafts();
  delete drafts[type];

  if (Object.keys(drafts).length === 0) {
    window.sessionStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

function getMirroredInvoiceFields(formState) {
  return {
    ...buildCheckoutAddressFields(
      "invoice",
      {
        id: formState.selectedDeliveryAddressId || "",
        label: formState.deliveryAddressLabel || "",
        contactName: formState.deliveryContactName || "",
        addressLine1: formState.deliveryAddress || "",
        addressLine2: formState.deliveryAddressLine2 || "",
        city: formState.deliveryCity || "",
        postalCode: formState.deliveryPostalCode || "",
        phoneNumber: formState.deliveryPhoneNumber || "",
        instructions: formState.deliveryInstructions || "",
      },
      formState.deliveryAddress || "",
    ),
  };
}

function getSelectedAddress(addresses, addressId) {
  if (!Array.isArray(addresses) || addresses.length === 0 || !addressId) {
    return null;
  }

  return addresses.find((address) => address.id === addressId) ?? null;
}

function hasMeaningfulAddressValue(value) {
  return Boolean(`${value ?? ""}`.trim());
}

export function useCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutType } = useParams();
  const normalizedType = VALID_CHECKOUT_TYPES.includes(checkoutType)
    ? checkoutType
    : null;
  const { isLoggedIn } = useAuth();
  const [carts, setCarts] = useState([]);
  const [formState, setFormState] = useState(() => createInitialCheckoutFormState());
  const [deliveryAddresses, setDeliveryAddresses] = useState(() =>
    readSavedAddresses("delivery"),
  );
  const [invoiceAddresses, setInvoiceAddresses] = useState(() =>
    readSavedAddresses("invoice"),
  );
  const [isDeliveryAddressEditing, setIsDeliveryAddressEditing] = useState(false);
  const [isInvoiceAddressEditing, setIsInvoiceAddressEditing] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [pricingError, setPricingError] = useState("");

  const updateField = (key, value) => {
    setFormState((current) => {
      const nextState = { ...current, [key]: value };

      if (key === "invoiceSameAsDelivery") {
        if (value) {
          return {
            ...nextState,
            ...getMirroredInvoiceFields(nextState),
          };
        }

        return nextState;
      }

      if (
        current.invoiceSameAsDelivery &&
        key.startsWith("delivery")
      ) {
        return {
          ...nextState,
          ...getMirroredInvoiceFields(nextState),
        };
      }

      return nextState;
    });
  };

  const updateCartField = (key, value) => {
    setCarts((current) =>
      current.map((cart) => ({
        ...cart,
        orderSummary: {
          ...cart.orderSummary,
          [key]: value,
        },
      })),
    );
  };

  useEffect(() => {
    const storedCarts = readAllStoredOrderSummaries();
    const prefilledFormState = location.state?.prefillCheckoutForm;
    const savedDraft = readCheckoutFormDraft(normalizedType);

    setCarts(storedCarts);
    setFormState((current) => ({
      ...current,
      ...createInitialCheckoutFormState(storedCarts[0]),
      ...(savedDraft ?? {}),
      ...(prefilledFormState ?? {}),
    }));
  }, [location.state, normalizedType]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let isMounted = true;
    const hasSavedDraft = Boolean(readCheckoutFormDraft(normalizedType));

    async function autofillCheckoutProfile() {
      setIsAutofilling(true);

      try {
        const profile = await fetchCheckoutAutofillProfile();

        if (!isMounted) {
          return;
        }

        writeSavedSettings(profile.settings);

        writeSavedAddresses("delivery", profile.deliveryAddresses);
        setDeliveryAddresses(profile.deliveryAddresses);

        writeSavedAddresses("invoice", profile.invoiceAddresses);
        setInvoiceAddresses(profile.invoiceAddresses);

        if (!hasSavedDraft) {
          setFormState((current) => ({
            ...current,
            ...profile.formState,
          }));
        }
      } catch {
        // Keep existing locally saved checkout defaults if autofill fails.
      } finally {
        if (isMounted) {
          setIsAutofilling(false);
        }
      }
    }

    autofillCheckoutProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, normalizedType]);

  useEffect(() => {
    setFormState((current) => {
      const selectedDeliveryAddress = getSelectedAddress(
        deliveryAddresses,
        current.selectedDeliveryAddressId,
      );
      const selectedInvoiceAddress = getSelectedAddress(
        invoiceAddresses,
        current.selectedInvoiceAddressId,
      );

      const nextState = { ...current };
      let hasChanges = false;

      if (!selectedDeliveryAddress && current.selectedDeliveryAddressId) {
        nextState.selectedDeliveryAddressId = "";
        nextState.deliveryAddressLabel = "";
        hasChanges = true;
      }

      if (!selectedInvoiceAddress && current.selectedInvoiceAddressId) {
        nextState.selectedInvoiceAddressId = "";
        nextState.invoiceAddressLabel = "";
        hasChanges = true;
      }

      if (
        selectedDeliveryAddress &&
        !hasMeaningfulAddressValue(current.deliveryAddress) &&
        !hasMeaningfulAddressValue(current.deliveryCity) &&
        !hasMeaningfulAddressValue(current.deliveryPostalCode)
      ) {
        Object.assign(
          nextState,
          buildCheckoutAddressFields("delivery", selectedDeliveryAddress),
        );
        hasChanges = true;
      }

      if (
        selectedInvoiceAddress &&
        !current.invoiceSameAsDelivery &&
        !hasMeaningfulAddressValue(current.invoiceAddress) &&
        !hasMeaningfulAddressValue(current.invoiceCity) &&
        !hasMeaningfulAddressValue(current.invoicePostalCode)
      ) {
        Object.assign(
          nextState,
          buildCheckoutAddressFields("invoice", selectedInvoiceAddress),
        );
        hasChanges = true;
      }

      if (
        !selectedDeliveryAddress &&
        !hasMeaningfulAddressValue(current.deliveryAddress) &&
        !hasMeaningfulAddressValue(current.deliveryCity) &&
        !hasMeaningfulAddressValue(current.deliveryPostalCode)
      ) {
        nextState.deliveryContactName = "";
        nextState.deliveryPhoneNumber = "";
        nextState.deliveryInstructions = "";
        hasChanges = true;
      }

      if (
        !selectedInvoiceAddress &&
        !current.invoiceSameAsDelivery &&
        !hasMeaningfulAddressValue(current.invoiceAddress) &&
        !hasMeaningfulAddressValue(current.invoiceCity) &&
        !hasMeaningfulAddressValue(current.invoicePostalCode)
      ) {
        nextState.invoiceContactName = "";
        nextState.invoicePhoneNumber = "";
        nextState.invoiceInstructions = "";
        hasChanges = true;
      }

      return hasChanges ? nextState : current;
    });
  }, [deliveryAddresses, invoiceAddresses]);

  useEffect(() => {
    carts.forEach(({ vendor, orderSummary }) => {
      writeOrderSummary(vendor, orderSummary);
    });
  }, [carts]);

  const pricingRequestKey = useMemo(
    () =>
      JSON.stringify({
        checkoutType: normalizedType,
        date: formState.date,
        time: formState.time,
        deliveryAddress: formState.deliveryAddress,
        deliveryPostalCode: formState.deliveryPostalCode,
        deliveryCity: formState.deliveryCity,
        carts: carts.map((cart) => ({
          vendorId: cart.vendor.id,
          vendorSlug: cart.vendor.slug,
          personCount: cart.orderSummary.personCount,
          tipRate: cart.orderSummary.tipRate,
          customTipAmount: cart.orderSummary.customTipAmount,
          items: cart.orderSummary.items
            .filter((item) => !item?.isAddOn)
            .map((item) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              selectedOptions: item.selectedOptions,
              specialInstructions: item.specialInstructions,
            })),
          addOns: cart.orderSummary.items
            .filter((item) => item?.isAddOn)
            .map((item) => ({
              id: item.id,
              parentMenuItemId: item.parentMenuItemId,
              quantity: item.quantity,
              name: item.name,
            })),
        })),
      }),
    [
      carts,
      formState.date,
      formState.deliveryAddress,
      formState.deliveryCity,
      formState.deliveryPostalCode,
      formState.time,
      normalizedType,
    ],
  );

  const hasItems = carts.some((cart) => cart.orderSummary.items.length > 0);
  const hasLivePricing = carts.length > 0 && carts.every((cart) => {
    const pricing = cart?.orderSummary?.pricing;
    return pricing && pricing.grandTotal !== undefined && pricing.grandTotal !== null;
  });

  useEffect(() => {
    if (!normalizedType) {
      return;
    }

    if (!hasItems) {
      clearCheckoutFormDraft(normalizedType);
      return;
    }

    writeCheckoutFormDraft(normalizedType, formState);
  }, [formState, hasItems, normalizedType]);

  const totalPersonCount = useMemo(
    () =>
      carts.reduce((highestCount, cart) => {
        const nextCount = Number(cart.orderSummary.personCount ?? 0);
        return Math.max(highestCount, nextCount);
      }, 0) || 20,
    [carts],
  );

  useEffect(() => {
    if (!hasItems) {
      return;
    }

    setFormState((current) => ({
      ...current,
      personCount: totalPersonCount,
    }));
  }, [hasItems, totalPersonCount]);

  // Fetch live delivery slots when date or cart vendors change
  useEffect(() => {
    const date = formState.date;
    if (!date || !carts.length) {
      setDeliverySlots([]);
      return;
    }

    let isCancelled = false;

    async function loadSlots() {
      setIsLoadingSlots(true);
      try {
        // Fetch slots for the first cart's vendor (all carts share same date/time)
        const primaryVendorId = carts[0]?.vendor?.id;
        if (!primaryVendorId) return;

        const slots = await fetchAvailableDeliverySlots({
          vendorId: primaryVendorId,
          date,
        });
        const fallbackSlots =
          slots.length === 0
            ? getConfiguredDeliverySlotsForDate(carts[0]?.vendor, date)
            : [];
        const resolvedSlots = slots.length > 0 ? slots : fallbackSlots;

        if (!isCancelled) {
          setDeliverySlots(resolvedSlots);

          // Clear stale selections when the newly loaded day no longer supports the chosen time.
          if (formState.time) {
            const currentTime = formState.time;
            const matchedSlot = resolvedSlots.find(
              (slot) => currentTime >= slot.start && currentTime <= slot.end,
            );

            if (!matchedSlot || matchedSlot.isFullyBooked) {
              updateField("time", "");
              updateCartField("deliveryTime", "");
            }
          }
        }
      } catch {
        if (!isCancelled) setDeliverySlots([]);
      } finally {
        if (!isCancelled) setIsLoadingSlots(false);
      }
    }

    loadSlots();
    return () => { isCancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.date, carts.length]);

  useEffect(() => {
    if (!formState.invoiceSameAsDelivery) {
      return;
    }

    setFormState((current) => ({
      ...current,
      ...getMirroredInvoiceFields(current),
    }));
  }, [
    formState.deliveryAddress,
    formState.deliveryAddressLabel,
    formState.deliveryAddressLine2,
    formState.deliveryCity,
    formState.deliveryContactName,
    formState.deliveryInstructions,
    formState.deliveryPhoneNumber,
    formState.deliveryPostalCode,
    formState.invoiceSameAsDelivery,
    formState.selectedDeliveryAddressId,
  ]);

  useEffect(() => {
    if (!normalizedType || carts.length === 0) {
      return;
    }

    if (!formState.date || !formState.time || !formState.deliveryAddress) {
      return;
    }

    let isCancelled = false;

    async function loadCheckoutPricing() {
      setIsLoadingPricing(true);
      setPricingError("");

      try {
        const previewResults = await Promise.all(
          carts.map(async (cart) => {
            const preview = await fetchCheckoutPreview({
              cart,
              checkoutType: normalizedType,
              formState,
            });

            return {
              vendorSlug: cart.vendor.slug,
              pricing: preview.pricing || null,
              previewItems: Array.isArray(preview.items) ? preview.items : [],
              pricingCurrency: preview.currency || "NOK",
              availability: preview.availability || null,
            };
          }),
        );

        if (isCancelled) {
          return;
        }

        setCarts((current) =>
          current.map((cart) => {
            const matchedPreview = previewResults.find(
              (preview) => preview.vendorSlug === cart.vendor.slug,
            );

            if (!matchedPreview) {
              return cart;
            }

            return {
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                pricing: matchedPreview.pricing,
                previewItems: matchedPreview.previewItems,
                pricingCurrency: matchedPreview.pricingCurrency,
                availability: matchedPreview.availability,
              },
            };
          }),
        );
      } catch (error) {
        if (!isCancelled) {
          setPricingError(
            error instanceof Error && error.message
              ? error.message
              : "Unable to load backend checkout pricing.",
          );
          setCarts((current) =>
            current.map((cart) => ({
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                pricing: null,
                previewItems: [],
                pricingCurrency: "NOK",
              },
            })),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingPricing(false);
        }
      }
    }

    loadCheckoutPricing();

    return () => {
      isCancelled = true;
    };
  }, [carts.length, normalizedType, pricingRequestKey]);

  const handleTypeChange = (nextType) => {
    navigate(`/checkout/${nextType}`);
  };

  const applySavedAddress = (type, addressId) => {
    const source = type === "delivery" ? deliveryAddresses : invoiceAddresses;
    const selectedAddress = source.find((address) => address.id === addressId);

    if (!selectedAddress) {
      return;
    }

    setFormState((current) => ({
      ...current,
      ...buildCheckoutAddressFields(type, selectedAddress, current[`${type}Address`]),
      ...(type === "delivery" && current.invoiceSameAsDelivery
        ? getMirroredInvoiceFields({
            ...current,
            ...buildCheckoutAddressFields(
              type,
              selectedAddress,
              current[`${type}Address`],
            ),
          })
        : {}),
    }));
  };

  const handleTipChange = (vendorSlug, tipRate, customTipAmount) => {
    setCarts((current) =>
      current.map((cart) =>
        cart.vendor.slug === vendorSlug
          ? {
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                tipRate,
                customTipAmount:
                  customTipAmount !== undefined
                    ? customTipAmount
                    : cart.orderSummary.customTipAmount,
              },
            }
          : cart,
      ),
    );
  };

  const handleRemoveItem = async (vendorSlug, itemId) => {
    const targetCart = carts.find((cart) => cart.vendor.slug === vendorSlug);
    const itemName = targetCart?.orderSummary.items.find((item) => item.id === itemId)?.name;
    const result = await confirmRemoveItem(itemName);

    if (!result.isConfirmed) {
      return;
    }

    const isLastVendorItem =
      (targetCart?.orderSummary.items?.filter((item) => item.id !== itemId).length ?? 0) === 0;

    if (isLastVendorItem) {
      clearStoredOrderSummary(vendorSlug);
    }

    setCarts((current) =>
      current
        .map((cart) => {
          if (cart.vendor.slug !== vendorSlug) {
            return cart;
          }

          return {
            ...cart,
            orderSummary: {
              ...cart.orderSummary,
              items: cart.orderSummary.items.filter((item) => item.id !== itemId),
            },
          };
        })
        .filter((cart) => cart.orderSummary.items.length > 0),
    );
  };

  const handlePlaceOrder = async () => {
    const validationError = validateCheckoutForm({
      formState,
      checkoutType: normalizedType,
      carts,
    });

    if (validationError) {
      await showAuthErrorAlert(validationError, "Checkout details required");
      return;
    }

    const result = await confirmPlaceOrder();

    if (!result.isConfirmed || !normalizedType) {
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const placedOrders = await placeCheckoutOrders({
        carts,
        checkoutType: normalizedType,
        formState,
      });

      writePlacedOrderDraft({
        checkoutType: normalizedType,
        carts,
        formState,
        placedOrders,
      });
      clearCheckoutFormDraft(normalizedType);
      clearAllStoredOrderSummaries();
      await showOrderPlacedSuccess();
      navigate("/order-confirmed");
    } catch (error) {
      const successfulOrders = error?.successfulOrders ?? [];

      if (successfulOrders.length > 0) {
        const successfulVendorSlugs = new Set(
          successfulOrders.map((order) => order.vendorSlug),
        );

        successfulVendorSlugs.forEach((vendorSlug) => {
          clearStoredOrderSummary(vendorSlug);
        });

        setCarts((current) =>
          current.filter((cart) => !successfulVendorSlugs.has(cart.vendor.slug)),
        );
      }

      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to place your order right now.",
        "Order placement failed",
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return {
    applySavedAddress,
    carts,
    deliveryAddresses,
    deliverySlots,
    formState,
    handlePlaceOrder,
    handleRemoveItem,
    handleTipChange,
    handleTypeChange,
    hasItems,
    hasLivePricing,
    invoiceAddresses,
    isAutofilling,
    isDeliveryAddressEditing,
    isInvoiceAddressEditing,
    isLoadingSlots,
    isLoadingPricing,
    pricingError,
    isSubmittingOrder,
    normalizedType,
    setIsDeliveryAddressEditing,
    setIsInvoiceAddressEditing,
    updateCartField,
    updateField,
  };
}
