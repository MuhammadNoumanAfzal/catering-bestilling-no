import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVendorProfileFromApi } from "./api/vendorApi";
import { getVendorProfileBySlug } from "./data/vendorData";

export const fetchVendorProfile = createAsyncThunk(
  "vendor/fetchVendorProfile",
  async (vendorSlug, { rejectWithValue }) => {
    try {
      return await getVendorProfileFromApi(vendorSlug);
    } catch (error) {
      // Local fallback on API or profile not found error
      const localVendor = getVendorProfileBySlug(vendorSlug);
      if (localVendor) {
        return localVendor;
      }
      return rejectWithValue(error.message || "Failed to fetch vendor profile.");
    }
  }
);

const initialState = {
  currentVendor: null,
  isLoading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    clearVendorState: (state) => {
      state.currentVendor = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load vendor profile.";
      });
  },
});

export const { clearVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;
