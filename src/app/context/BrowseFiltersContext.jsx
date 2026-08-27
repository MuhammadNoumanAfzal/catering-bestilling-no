import { createContext, useContext, useMemo, useState } from "react";
import {
  createDefaultOtherFilters,
  FILTER_DEFAULTS,
} from "../../components/shared/browseFilters/browseFilterConfig";

const noop = () => {};

const defaultBrowseFiltersContextValue = {
  attendeeCount: 0,
  clearBrowseFilters: noop,
  deliveryAddress: "",
  deliveryDate: null,
  deliveryTime: "",
  eventName: "",
  locationValue: "",
  otherFilters: createDefaultOtherFilters(),
  searchQuery: "",
  selectedDietary: [],
  selectedOffers: [],
  selectedPricing: FILTER_DEFAULTS.pricing,
  selectedRating: FILTER_DEFAULTS.rating,
  selectedSort: FILTER_DEFAULTS.sort,
  setAttendeeCount: noop,
  setDeliveryAddress: noop,
  setDeliveryDate: noop,
  setDeliveryTime: noop,
  setEventName: noop,
  setLocationValue: noop,
  setOtherFilters: noop,
  setSelectedDietary: noop,
  setSelectedOffers: noop,
  setSelectedPricing: noop,
  setSelectedRating: noop,
  setSelectedSort: noop,
  setSearchQuery: noop,
};

const BrowseFiltersContext = createContext(defaultBrowseFiltersContextValue);

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
  return useContext(BrowseFiltersContext);
}
