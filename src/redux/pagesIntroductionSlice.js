// src/views/store/pagesIntroductionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching page introduction data
export const fetchPageIntroduction = createAsyncThunk(
  "pageIntroduction/fetchPageIntroduction",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-page-introduction`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch page introduction");
    }
  }
);

const pagesIntroductionSlice = createSlice({
  name: "pageIntroduction",
  initialState: {
    introductionData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageIntroduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageIntroduction.fulfilled, (state, action) => {
        state.loading = false;
        state.introductionData = action.payload;
      })
      .addCase(fetchPageIntroduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pagesIntroductionSlice.reducer;
