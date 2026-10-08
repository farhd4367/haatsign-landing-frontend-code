// src/views/store/careerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching job data
export const fetchJobs = createAsyncThunk(
  "careers/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`, { headers: getDefaultHeaders() });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch jobs");
    }
  }
);

const careerSlice = createSlice({
  name: "careers",
  initialState: {
    jobData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobData = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default careerSlice.reducer;
