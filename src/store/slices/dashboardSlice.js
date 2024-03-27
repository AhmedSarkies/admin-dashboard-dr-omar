import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  counts: [],
  loading: false,
  error: null,
};

// Get Counts using Axios and Redux Thunk
export const getCounts = createAsyncThunk(
  "dashboard/getCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "admin/Counts",
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

// Dashboard Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Counts======
    // Pending
    builder.addCase(getCounts.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getCounts.fulfilled, (state, action) => {
      state.counts = action.payload.data;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getCounts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default dashboardSlice.reducer;
