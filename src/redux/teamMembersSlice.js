// src/views/store/teamMembersSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Async thunk for fetching team member data
export const fetchTeamMembers = createAsyncThunk(
  "teamMembers/fetchTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/team-members`, { headers: getDefaultHeaders() });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch team members");
    }
  }
);

const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState: {
    teamMembersData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembersData = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamMembersSlice.reducer;
