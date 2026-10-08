// src/redux/sliderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching slider data
export const fetchSliders = createAsyncThunk(
  "sliders/fetchSliders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sliders`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch sliders");
    }
  }
);

const sliderSlice = createSlice({
  name: "sliders",
  initialState: {
    sliderData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.sliderData = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sliderSlice.reducer;
