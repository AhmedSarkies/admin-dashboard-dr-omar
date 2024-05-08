import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  messages: [],
  loading: false,
  loadingToggleMessage: false,
  error: null,
};

// Get Messages using Axios and Redux Thunk
export const getMessagesApi = createAsyncThunk(
  "messages/getMessagesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Message/get_message",
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

// Toggle Messages using Axios and Redux Thunk
export const toggleMessage = createAsyncThunk(
  "messages/toggleMessage",
  async (random_id, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "POST",
        url: "/Message/updateMessageStatus",
        params: {
          random_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Messages Slice
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Messages======
    // Pending
    builder.addCase(getMessagesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getMessagesApi.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getMessagesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Toggle Message======
    // Pending
    builder.addCase(toggleMessage.pending, (state, action) => {
      state.loadingToggleMessage = true;
    });
    // Fulfilled
    builder.addCase(toggleMessage.fulfilled, (state, action) => {
      state.loadingToggleMessage = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(toggleMessage.rejected, (state, action) => {
      state.loadingToggleMessage = false;
      state.error = action.payload;
    });
  },
});

export default messagesSlice.reducer;
