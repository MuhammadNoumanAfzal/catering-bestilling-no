import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentVendor,
  selectVendorError,
  selectVendorStatus,
} from "../selectors/vendorSelectors";
import { fetchVendorProfile } from "../store/vendorSlice";

export function useVendorProfile(vendorSlug) {
  const dispatch = useDispatch();
  const vendor = useSelector(selectCurrentVendor);
  const status = useSelector(selectVendorStatus);
  const error = useSelector(selectVendorError);
  const isLoading = Boolean(vendorSlug) && (status === "idle" || status === "loading");

  useEffect(() => {
    if (!vendorSlug) {
      return;
    }

    dispatch(fetchVendorProfile(vendorSlug));
  }, [dispatch, vendorSlug]);

  return {
    vendor,
    status,
    error,
    isLoading,
  };
}
