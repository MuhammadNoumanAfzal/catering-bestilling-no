import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssociatedVendor,
  selectCurrentProduct,
  selectMenuError,
  selectMenuStatus,
} from "../selectors/menuSelectors";
import { fetchProductDetails } from "../store/menuSlice";

export function useMenuDetails({ itemId, vendorSlug }) {
  const dispatch = useDispatch();
  const menuItem = useSelector(selectCurrentProduct);
  const vendor = useSelector(selectAssociatedVendor);
  const status = useSelector(selectMenuStatus);
  const error = useSelector(selectMenuError);
  const isLoading =
    Boolean(itemId && vendorSlug) &&
    (status === "idle" || status === "loading");

  useEffect(() => {
    if (!itemId || !vendorSlug) {
      return;
    }

    dispatch(fetchProductDetails({ itemId, vendorSlug }));
  }, [dispatch, itemId, vendorSlug]);

  return {
    menuItem,
    vendor,
    status,
    error,
    isLoading,
  };
}
