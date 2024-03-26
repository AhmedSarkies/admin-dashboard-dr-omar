import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  mostListening: [],
  loading: false,
  error: null,
};

// Get Most Listening using Axios and Redux Thunk
export const getMostListeningApi = createAsyncThunk(
  "mostListening/getMostListeningApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Most-Listening/Get",
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

// Most Listening Slice
const mostListeningSlice = createSlice({
  name: "mostListening",
  initialState,
  reducers: {
    // Get Most Listening
    getMostListening: (state, action) => {
      state.mostListening = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ======Get Most Listening======
    // Pending
    builder.addCase(getMostListeningApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getMostListeningApi.fulfilled, (state, action) => {
      state.mostListening = action.payload.data;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getMostListeningApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { getMostListening } = mostListeningSlice.actions;
export default mostListeningSlice.reducer;
