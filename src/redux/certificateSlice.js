// src/views/store/certificateSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching certificate data
export const fetchCertificates = createAsyncThunk(
  "certificates/fetchCertificates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/certificates`, { headers: getDefaultHeaders() });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch certificates");
    }
  }
);

const certificateSlice = createSlice({
  name: "certificates",
  initialState: {
    certificateData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateData = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default certificateSlice.reducer;
