import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../lib/api/graphqlClient";

const FETCH_HOME_DATA_QUERY = `
  query FetchHomeData {
    featured: vendors(isFeatured: true) {
      edges {
        node {
          id
          name
          rating
          discountPercentage
          logoUrl
          coverPhotoUrl
          deliverySettings {
            minDeliveryTime
            maxDeliveryTime
            baseDeliveryFee
          }
        }
      }
    }
    popularVendors: vendors(isPopular: true) {
      edges {
        node {
          id
          name
          rating
          discountPercentage
          logoUrl
          coverPhotoUrl
          deliverySettings {
            minDeliveryTime
            maxDeliveryTime
            baseDeliveryFee
          }
        }
      }
    }
    popularProducts: products(isPopular: true) {
      edges {
        node {
          id
          name
          averageRating
          ordersCount
          badge
          deliveryFee
          deliveryTime
          coverImage {
            fileUrl
          }
          vendor {
            id
            name
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

const mapVendorNode = (node, index) => {
  const name = node.name || "Vendor";
  const slug = slugify(name);
  const minTime = node.deliverySettings?.minDeliveryTime ?? 15;
  const maxTime = node.deliverySettings?.maxDeliveryTime ?? 45;
  const fee = node.deliverySettings?.baseDeliveryFee ? parseFloat(node.deliverySettings.baseDeliveryFee) : 0;

  const fallbackImages = ["/home/v.webp", "/home/hero1.webp", "/home/hero2.webp", "/home/hero3.webp"];
  const image = node.logoUrl || fallbackImages[index % fallbackImages.length];

  return {
    id: node.id || `vendor-${index}`,
    slug,
    name,
    image,
    rating: parseFloat(node.rating || 0).toFixed(1),
    deliveryTime: `${minTime}-${maxTime} minutes`,
    deliveryFee: `${fee} NOK Delivery fee`,
    discount: node.discountPercentage > 0 ? `${node.discountPercentage}% Discount` : null,
    categoryTags: ["Packages", "Healthy"],
  };
};

const mapProductNode = (node, index) => {
  const name = node.name || "Product";
  const vendorName = node.vendor?.name || "";
  const vendorSlug = slugify(vendorName);
  const fee = node.deliveryFee ? parseFloat(node.deliveryFee) : 0;

  const fallbackImages = ["/home/hero1.webp", "/home/hero2.webp", "/home/hero3.webp", "/home/v.webp"];
  const image = node.coverImage?.fileUrl || fallbackImages[index % fallbackImages.length];

  return {
    id: node.id || `product-${index}`,
    slug: slugify(name),
    vendorSlug,
    name,
    vendorName,
    image,
    rating: parseFloat(node.averageRating || 0).toFixed(1),
    deliveryTime: node.deliveryTime || "15-45 minutes",
    deliveryFee: `${fee} NOK Delivery fee`,
    discount: node.badge || null,
    categoryTags: ["Packages", "Healthy"],
  };
};

export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await graphqlRequest({ query: FETCH_HOME_DATA_QUERY });
      
      const featured = (response.featured?.edges || []).map((edge, index) =>
        mapVendorNode(edge.node, index)
      );
      
      const popularVendors = (response.popularVendors?.edges || []).map((edge, index) =>
        mapVendorNode(edge.node, index + 10)
      );
      
      const popularProducts = (response.popularProducts?.edges || []).map((edge, index) =>
        mapProductNode(edge.node, index)
      );

      return { featured, popularVendors, popularProducts };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch home data.");
    }
  }
);

const initialState = {
  featuredVendors: [],
  popularVendors: [],
  popularProducts: [],
  isLoading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredVendors = action.payload.featured;
        state.popularVendors = action.payload.popularVendors;
        state.popularProducts = action.payload.popularProducts;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load dynamic data.";
      });
  },
});

export default homeSlice.reducer;
