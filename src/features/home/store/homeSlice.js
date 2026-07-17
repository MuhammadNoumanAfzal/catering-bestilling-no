import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHomeContent } from "../api";

export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (filters = {}, { rejectWithValue, signal }) => {
    try {
      return await fetchHomeContent(filters, signal);
    } catch (error) {
      if (error?.name === "AbortError") {
        throw error;
      }

      return rejectWithValue(error.message || "Failed to fetch home data.");
    }
  },
);

const initialState = {
  allVendors: [],
  searchedVendors: [],
  featuredVendors: [],
  popularVendors: [],
  popularProducts: [],
  status: "idle",
  error: null,
  hasLoadedOnce: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hasLoadedOnce = true;
        state.allVendors = action.payload.allVendors;
        state.searchedVendors = action.payload.searchedVendors;
        state.featuredVendors = action.payload.featuredVendors;
        state.popularVendors = action.payload.popularVendors;
        state.popularProducts = action.payload.popularProducts;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.status = "failed";
        state.error = action.payload || "Failed to load home data.";
      });
  },
});

export default homeSlice.reducer;
