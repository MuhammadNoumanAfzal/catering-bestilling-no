import { useEffect, useMemo, useState } from "react";
import {
  readAllStoredOrderSummaries,
  subscribeToOrderSummaryUpdates,
} from "../../../features/vendor/utils/orderSummaryStorage";

function getCartState() {
  const carts = readAllStoredOrderSummaries();

  const itemCount = carts.reduce(
    (total, cart) => total + cart.orderSummary.items.length,
    0,
  );

  const personCount = carts.reduce(
    (total, cart) => total + Number(cart.orderSummary.personCount ?? 0),
    0,
  );

  return {
    carts,
    itemCount,
    personCount,
    hasItems: itemCount > 0,
  };
}

export default function useNavbarCartSummary() {
  const [cartState, setCartState] = useState(() => getCartState());

  useEffect(() => {
    setCartState(getCartState());

    return subscribeToOrderSummaryUpdates(() => {
      setCartState(getCartState());
    });
  }, []);

  return useMemo(() => cartState, [cartState]);
}
