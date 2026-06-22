import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMenuDetails } from "../api";

export const fetchProductDetails = createAsyncThunk(
  "menu/fetchProductDetails",
  async (payload, { rejectWithValue }) => {
    try {
      return await fetchMenuDetails(payload);
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch product details.",
      );
    }
  },
);

const initialState = {
  currentProduct: null,
  associatedVendor: null,
  status: "idle",
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenuState(state) {
      state.currentProduct = null;
      state.associatedVendor = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload.product;
        state.associatedVendor = action.payload.vendor;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load product details.";
      });
  },
});

export const { clearMenuState } = menuSlice.actions;
export default menuSlice.reducer;
