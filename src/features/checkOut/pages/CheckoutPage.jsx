import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutSummaryPanel from "../components/CheckoutSummaryPanel";
import {
  clearAllStoredOrderSummaries,
  readAllStoredOrderSummaries,
  writeOrderSummary,
} from "../../vendor/utils/orderSummaryStorage";

const VALID_TYPES = ["corporate", "private"];

const MODE_LABELS = {
  corporate: "Corporate",
  private: "Private",
};

const PLACEHOLDERS = {
  companyName: "ABC Company",
  organizationNumber: "123 456 789",
  invoiceReference: "Reference",
  firstName: "First name",
  lastName: "Last name",
  email: "name@example.com",
  phone: "XX-XX-XXX",
  address: "xxx-xxx-xxx",
  addressLine2: "Suite / Floor",
  apartment: "Apartment / Floor",
  city: "Bergen",
  postalCode: "1235",
  eventName: "Event name",
  occasion: "Occasion",
  additionalInfo: "Add notes...",
};

function createInitialFormState(primaryCart) {
  const orderSummary = primaryCart?.orderSummary;

  return {
    companyName: "",
    organizationNumber: "",
    invoiceReference: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    deliveryAddress: orderSummary?.deliveryAddress ?? "",
    deliveryAddressLine2: "",
    deliveryCity: "",
    deliveryPostalCode: "",
    invoiceAddress: orderSummary?.invoiceAddress ?? "",
    invoiceAddressLine2: "",
    invoiceCity: "",
    invoicePostalCode: "",
    eventName: "",
    occasion: "",
    date: orderSummary?.deliveryDate ?? "2026-03-25",
    time: orderSummary?.deliveryTime ?? "14:30",
    personCount: orderSummary?.personCount ?? 20,
    additionalInfo: "",
  };
}

function Field({
  label,
  className = "",
  inputClassName = "",
  placeholder = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="type-h5 mb-3 block text-[#2d2d2d]">{label}</span>
      <input
        {...props}
        placeholder={placeholder}
        className={`type-para h-8 w-full rounded-[2px] border border-[#d9d1c7] bg-white px-2 text-[#2d2d2d] outline-none placeholder:text-[#a49b92] ${inputClassName}`}
      />
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-[6px] bg-white p-3 shadow-[0_1px_4px_rgba(26,18,10,0.08)]">
      <p className="type-h3 text-[#2d2d2d]">{title}</p>
      <div className="mt-3 ">{children}</div>
    </section>
  );
}

