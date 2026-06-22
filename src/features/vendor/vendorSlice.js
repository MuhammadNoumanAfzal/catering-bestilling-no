import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";
import { getVendorProfileBySlug, adaptApiVendorToProfile } from "./data/vendorData";

const FETCH_VENDORS_QUERY = `
  query FetchVendors {
    vendors {
      edges {
        node {
          id
          name
          rating
          reviewsCount
          logoUrl
          coverPhotoUrl
          categoryTags
          deliverySettings {
            id
            baseDeliveryFee
            minDeliveryTime
            maxDeliveryTime
            deliveryDays
            deliveryTimeSlots
          }
          businessSettings {
            id
            businessAddress
            businessHours
          }
          serviceAreas {
            id
            name
            postCode
            isActive
          }
          menuCategories {
            id
            name
            description
            vendorProducts {
              id
              name
              description
              priceWithTax
              averageRating
              ordersCount
              badge
              isPopular
              isFeatured
              slug
              categoryTags
              contains
              dietaryTags
              allergens
              minLeadTimeDays
              minLeadTimeHours
              minimumGuests
              pricingType
              isAvailabilityWindowEnabled
              availableFrom
              availableUntil
              coverImage {
                id
                fileUrl
              }
            }
          }
        }
      }
    }
  }
`;

const slugify = (text) => {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const fetchVendorProfile = createAsyncThunk(
  "vendor/fetchVendorProfile",
  async (vendorSlug, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({ query: FETCH_VENDORS_QUERY });
      const allVendors = (response.vendors?.edges || []).map((edge) => edge.node);
      const apiVendorNode = allVendors.find(
        (node) => slugify(node.name) === vendorSlug,
      );

      if (apiVendorNode) {
        return adaptApiVendorToProfile(apiVendorNode);
      }

      // Local fallback
      const localVendor = getVendorProfileBySlug(vendorSlug);
      if (localVendor) {
        return localVendor;
      }
      throw new Error("Vendor not found");
    } catch (error) {
      // Local fallback on API error
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
