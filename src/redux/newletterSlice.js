// src/redux/newsletterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async (email) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscribe-news-latter`,
        { email },
        { headers: getDefaultHeaders() }
      );
      
      return response.data;
    } catch (error) {
      let errorMessage;
      
      if (error.response) {
        const message = error.response.data?.message;
        if (message && typeof message === 'object') {
          errorMessage = Object.values(message).flat().join(', ');
        } else {
          errorMessage = message || error.response.data?.error || "Failed to subscribe to newsletter";
        }
        throw new Error(errorMessage);
      } else if (error.request) {
        errorMessage = "Network error. Please try again later.";
        throw new Error(errorMessage);
      } else {
        errorMessage = error.message || "An error occurred";
        throw new Error(errorMessage);
      }
    }
  }
);


const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    subscriptionStatus: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearNewsletterStatus: (state) => {
      state.subscriptionStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionStatus = action.payload;
        state.error = null;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { clearNewsletterStatus } = newsletterSlice.actions;
export default newsletterSlice.reducer;
