import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiTruck,
  FiX,
} from "react-icons/fi";

const DAY_LABELS = {
  su: "Sun",
  mo: "Mon",
  tu: "Tue",
  we: "Wed",
  th: "Thu",
  fr: "Fri",
  sa: "Sat",
};

function splitScheduleRows(value) {
  return `${value || ""}`
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildDeliverySchedule(vendor) {
  const slots = Array.isArray(vendor?.availability?.delivery?.slots)
    ? vendor.availability.delivery.slots
    : [];

  const groupedSlots = slots.reduce((accumulator, slot) => {
    const dayCode = `${slot?.day ?? ""}`.trim().toLowerCase();
    const start = `${slot?.start ?? ""}`.trim();
    const end = `${slot?.end ?? ""}`.trim();

    if (!dayCode || !start || !end) {
      return accumulator;
    }

    const existingDay = accumulator.find((entry) => entry.dayCode === dayCode);
    const timeRange = `${start}-${end}`;

    if (existingDay) {
      if (!existingDay.ranges.includes(timeRange)) {
        existingDay.ranges.push(timeRange);
      }
      return accumulator;
    }

    accumulator.push({
      dayCode,
      dayLabel: DAY_LABELS[dayCode] || dayCode,
      ranges: [timeRange],
    });

    return accumulator;
  }, []);

  if (groupedSlots.length > 0) {
    const dayOrder = ["mo", "tu", "we", "th", "fr", "sa", "su"];
    return groupedSlots.sort(
      (left, right) => dayOrder.indexOf(left.dayCode) - dayOrder.indexOf(right.dayCode),
    );
  }

  const deliveryDays = Array.isArray(vendor?.availability?.delivery?.days)
    ? vendor.availability.delivery.days
    : [];

  if (deliveryDays.length > 0) {
    return deliveryDays.map((dayIndex) => {
      const dayCode = ["su", "mo", "tu", "we", "th", "fr", "sa"][dayIndex] || "";
      return {
        dayCode,
        dayLabel: DAY_LABELS[dayCode] || "Day",
        ranges: [],
      };
    });
  }

  return [];
}

function SectionCard({ icon, eyebrow, title, children }) {
  return (
    <section className="rounded-[22px] border border-[#eddccf] bg-white/95 p-4 shadow-[0_10px_24px_rgba(39,24,13,0.05)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#fff3ea] text-[15px] text-[#cf6e38]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b38769]">
            {eyebrow}
          </p>
          <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[#1d1713]">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoPill({ children, tone = "neutral" }) {
  const toneClass =
    tone === "success"
      ? "border-[#d7ebda] bg-[#eef8ef] text-[#365742]"
      : tone === "brand"
        ? "border-[#f2dccd] bg-[#fff4ec] text-[#755240]"
        : "border-[#ece1d8] bg-[#f7f1eb] text-[#6d6056]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function DeliveryScheduleSection({ schedule }) {
  if (!schedule.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-[#e4d6ca] bg-[#fffaf6] px-4 py-4 text-[14px] font-medium text-[#7a6c60]">
        Delivery schedule not set.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {schedule.map((entry) => (
        <div
          key={`${entry.dayCode}-${entry.dayLabel}`}
          className="flex flex-col gap-2 rounded-[18px] border border-[#f0ddd1] bg-[#fff8f3] px-4 py-3 sm:flex-row sm:items-center"
        >
          <div className="sm:w-[68px] sm:shrink-0">
            <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b06b42]">
              {entry.dayLabel}
            </span>
          </div>

          {entry.ranges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {entry.ranges.map((range) => (
                <span
                  key={`${entry.dayCode}-${range}`}
                  className="inline-flex rounded-full border border-[#ead2c3] bg-white px-3 py-1.5 text-[13px] font-medium text-[#4f4036]"
                >
                  {range}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[13px] font-medium text-[#8b7b70]">
              Schedule enabled for this day
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function OpeningHoursSection({ rows }) {
  if (!rows.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-[#e4d6ca] bg-[#fffaf6] px-4 py-4 text-[14px] font-medium text-[#7a6c60]">
        Takeout hours are not available.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row}
          className="rounded-[16px] border border-[#eee2d7] bg-[#fffdfb] px-4 py-2.5 text-[13px] font-medium text-[#594d45]"
        >
          {row}
        </div>
      ))}
    </div>
  );
}

export default function VendorLocationModal({ vendor, onClose }) {
  if (!vendor) {
    return null;
  }

  const displayAddress = vendor.pickupAddress || vendor.addressLine;
  const displayCity = vendor.city;
  const pickupInstructions = `${vendor.pickupInstructions || ""}`.trim();
  const deliveryFeeText = `${vendor.deliveryFee || ""}`.trim();
  const freeDeliveryText = vendor.freeDeliveryOver
    ? `Free delivery over ${vendor.freeDeliveryOver}`
    : "";
  const takeoutRows = splitScheduleRows(vendor.availability?.takeout?.label);
  const deliverySchedule = buildDeliverySchedule(vendor);
  const displayAreas =
    Array.isArray(vendor.serviceAreas) && vendor.serviceAreas.length > 0
      ? vendor.serviceAreas
      : Array.isArray(vendor.servicePostalCodes) && vendor.servicePostalCodes.length > 0
        ? vendor.servicePostalCodes.map((postalCode) => ({
            id: postalCode,
            name: "",
            postCode: postalCode,
          }))
        : [];

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(25,18,12,0.48)] backdrop-blur-[5px]">
      <div className="flex min-h-full items-center justify-center px-3 py-4 sm:px-4 sm:py-5">
        <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[#ead8ca] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] shadow-[0_24px_70px_rgba(25,18,12,0.22)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(207,110,56,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(244,178,103,0.10),transparent_36%)]" />

          <div className="relative flex items-start justify-between gap-4 border-b border-[#f0e3d8] px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#cf6e38]">
                Restaurant Details & Availability
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.05em] text-[#18120f] sm:text-[34px]">
                {vendor.name}
              </h2>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#6f675f] sm:text-[14px]">
                Delivery timings, pickup details, and service coverage for this restaurant.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#eadfd2] bg-white text-[#1f1f1f] shadow-[0_10px_20px_rgba(32,22,12,0.08)] transition hover:border-[#cf6e38] hover:bg-[#fff4ec] hover:text-[#cf6e38]"
              aria-label="Close location popup"
            >
              <FiX className="text-[19px]" />
            </button>
          </div>

          <div className="relative overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="space-y-4">
                <SectionCard
                  icon={<FiMapPin />}
                  title="Pickup & Address"
                  eyebrow="Location"
                >
                  <div className="space-y-3">
                    <div className="rounded-[18px] bg-[#fff7f1] px-4 py-3.5">
                      <p className="text-[16px] font-semibold leading-7 text-[#1f1a16] break-words">
                        {displayAddress || "-"}
                      </p>
                      {displayCity ? (
                        <p className="mt-1 text-[13px] font-medium text-[#786b60]">
                          {displayCity}
                        </p>
                      ) : null}
                    </div>

                    {pickupInstructions ? (
                      <div className="rounded-[18px] border border-[#f1e2d6] bg-white px-4 py-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b08567]">
                          Pickup Instructions
                        </p>
                        <p className="mt-2 whitespace-pre-line text-[13px] leading-7 text-[#64584e]">
                          {pickupInstructions}
                        </p>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {vendor.leadTime ? (
                        <InfoPill tone="neutral">
                          Typical lead time:
                          <span className="ml-1 font-semibold text-[#1f1a16]">
                            {vendor.leadTime}
                          </span>
                        </InfoPill>
                      ) : null}
                      {displayCity ? (
                        <InfoPill tone="brand">
                          <FiNavigation className="mr-1.5" />
                          {displayCity}
                        </InfoPill>
                      ) : null}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<FiCalendar />}
                  title="Opening Hours"
                  eyebrow="Takeout"
                >
                  <OpeningHoursSection rows={takeoutRows} />
                </SectionCard>
              </div>

              <div className="space-y-4">
                <SectionCard
                  icon={<FiTruck />}
                  title="Delivery & Fees"
                  eyebrow="Service Window"
                >
                  <div className="space-y-3.5">
                    <DeliveryScheduleSection schedule={deliverySchedule} />

                    <div className="flex flex-wrap gap-2">
                      {deliveryFeeText ? (
                        <InfoPill tone="brand">
                          Fee:
                          <span className="ml-1 font-semibold text-[#1f1a16]">
                            {deliveryFeeText}
                          </span>
                        </InfoPill>
                      ) : null}
                      {freeDeliveryText ? (
                        <InfoPill tone="success">{freeDeliveryText}</InfoPill>
                      ) : null}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<FiClock />}
                  title="Service Areas"
                  eyebrow="Coverage"
                >
                  {displayAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displayAreas.map((area) => (
                        <span
                          key={area.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#eadcd0] bg-[#fff7f1] px-3.5 py-2 text-[12px] font-medium text-[#584d45]"
                        >
                          {area.name ? (
                            <>
                              <span className="font-semibold text-[#2d241f]">
                                {area.name}
                              </span>
                              <span className="text-[#b38f76]">&bull;</span>
                              <span>{area.postCode}</span>
                            </>
                          ) : (
                            <span>{area.postCode}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-[#e4d6ca] bg-[#fffaf6] px-4 py-4 text-[14px] font-medium text-[#7a6c60]">
                      No service areas have been added yet.
                    </div>
                  )}
                </SectionCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
