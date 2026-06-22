import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchVendorProfileBySlug } from "../api";
import { getFallbackVendorProfileBySlug } from "../services";

export const fetchVendorProfile = createAsyncThunk(
  "vendor/fetchVendorProfile",
  async (vendorSlug, { rejectWithValue }) => {
    try {
      return await fetchVendorProfileBySlug(vendorSlug);
    } catch (error) {
      const fallbackVendor = getFallbackVendorProfileBySlug(vendorSlug);

      if (fallbackVendor) {
        return fallbackVendor;
      }

      return rejectWithValue(error.message || "Failed to fetch vendor profile.");
    }
  },
);

const initialState = {
  currentVendor: null,
  status: "idle",
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    clearVendorState(state) {
      state.currentVendor = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load vendor profile.";
      });
  },
});

export const { clearVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;
