// src/views/store/faqsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching FAQ data
export const fetchFaqs = createAsyncThunk(
  "faqs/fetchFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faqs`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch FAQs");
    }
  }
);

const faqsSlice = createSlice({
  name: "faqs",
  initialState: {
    faqData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqData = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default faqsSlice.reducer;
