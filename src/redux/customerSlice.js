// src/views/store/customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching customer data
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/landing-customers`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch customers");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customerData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
