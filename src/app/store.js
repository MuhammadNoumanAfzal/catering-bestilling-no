import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import homeReducer from "../features/home/homeSlice";
import dashboardReducer from "../features/vendorDashboard/dashboardSlice";
import ordersReducer from "../features/vendorDashboard/ordersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    dashboard: dashboardReducer,
    orders: ordersReducer,
  },
});

