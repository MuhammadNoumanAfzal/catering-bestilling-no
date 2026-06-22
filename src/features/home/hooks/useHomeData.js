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

export function useHomeData() {
  const dispatch = useDispatch();
  const featuredVendors = useSelector(selectFeaturedVendors);
  const popularVendors = useSelector(selectPopularVendors);
  const popularProducts = useSelector(selectPopularProducts);
  const status = useSelector(selectHomeStatus);
  const error = useSelector(selectHomeError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHomeData());
    }
  }, [dispatch, status]);

  return {
    featuredVendors,
    popularVendors,
    popularProducts,
    status,
    error,
  };
}
