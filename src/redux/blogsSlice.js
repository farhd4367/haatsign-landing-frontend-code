// src/views/store/blogsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders, TEST_URL } from "@/config/apiConfig";

// Async thunk for fetching blog data
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch blogs");
    }
  }
);

// Async thunk for fetching blog details by slug
export const fetchBlogDetails = createAsyncThunk(
  "blogs/fetchBlogDetails",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/blog-details`,
        { slug: `${slug}` }, // Sending slug in the request body
        { headers: getDefaultHeaders() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch blog details");
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogData: [],
    blogDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.blogDetails = action.payload;
      })
      .addCase(fetchBlogDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
