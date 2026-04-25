import { createContext, useContext, useMemo, useState } from "react";

const BrowseFiltersContext = createContext(null);

export function BrowseFiltersProvider({ children }) {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [eventName, setEventName] = useState("");

  const value = useMemo(
    () => ({
      attendeeCount,
      eventName,
      setAttendeeCount,
      setEventName,
    }),
    [attendeeCount, eventName],
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
