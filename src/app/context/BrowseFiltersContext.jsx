import { createContext, useContext, useMemo, useState } from "react";

const BrowseFiltersContext = createContext(null);

export function BrowseFiltersProvider({ children }) {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [eventName, setEventName] = useState("");
  const [locationValue, setLocationValue] = useState("Bergen");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("");

  const value = useMemo(
    () => ({
      attendeeCount,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      eventName,
      locationValue,
      setAttendeeCount,
      setDeliveryAddress,
      setDeliveryDate,
      setDeliveryTime,
      setEventName,
      setLocationValue,
    }),
    [
      attendeeCount,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      eventName,
      locationValue,
    ],
  );

  return (
    <BrowseFiltersContext.Provider value={value}>
      {children}
    </BrowseFiltersContext.Provider>
  );
}

export function useBrowseFilters() {
  const context = useContext(BrowseFiltersContext);

  if (!context) {
    throw new Error("useBrowseFilters must be used within BrowseFiltersProvider");
  }

  return context;
}
