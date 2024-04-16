import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import Cookies from "js-cookie";

// Initial State
const initialState = {
  profile: [],
  loading: false,
  error: null,
};

// Get Profile Admin using Axios and Redux Thunk
export const getProfileAdmin = createAsyncThunk(
  "profile/getProfileAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/admin/ProfileAdmin",
        params: { id: Cookies.get("_id") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Change Password using Axios and Redux Thunk
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/changePassword`,
        data: {
          current_password: data.current_password,
          new_password: data.new_password,
          new_password_confirmation: data.new_password_confirmation,
        },
        params: { id: data.id },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Profile Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Profile Admin======
    // Pending
    builder.addCase(getProfileAdmin.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getProfileAdmin.fulfilled, (state, action) => {
      state.profile = action.payload.data;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getProfileAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Change Password======
    // Pending
    builder.addCase(changePassword.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default profileSlice.reducer;
