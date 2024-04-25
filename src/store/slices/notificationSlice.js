import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Get Notification using Axios and Redux Thunk
export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async (_, { rejectWithValue }) => {
    try {
      const req = await Http({
        method: "GET",
        url: `/admin/Get_Notification`,
      });
      const res = await req.data;
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send Notification using Axios and Redux Thunk
export const sendNotification = createAsyncThunk(
  "notification/sendNotification",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/AdminNotificationsID`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send Notification All using Axios and Redux Thunk
export const sendNotificationAll = createAsyncThunk(
  "notification/sendNotificationAll",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/AdminNotifications`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send Notification Selected Users using Axios and Redux Thunk
export const sendNotificationSelectedUsers = createAsyncThunk(
  "notification/sendNotificationSelectedUsers",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/sendNotificationToUsersSelect`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Notification using Axios and Redux Thunk
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/destroy`,
        params: { id },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Books Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Notification======
    // Pending
    builder.addCase(getNotification.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getNotification.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
      state.error = null;
    });
    // Rejected
    builder.addCase(getNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Send Notification======
    // Pending
    builder.addCase(sendNotification.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(sendNotification.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(sendNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Send Notification All======
    // Pending
    builder.addCase(sendNotificationAll.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(sendNotificationAll.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(sendNotificationAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default notificationSlice.reducer;
