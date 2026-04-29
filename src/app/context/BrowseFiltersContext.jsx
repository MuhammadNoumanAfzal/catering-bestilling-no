import { createContext, useContext, useMemo, useState } from "react";
import { createDefaultOtherFilters } from "../../components/shared/browseFilters/browseFilterConfig";

const BrowseFiltersContext = createContext(null);

export function BrowseFiltersProvider({ children }) {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [eventName, setEventName] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [selectedSort, setSelectedSort] = useState("Sort by");
  const [selectedRating, setSelectedRating] = useState("Ratings");
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState("Pricing");
  const [otherFilters, setOtherFilters] = useState(createDefaultOtherFilters);

  const clearBrowseFilters = () => {
    setSelectedSort("Sort by");
    setSelectedRating("Ratings");
    setSelectedDietary([]);
    setSelectedOffers([]);
    setSelectedPricing("Pricing");
    setOtherFilters(createDefaultOtherFilters());
  };

  const value = useMemo(
    () => ({
      attendeeCount,
      clearBrowseFilters,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      eventName,
      locationValue,
      otherFilters,
      searchQuery,
      selectedDietary,
      selectedOffers,
      selectedPricing,
      selectedRating,
      selectedSort,
      setAttendeeCount,
      setDeliveryAddress,
      setDeliveryDate,
      setDeliveryTime,
      setEventName,
      setLocationValue,
      setOtherFilters,
      setSelectedDietary,
      setSelectedOffers,
      setSelectedPricing,
      setSelectedRating,
      setSelectedSort,
      setSearchQuery,
    }),
    [
      attendeeCount,
      clearBrowseFilters,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      eventName,
      locationValue,
      otherFilters,
      searchQuery,
      selectedDietary,
      selectedOffers,
      selectedPricing,
      selectedRating,
      selectedSort,
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
