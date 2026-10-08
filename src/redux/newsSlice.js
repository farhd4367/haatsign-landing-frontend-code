// src/views/store/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching news data
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/news`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch news");
    }
  }
);

// Async thunk for fetching news details by slug
export const fetchNewsDetails = createAsyncThunk(
  "news/fetchNewsDetails",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/news-details`,
        { slug: `${slug}` }, // Sending slug in the request body
        { headers: getDefaultHeaders() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch news details");
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState: {
    newsData: [],
    newsDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsData = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNewsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.newsDetails = action.payload;
      })
      .addCase(fetchNewsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;
