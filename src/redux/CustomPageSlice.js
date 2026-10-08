// src/views/store/CustomPageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

export const fetchCustomPage = createAsyncThunk(
  "customPage/fetchCustomPage",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/custom-page-details`,
        { slug: `/${slug}` }, 
        { headers: getDefaultHeaders() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch custom page");
    }
  }
);

const customPageSlice = createSlice({
  name: "customPage",
  initialState: {
    pageData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPageData: (state) => {
      state.pageData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomPage.fulfilled, (state, action) => {
        state.loading = false;
        state.pageData = action.payload;
      })
      .addCase(fetchCustomPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPageData } = customPageSlice.actions;
export default customPageSlice.reducer;
