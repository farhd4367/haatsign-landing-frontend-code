import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching sitemap data
export const fetchSiteMap = createAsyncThunk(
  "siteMap/fetchSiteMap",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/site-maps`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch sitemap");
    }
  }
);

const siteMapSlice = createSlice({
  name: "siteMap",
  initialState: {
    siteMapData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteMap.fulfilled, (state, action) => {
        state.loading = false;
        state.siteMapData = action.payload;
      })
      .addCase(fetchSiteMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default siteMapSlice.reducer;
