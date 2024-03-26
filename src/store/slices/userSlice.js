import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  users: [],
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
      state.users = action.payload.data;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;