function AddressFields({ mode, prefix, formState, updateField }) {
  const lineTwoLabel =
    mode === "corporate" ? "Suite/Floor(optional)" : "Apartment/Floor (Optional)";
  const firstRowLabel = mode === "corporate" ? "City" : "Postal Code";
  const secondRowLabel = mode === "corporate" ? "Postal Code" : "City";
  const firstRowKey = mode === "corporate" ? `${prefix}City` : `${prefix}PostalCode`;
  const secondRowKey =
    mode === "corporate" ? `${prefix}PostalCode` : `${prefix}City`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field
        label="Address"
        value={formState[`${prefix}Address`]}
        onChange={(event) => updateField(`${prefix}Address`, event.target.value)}
        placeholder={PLACEHOLDERS.address}
        className="sm:col-span-2"
      />
      <Field
        label={lineTwoLabel}
        value={formState[`${prefix}AddressLine2`]}
        onChange={(event) =>
          updateField(`${prefix}AddressLine2`, event.target.value)
        }
        placeholder={
          mode === "corporate" ? PLACEHOLDERS.addressLine2 : PLACEHOLDERS.apartment
        }
      />
      <Field
        label={firstRowLabel}
        value={formState[firstRowKey]}
        onChange={(event) => updateField(firstRowKey, event.target.value)}
        placeholder={
          mode === "corporate" ? PLACEHOLDERS.city : PLACEHOLDERS.postalCode
        }
      />
      <Field
        label={secondRowLabel}
        value={formState[secondRowKey]}
        onChange={(event) => updateField(secondRowKey, event.target.value)}
        placeholder={
          mode === "corporate" ? PLACEHOLDERS.postalCode : PLACEHOLDERS.city
        }
      />
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutType } = useParams();
  const [carts, setCarts] = useState([]);
  const [formState, setFormState] = useState(() => createInitialFormState());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const storedCarts = readAllStoredOrderSummaries();
    setCarts(storedCarts);
    setFormState(createInitialFormState(storedCarts[0]));
  }, []);

  useEffect(() => {
    carts.forEach(({ vendor, orderSummary }) => {
      writeOrderSummary(vendor.slug, orderSummary);
    });
  }, [carts]);

  const normalizedType = VALID_TYPES.includes(checkoutType)
    ? checkoutType
    : null;
  const hasItems = carts.some((cart) => cart.orderSummary.items.length > 0);

  const totalPersonCount = useMemo(
    () =>
      carts.reduce(
        (total, cart) => total + Number(cart.orderSummary.personCount ?? 0),
        0,
      ) || 20,
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

  if (!normalizedType) {
    return <Navigate to="/checkout/corporate" replace />;
  }

  const updateField = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
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

  const handleTipChange = (vendorSlug, tipRate) => {
    setCarts((current) =>
      current.map((cart) =>
        cart.vendor.slug === vendorSlug
          ? {
              ...cart,
              orderSummary: {
                ...cart.orderSummary,
                tipRate,
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

  const handleRemoveItem = (vendorSlug, itemId) => {
    setCarts((current) =>
      current
        .map((cart) => {
          if (cart.vendor.slug !== vendorSlug) {
            return cart;
          }

          const removedItem = cart.orderSummary.items.find(
            (item) => item.id === itemId,
          );

          return {
            ...cart,
            orderSummary: {
              ...cart.orderSummary,
              items: cart.orderSummary.items.filter((item) => item.id !== itemId),
              personCount: Math.max(
                1,
                cart.orderSummary.personCount -
                  (removedItem?.isAddOn
                    ? 0
                    : Number(removedItem?.totalServes ?? removedItem?.serves ?? 0)),
              ),
            },
          };
        })
        .filter((cart) => cart.orderSummary.items.length > 0),
    );
  };

  const handlePlaceOrder = () => {
    clearAllStoredOrderSummaries();
    navigate("/order-confirmed");
  };

  const eventLabel =
    normalizedType === "corporate" ? "Event Name" : "Occasion";
  const eventKey = normalizedType === "corporate" ? "eventName" : "occasion";
  const eventPlaceholder =
    normalizedType === "corporate"
      ? PLACEHOLDERS.eventName
      : PLACEHOLDERS.occasion;

  return (
    <div>
      <CheckoutHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden border border-[#d8d2ca]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0  p-3 sm:p-4">
              <section className="rounded-[10px] border border-[#e6dfd7] bg-white p-3 shadow-[0_2px_10px_rgba(26,18,10,0.08)]">
                <div className="flex items-center gap-2 text-[#222222]">
                  <FiUser className="type-h3 text-[#d46331]" />
                  <p className="type-h3 font-semibold leading-none">
                    Customer type
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 type-h5">
                  {VALID_TYPES.map((type) => {
                    const isActive = normalizedType === type;
                    const Icon = type === "corporate" ? FiBriefcase : FiUser;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeChange(type)}
                        className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[4px] border text-[14px] font-medium transition ${
                          isActive
                            ? "border-[#f08a61] bg-[#fff3ee] text-[#d46331]"
                            : "border-[#c9c4bd] bg-white text-[#6b655f]"
                        }`}
                      >
                        <Icon className="type-h3 " />
                        <span>{MODE_LABELS[type]}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="mt-3 space-y-3">
                <Section title="Contact Info">
                  {normalizedType === "corporate" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="CompanyName"
                        value={formState.companyName}
                        onChange={(event) =>
                          updateField("companyName", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.companyName}
                        className="sm:col-span-2"
                      />
                      <Field
                        label="Organization number"
                        value={formState.organizationNumber}
                        onChange={(event) =>
                          updateField("organizationNumber", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.organizationNumber}
                      />
                      <Field
                        label="Invoice Reference"
                        value={formState.invoiceReference}
                        onChange={(event) =>
                          updateField("invoiceReference", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.invoiceReference}
                      />
                      <Field
                        label="Email"
                        type="email"
                        value={formState.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.email}
                      />
                      <Field
                        label="Phone"
                        value={formState.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.phone}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="First Name"
                        value={formState.firstName}
                        onChange={(event) =>
                          updateField("firstName", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.firstName}
                      />
                      <Field
                        label="Last Name"
                        value={formState.lastName}
                        onChange={(event) =>
                          updateField("lastName", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.lastName}
                      />
                      <Field
                        label="Invoice Reference"
                        value={formState.invoiceReference}
                        onChange={(event) =>
                          updateField("invoiceReference", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.invoiceReference}
                      />
                      <Field
                        label="Phone"
                        value={formState.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.phone}
                      />
                      <Field
                        label="Email"
                        type="email"
                        value={formState.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder={PLACEHOLDERS.email}
                        className="sm:col-span-2"
                      />
                    </div>
                  )}
                </Section>

                <Section title="Delivery Address">
                  <AddressFields
                    mode={normalizedType}
                    prefix="delivery"
                    formState={formState}
                    updateField={updateField}
                  />
                </Section>

                <Section title="Invoice Address">
                  <AddressFields
                    mode={normalizedType}
                    prefix="invoice"
                    formState={formState}
                    updateField={updateField}
                  />
                </Section>

                <Section title="Event Details">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label={eventLabel}
                      value={formState[eventKey]}
                      onChange={(event) =>
                        updateField(eventKey, event.target.value)
                      }
                      placeholder={eventPlaceholder}
                      className="sm:col-span-2"
                    />
                    <Field
                      label="Date"
                      type="date"
                      value={formState.date}
                      onChange={(event) => {
                        updateField("date", event.target.value);
                        updateCartField("deliveryDate", event.target.value);
                      }}
                      inputClassName="cursor-pointer"
                    />
                    <Field
                      label="Time"
                      type="time"
                      value={formState.time}
                      onChange={(event) => {
                        updateField("time", event.target.value);
                        updateCartField("deliveryTime", event.target.value);
                      }}
                      inputClassName="cursor-pointer"
                    />
                  </div>

                  <div className="mt-3">
                    <span className="type-subpara mb-1 block text-[#2d2d2d]">
                      Person Count
                    </span>
                    <div className="inline-flex items-center border border-[#d9d1c7] bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          {
                            const nextPersonCount = Math.max(
                              1,
                              Number(formState.personCount) - 1,
                            );
                            updateField("personCount", nextPersonCount);
                            updateCartField("personCount", nextPersonCount);
                          }
                        }
                        className="type-subpara h-8 w-8 cursor-pointer border-r border-[#d9d1c7] text-[#2d2d2d]"
                      >
                        -
                      </button>
                      <span className="type-subpara inline-flex min-w-[56px] justify-center px-3 text-[#2d2d2d]">
                        {formState.personCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          {
                            const nextPersonCount = Number(formState.personCount) + 1;
                            updateField("personCount", nextPersonCount);
                            updateCartField("personCount", nextPersonCount);
                          }
                        }
                        className="type-subpara h-8 w-8 cursor-pointer border-l border-[#d9d1c7] text-[#2d2d2d]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </Section>

                <Section title="Additional Info">
                  <label className="block">
                    <span className="type-para mb-1 block text-[#2d2d2d]">
                      Order notes / Allergens &amp; Dietary Requirements
                    </span>
                    <textarea
                      value={formState.additionalInfo}
                      onChange={(event) =>
                        updateField("additionalInfo", event.target.value)
                      }
                      placeholder={PLACEHOLDERS.additionalInfo}
                      className="type-subpara min-h-[76px] w-full rounded-[2px] border border-[#d9d1c7] bg-white px-2 py-2 text-[#2d2d2d] outline-none placeholder:text-[#a49b92]"
                    />
                  </label>
                </Section>
              </div>
            </section>

            <div className="flex min-h-full flex-col justify-between">
              {hasItems ? (
                <CheckoutSummaryPanel
                  carts={carts}
                  onTipChange={handleTipChange}
                  onRemoveItem={handleRemoveItem}
                  onTablewareChange={handleTablewareChange}
                  onPlaceOrder={handlePlaceOrder}
                />
              ) : (
                <aside className="flex min-h-[360px] items-center justify-center border-l border-[#d8d2ca] bg-white p-6 text-center">
                  <div>
                    <p className="type-h4 text-[#2d2d2d]">Your cart is empty</p>
                    <p className="type-subpara mt-2 text-[#6f675f]">
                      Add menu items before continuing to checkout.
                    </p>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
