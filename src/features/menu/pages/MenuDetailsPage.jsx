import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import MenuAddOnsSection from "../components/MenuAddOnsSection";
import MenuDeliveryForm from "../components/MenuDeliveryForm";
import MenuHeroBanner from "../components/MenuHeroBanner";
import MenuIncludedSection from "../components/MenuIncludedSection";
import MenuOverviewSection from "../components/MenuOverviewSection";
import VendorAvailabilityPopup from "../../vendor/components/VendorAvailabilityPopup";
import VendorOrderSidebar from "../../vendor/components/VendorOrderSidebar";
import {
  getAvailableVendorsForSlot,
  getVendorMenuItemById,
  getVendorProfileBySlug,
  isVendorDeliverySlotAvailable,
} from "../../vendor/data/vendorData";
import {
  readOrderSummary,
  writeOrderSummary,
} from "../../vendor/utils/orderSummaryStorage";
import { confirmRemoveItem, showSuccessToast } from "../../../utils/alerts";

export default function MenuDetailsPage() {
  const { vendorSlug, itemId } = useParams();
  const vendor = getVendorProfileBySlug(vendorSlug);
  const menuItem = getVendorMenuItemById(vendorSlug, itemId);
  const [orderSummary, setOrderSummary] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState("1 order");
  const [selectedRequired, setSelectedRequired] = useState("");
  const [selectedOptional, setSelectedOptional] = useState({});
  const [vendorNote, setVendorNote] = useState("");
  const [isAvailabilityPopupDismissed, setIsAvailabilityPopupDismissed] =
    useState(false);
  const addOnsSliderRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [vendorSlug, itemId]);

  useEffect(() => {
    if (!vendor || !menuItem) {
      return;
    }

    setOrderSummary(readOrderSummary(vendor));
    setSelectedQuantity(menuItem.modal.quantityOptions[0] ?? "1 order");
    setSelectedRequired(menuItem.modal.requiredSelection.options[0] ?? "");
    setSelectedOptional({});
    setVendorNote("");
    setIsAvailabilityPopupDismissed(false);
  }, [menuItem, vendor]);

  useEffect(() => {
    if (!vendor || !orderSummary) {
      return;
    }

    writeOrderSummary(vendor.slug, orderSummary);
  }, [orderSummary, vendor]);

  const addOnItems = useMemo(() => {
    if (!menuItem || !vendor) {
      return [];
    }

    return menuItem.modal.optionalSelections.flatMap((group, groupIndex) =>
      group.options.map((option, optionIndex) => ({
        ...option,
        id: `${group.title}-${option.label}`,
        image:
          optionIndex % 2 === 0
            ? vendor.banner
            : vendor.heroSideImage ?? menuItem.image,
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
            addOnKey: key,
            parentMenuItemId: menuItem.id,
            name: matchedOption.label,
            quantity,
            serves: current.personCount,
            totalServes: current.personCount,
            unitPrice: Number(matchedOption.price) * quantity,
            price: Number(matchedOption.price) * quantity * current.personCount,
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

  const includedMenuItems = useMemo(
    () => [
      { label: "Seasonal salad", image: menuItem.image },
      { label: "Fresh bread", image: vendor.heroSideImage ?? menuItem.image },
      { label: "Main menu selection", image: vendor.banner },
      { label: "Dessert bite", image: menuItem.image },
      { label: "Serving setup", image: vendor.heroSideImage ?? vendor.banner },
    ],
    [menuItem, vendor],
  );

  if (!vendor || !menuItem) {
    return <Navigate to={vendor ? `/vendor/${vendor.slug}` : "/"} replace />;
  }

  if (!orderSummary) {
    return null;
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

  const handleAddToCart = () => {
    const quantityCount = Number.parseInt(selectedQuantity, 10) || 1;
    const totalServes = menuItem.serves * quantityCount;
    const itemName = menuItem.modal?.heading ?? menuItem.title ?? "Item";

    const summaryItem = {
      id: `${menuItem.id}-${Date.now()}`,
      name: itemName,
      quantity: quantityCount,
      serves: menuItem.serves,
      totalServes,
      unitPrice: Number(menuItem.modal.pricePerPerson),
      price: Number(menuItem.modal.pricePerPerson) * totalServes,
      details: [
        `Serves ${menuItem.serves}`,
        selectedQuantity,
        selectedRequired,
        vendorNote ? `Note: ${vendorNote}` : null,
      ].filter(Boolean),
    };

    setOrderSummary((current) => ({
      ...current,
      personCount:
        current.items.filter((item) => !item.isAddOn).length === 0
          ? summaryItem.totalServes
          : current.personCount + summaryItem.totalServes,
      items: [summaryItem, ...current.items],
    }));

    showSuccessToast(`${itemName} added to cart`);
  };

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

  return (
    <section className="px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-[#ddd3c8] bg-[#fffaf6] shadow-[0_14px_40px_rgba(55,34,19,0.08)]">
        <MenuHeroBanner
          vendorSlug={vendor.slug}
          image={menuItem.image}
          title={menuItem.modal.heading}
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
                orderSummary={orderSummary}
                vendorNote={vendorNote}
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
                onVendorNoteChange={setVendorNote}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          <VendorOrderSidebar
            vendor={vendor}
            orderSummary={orderSummary}
            onRemoveItem={async (itemKey) => {
              const itemName = orderSummary.items.find((item) => item.id === itemKey)?.name;
              const result = await confirmRemoveItem(itemName);

              if (!result.isConfirmed) {
                return;
              }

              setOrderSummary((current) => {
                const removedItem = current.items.find((item) => item.id === itemKey);

                return {
                  ...current,
                  personCount: Math.max(
                    1,
                    current.personCount -
                      (removedItem?.isAddOn ? 0 : (removedItem?.totalServes ?? 0)),
                  ),
                  items: current.items.filter((item) => item.id !== itemKey),
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

        <MenuAddOnsSection
          addOnsSliderRef={addOnsSliderRef}
          addOnItems={addOnItems}
          selectedOptional={selectedOptional}
          onScroll={scrollAddOns}
          onUpdateOptionalQuantity={updateOptionalQuantity}
        />
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
