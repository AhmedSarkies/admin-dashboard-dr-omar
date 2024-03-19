import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  settings: [],
  loading: false,
  error: null,
};

// Get Settings using Axios and Redux Thunk
export const getSettingsApi = createAsyncThunk(
  "settings/getSettingsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Settings/Get",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Book using Axios and Redux Thunk
export const addSettingApi = createAsyncThunk(
  "settings/addSettingApi",
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
export const updateSettingApi = createAsyncThunk(
  "settings/updateSettingApi",
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

// Delete Settings using Axios and Redux Thunk
export const deleteSettingApi = createAsyncThunk(
  "settings/deleteSettingApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Settings/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
  reducers: {
    // Get Settings
    getSettings: (state, action) => {
      state.settings = action.payload;
    },
    // Add Setting
    addSetting: (state, action) => {
      state.settings.push(action.payload);
    },
    // Update Setting
    updateSetting: (state, action) => {
      state.settings = state.settings.map((settings) =>
        settings.id === action.payload.id ? action.payload : settings
      );
    },
    // Delete Setting
    deleteSetting: (state, action) => {
      state.settings = state.settings.filter(
        (settings) => settings.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // ======Get Settings======
    // Pending
    builder.addCase(getSettingsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getSettingsApi.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getSettingsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Setting======
    // Pending
    builder.addCase(addSettingApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addSettingApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addSettingApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Settings======
    // Pending
    builder.addCase(updateSettingApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateSettingApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateSettingApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Settings======
    // Pending
    builder.addCase(deleteSettingApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteSettingApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteSettingApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  getSettings,
  addSetting,
  updateSetting,
  deleteSetting,
} = settingsSlice.actions;
export default settingsSlice.reducer;
