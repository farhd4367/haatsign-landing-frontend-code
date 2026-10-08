import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_URL, getDefaultHeaders } from "../config/apiConfig";

// Async thunk for fetching landing settings data
export const fetchLandingSettings = createAsyncThunk(
  "landingSettings/fetchLandingSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/general-setting`, {
        headers: getDefaultHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch landing settings");
    }
  },
);

export const fetchContactSubject = createAsyncThunk(
  "landingSettings/fetchContactSubject",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/get/subjects`,
        {
          headers: getDefaultHeaders(),
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch Subjects");
    }
  },
);

// Async thunk for posting contact us data
export const postContactUs = createAsyncThunk(
  "landingSettings/postContactUs",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/store-contact-us`,
        contactData,
        {
          headers: {
            ...getDefaultHeaders(),
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to submit contact us form");
    }
  },
);

// Async thunk for fetching social media links
export const fetchSocialMediaLinks = createAsyncThunk(
  "landingSettings/fetchSocialMediaLinks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/social-media-links`, {
        headers: getDefaultHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch social media links");
    }
  },
);

// Async thunk for enabling the header
export const enableHeader = createAsyncThunk(
  "landingSettings/enableHeader",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/custom-page-header-enable`,
        {
          headers: getDefaultHeaders(),
        },
      );
      return response.data.data; // Assuming the API returns the data in this format
    } catch (error) {
      return rejectWithValue("Failed to enable header");
    }
  },
);

// Async thunk for enabling the footer
export const enableFooter = createAsyncThunk(
  "landingSettings/enableFooter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/custom-page-footer-enable`,
        {
          headers: getDefaultHeaders(),
        },
      );
      return response.data.data; // Assuming the API returns the data in this format
    } catch (error) {
      return rejectWithValue("Failed to enable footer");
    }
  },
);

// Async thunk for enabling the second footer
export const enableSecondFooter = createAsyncThunk(
  "landingSettings/enableSecondFooter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/custom-page-second-footer-enable`,
        {
          headers: getDefaultHeaders(),
        },
      );
      return response.data.data; // Assuming the API returns the data in this format
    } catch (error) {
      return rejectWithValue("Failed to enable second footer");
    }
  },
);

const landingSettingSlice = createSlice({
  name: "landingSettings",
  initialState: {
    landingSettingsData: [],
    contactSubjectData: [],
    socialMediaLinksData: {},
    headerEnabledData: [], // Store header enabled data
    footerEnabledData: [], // Store footer enabled data
    secondFooterEnabledData: [], // Store second footer enabled data
    loading: false,
    error: null,
    contactUsResponse: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.landingSettingsData = action.payload;
      })
      .addCase(fetchLandingSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contactUsResponse = action.payload;
      })
      .addCase(postContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchContactSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.contactSubjectData = action.payload;
      })
      .addCase(fetchContactSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSocialMediaLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMediaLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.socialMediaLinksData = action.payload;
      })
      .addCase(fetchSocialMediaLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(enableHeader.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableHeader.fulfilled, (state, action) => {
        state.loading = false;
        state.headerEnabledData = action.payload.filter(
          (page) => page.is_header === 1,
        );
      })
      .addCase(enableHeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(enableFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableFooter.fulfilled, (state, action) => {
        state.loading = false;
        state.footerEnabledData = action.payload.filter(
          (page) => page.is_footer === 1,
        );
      })
      .addCase(enableFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(enableSecondFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableSecondFooter.fulfilled, (state, action) => {
        state.loading = false;
        state.secondFooterEnabledData = action.payload.filter(
          (page) => page.as_second_footer === 1,
        );
      })
      .addCase(enableSecondFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default landingSettingSlice.reducer;
