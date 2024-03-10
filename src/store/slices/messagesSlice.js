import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

// Initial State
const initialState = {
  messages: [],
  loading: false,
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

// Messages Slice
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // Get Messages
    getMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ======Get SubAdmin======
    // Pending
    builder.addCase(getMessagesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getMessagesApi.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getMessagesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { getMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
