import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth";
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
  placeCheckoutOrders,
} from "../api";
import {
  createInitialCheckoutFormState,
  VALID_CHECKOUT_TYPES,
} from "../constants/checkoutForm";
import { validateCheckoutForm } from "../../order/utils/orderFlowValidation";

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

export function useCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutType } = useParams();
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

  useEffect(() => {
    const storedCarts = readAllStoredOrderSummaries();
    const prefilledFormState = location.state?.prefillCheckoutForm;

    setCarts(storedCarts);
    setFormState((current) => ({
      ...current,
      ...createInitialCheckoutFormState(storedCarts[0]),
      ...(prefilledFormState ?? {}),
    }));
  }, [location.state]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let isMounted = true;

    async function autofillCheckoutProfile() {
      setIsAutofilling(true);

      try {
        const profile = await fetchCheckoutAutofillProfile();

        if (!isMounted) {
          return;
        }

        writeSavedSettings(profile.settings);

        if (profile.deliveryAddresses.length > 0) {
          writeSavedAddresses("delivery", profile.deliveryAddresses);
          setDeliveryAddresses(profile.deliveryAddresses);
        }

        if (profile.invoiceAddresses.length > 0) {
          writeSavedAddresses("invoice", profile.invoiceAddresses);
          setInvoiceAddresses(profile.invoiceAddresses);
        }

        setFormState((current) => ({
          ...current,
          ...profile.formState,
        }));
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
  }, [isLoggedIn]);

  useEffect(() => {
    carts.forEach(({ vendor, orderSummary }) => {
      writeOrderSummary(vendor, orderSummary);
    });
  }, [carts]);

  const normalizedType = VALID_CHECKOUT_TYPES.includes(checkoutType)
    ? checkoutType
    : null;
  const hasItems = carts.some((cart) => cart.orderSummary.items.length > 0);

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

        if (!isCancelled) {
          setDeliverySlots(slots);

          // If the currently selected time falls in a fully-booked slot, clear it
          if (formState.time && slots.length > 0) {
            const currentTime = formState.time;
            const matchedSlot = slots.find(
              (slot) => currentTime >= slot.start && currentTime <= slot.end,
            );
            if (matchedSlot?.isFullyBooked) {
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

  const handleTablewareChange = (vendorSlug, tableware) => {
    setCarts((current) =>
      current.map((cart) =>
        cart.vendor.slug === vendorSlug
          ? {
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                tableware,
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
    handleTablewareChange,
    handleTipChange,
    handleTypeChange,
    hasItems,
    invoiceAddresses,
    isAutofilling,
    isDeliveryAddressEditing,
    isInvoiceAddressEditing,
    isLoadingSlots,
    isSubmittingOrder,
    normalizedType,
    setIsDeliveryAddressEditing,
    setIsInvoiceAddressEditing,
    updateCartField,
    updateField,
  };
}
