// src/views/store/membershipSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching membership data
export const fetchMemberships = createAsyncThunk(
  "memberships/fetchMemberships",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/memberships`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch memberships");
    }
  }
);

const membershipSlice = createSlice({
  name: "memberships",
  initialState: {
    membershipData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipData = action.payload;
      })
      .addCase(fetchMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default membershipSlice.reducer;
