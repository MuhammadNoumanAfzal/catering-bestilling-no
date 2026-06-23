import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "../store/homeSlice";
import {
  selectFeaturedVendors,
  selectHomeError,
  selectHomeStatus,
  selectPopularProducts,
  selectPopularVendors,
} from "../selectors/homeSelectors";

export function useHomeData(filters = {}) {
  const dispatch = useDispatch();
  const featuredVendors = useSelector(selectFeaturedVendors);
  const popularVendors = useSelector(selectPopularVendors);
  const popularProducts = useSelector(selectPopularProducts);
  const status = useSelector(selectHomeStatus);
  const error = useSelector(selectHomeError);
  const serializedFilters = JSON.stringify(filters);

  useEffect(() => {
    dispatch(fetchHomeData(filters));
  }, [dispatch, serializedFilters]);

  return {
    featuredVendors,
    popularVendors,
    popularProducts,
    status,
    error,
  };
}
