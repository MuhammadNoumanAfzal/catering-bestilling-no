import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "../store/homeSlice";
import {
  selectFeaturedVendors,
  selectHomeError,
  selectHomeHasLoadedOnce,
  selectHomeStatus,
  selectPopularProducts,
  selectPopularVendors,
  selectSearchedVendors,
} from "../selectors/homeSelectors";

export function useHomeData(filters = {}) {
  const dispatch = useDispatch();
  const searchedVendors = useSelector(selectSearchedVendors);
  const featuredVendors = useSelector(selectFeaturedVendors);
  const popularVendors = useSelector(selectPopularVendors);
  const popularProducts = useSelector(selectPopularProducts);
  const status = useSelector(selectHomeStatus);
  const error = useSelector(selectHomeError);
  const hasLoadedOnce = useSelector(selectHomeHasLoadedOnce);
  const serializedFilters = JSON.stringify(filters);

  useEffect(() => {
    const request = dispatch(fetchHomeData(filters));

    return () => {
      request.abort();
    };
  }, [dispatch, serializedFilters]);

  return {
    searchedVendors,
    featuredVendors,
    popularVendors,
    popularProducts,
    status,
    error,
    hasLoadedOnce,
  };
}
