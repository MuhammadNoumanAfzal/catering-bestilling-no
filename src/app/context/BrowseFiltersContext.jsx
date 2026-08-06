import { createContext, useContext, useMemo, useState } from "react";
import {
  createDefaultOtherFilters,
  FILTER_DEFAULTS,
} from "../../components/shared/browseFilters/browseFilterConfig";

const BrowseFiltersContext = createContext(null);

export function BrowseFiltersProvider({ children }) {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [eventName, setEventName] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [selectedSort, setSelectedSort] = useState(FILTER_DEFAULTS.sort);
  const [selectedRating, setSelectedRating] = useState(FILTER_DEFAULTS.rating);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(FILTER_DEFAULTS.pricing);
  const [otherFilters, setOtherFilters] = useState(createDefaultOtherFilters);

  const clearBrowseFilters = () => {
    setSelectedSort(FILTER_DEFAULTS.sort);
    setSelectedRating(FILTER_DEFAULTS.rating);
    setSelectedDietary([]);
    setSelectedOffers([]);
    setSelectedPricing(FILTER_DEFAULTS.pricing);
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
