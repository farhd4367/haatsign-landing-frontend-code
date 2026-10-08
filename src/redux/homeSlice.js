/* src/views/store/homeSlice.js */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Example import in any component or page:
import { API_BASE_URL, API_URL, ADMIN_API_URL, TEST_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching home data
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/home`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch home data");
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    homeData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.homeData = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default homeSlice.reducer;
