import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  codeContent: [],
  loading: false,
  error: null,
};

// Send Code Content using Axios and Redux Thunk
export const sendCodeContent = createAsyncThunk(
  "codeContent/sendCodeContent",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Settings/SendCode`,
        params: {
          code: data.code,
          User_id: data.User_id,
        },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send Code Content All using Axios and Redux Thunk
export const sendCodeContentAll = createAsyncThunk(
  "codeContent/sendCodeContentAll",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `Settings/sendCodeAll`,
        params: {
          code: data.code,
        },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Books Slice
const codeContentSlice = createSlice({
  name: "codeContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Add Code Content======
    // Pending
    builder.addCase(sendCodeContent.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(sendCodeContent.fulfilled, (state, action) => {
      state.loading = false;
      state.codeContent = action.payload;
    });
    // Rejected
    builder.addCase(sendCodeContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Code Content All======
    // Pending
    builder.addCase(sendCodeContentAll.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(sendCodeContentAll.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(sendCodeContentAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default codeContentSlice.reducer;
