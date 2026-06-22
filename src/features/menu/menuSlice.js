import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";
import {
  adaptApiProductToMenuItem,
  adaptApiVendorToProfile,
  getFallbackVendorMenuItemById,
  getFallbackVendorProfileBySlug,
} from "../vendor";

const FETCH_PRODUCT_QUERY = `
  query FetchProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      priceWithTax
      averageRating
      minimumGuests
      isAvailabilityWindowEnabled
      availableFrom
      availableUntil
      dietaryTags
      allergens
      coverImage {
        id
        fileUrl
      }
      menuItems {
        id
        title
        description
        imageUrl
        allergens
      }
      vendor {
        id
        name
        logoUrl
        coverPhotoUrl
        rating
        reviewsCount
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
      }
    }
  }
`;

const FETCH_ADDONS_QUERY = `
  query FetchAddOns {
    products(productType: "add-on") {
      edges {
        node {
          id
          name
          priceWithTax
          coverImage {
            fileUrl
          }
        }
      }
    }
  }
`;

export const fetchProductDetails = createAsyncThunk(
  "menu/fetchProductDetails",
  async ({ itemId, vendorSlug }, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({
        query: FETCH_PRODUCT_QUERY,
        variables: { id: itemId }
      });

      let apiAddOns = [];
      try {
        const addOnsResponse = await graphqlRequest({
          query: FETCH_ADDONS_QUERY
        });
        apiAddOns = (addOnsResponse.products?.edges || []).map((edge) => edge.node);
      } catch (err) {
        console.warn("Failed to fetch add-ons", err);
      }

      if (response.product) {
        const product = adaptApiProductToMenuItem(response.product);
        const vendor = adaptApiVendorToProfile(response.product.vendor);

        if (apiAddOns.length > 0) {
          product.modal.optionalSelections = [
            {
              title: "Select Add-ons",
              options: apiAddOns.map((item) => ({
                label: item.name,
                price: parseFloat(item.priceWithTax || 0),
                image: item.coverImage?.fileUrl || "",
              })),
            }
          ];
        }

        return { product, vendor };
      }

      // Local fallback
      const localVendor = getFallbackVendorProfileBySlug(vendorSlug);
      const localMenuItem = getFallbackVendorMenuItemById(vendorSlug, itemId);
      if (localVendor && localMenuItem) {
        return { product: localMenuItem, vendor: localVendor };
      }
      throw new Error("Product not found");
    } catch (error) {
      // Local fallback on API error
      const localVendor = getFallbackVendorProfileBySlug(vendorSlug);
      const localMenuItem = getFallbackVendorMenuItemById(vendorSlug, itemId);
      if (localVendor && localMenuItem) {
        return { product: localMenuItem, vendor: localVendor };
      }
      return rejectWithValue(error.message || "Failed to fetch product details.");
    }
  }
);

const initialState = {
  currentProduct: null,
  associatedVendor: null,
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenuState: (state) => {
      state.currentProduct = null;
      state.associatedVendor = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
        state.associatedVendor = action.payload.vendor;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load product details.";
      });
  },
});

export const { clearMenuState } = menuSlice.actions;
export default menuSlice.reducer;
