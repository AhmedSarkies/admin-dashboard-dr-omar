import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  users: [],
  newUsers: [],
  loading: false,
  error: null,
};

// Get Users using Axios and Redux Thunk
export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/user/Get-Users",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get New Users using Axios and Redux Thunk
export const getNewUsers = createAsyncThunk(
  "user/getNewUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/admin/getLastLogin",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update User using Axios and Redux Thunk
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "POST",
        url: "/admin/updateUser",
        data: data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete User using Axios and Redux Thunk
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "DELETE",
        url: `/admin/deleteUser`,
        params: { id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Users======
    // Pending
    builder.addCase(getUsers.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get New Users======
    // Pending
    builder.addCase(getNewUsers.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getNewUsers.fulfilled, (state, action) => {
      state.newUsers = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getNewUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update User======
    // Pending
    builder.addCase(updateUser.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete User======
    // Pending
    builder.addCase(deleteUser.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;
