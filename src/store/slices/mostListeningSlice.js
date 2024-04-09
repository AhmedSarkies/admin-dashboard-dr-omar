import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  mostListening: [],
  loading: false,
  error: null,
};

// Get Most Listening using Axios and Redux Thunk
export const getMostListening = createAsyncThunk(
  "mostListening/getMostListening",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Audios/MostListened",
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
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Most Listening======
    // Pending
    builder.addCase(getMostListening.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getMostListening.fulfilled, (state, action) => {
      state.mostListening = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getMostListening.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default mostListeningSlice.reducer;
