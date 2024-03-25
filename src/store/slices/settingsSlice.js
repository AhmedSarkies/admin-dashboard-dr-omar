import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  settings: [],
  loading: false,
  error: null,
};

// Get Settings using Axios and Redux Thunk
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Settings/Get-all",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Book using Axios and Redux Thunk
export const addSetting = createAsyncThunk(
  "settings/addSetting",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Settings/Insert`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Settings using Axios and Redux Thunk
export const updateSetting = createAsyncThunk(
  "settings/updateSetting",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Settings/Update`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Settings Slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Settings======
    // Pending
    builder.addCase(getSettings.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Setting======
    // Pending
    builder.addCase(addSetting.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addSetting.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addSetting.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Settings======
    // Pending
    builder.addCase(updateSetting.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateSetting.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateSetting.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default settingsSlice.reducer;
