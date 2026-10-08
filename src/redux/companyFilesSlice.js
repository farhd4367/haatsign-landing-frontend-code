// src/views/store/companyFilesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching company files data
export const fetchCompanyFiles = createAsyncThunk(
  "companyFiles/fetchCompanyFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-files`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch company files");
    }
  }
);

const companyFilesSlice = createSlice({
  name: "companyFiles",
  initialState: {
    filesData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.filesData = action.payload;
      })
      .addCase(fetchCompanyFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companyFilesSlice.reducer;
