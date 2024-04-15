import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  introductionPage: [],
  loading: false,
  error: null,
};

// Get IntroductionPage using Axios and Redux Thunk
export const getIntroductionPageApi = createAsyncThunk(
  "introductionPage/getIntroductionPageApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "POST",
        url: "/IntroductionPage/Get",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add IntroductionPage using Axios and Redux Thunk
export const addIntroductionPageApi = createAsyncThunk(
  "introductionPage/addIntroductionPageApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/IntroductionPage/Insert`,
        data: data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update IntroductionPage using Axios and Redux Thunk
export const updateIntroductionPageApi = createAsyncThunk(
  "introductionPage/updateIntroductionPageApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/IntroductionPage/update`,
        data: data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete IntroductionPage using Axios and Redux Thunk
export const deleteIntroductionPageApi = createAsyncThunk(
  "introductionPage/deleteIntroductionPageApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/IntroductionPage/Delete`,
        data: { id },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// IntroductionPage Slice
const introductionPageSlice = createSlice({
  name: "introductionPage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get IntroductionPage======
    // Pending
    builder.addCase(getIntroductionPageApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getIntroductionPageApi.fulfilled, (state, action) => {
      state.introductionPage = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getIntroductionPageApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add IntroductionPage======
    // Pending
    builder.addCase(addIntroductionPageApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addIntroductionPageApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addIntroductionPageApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update IntroductionPage======
    // Pending
    builder.addCase(updateIntroductionPageApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateIntroductionPageApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateIntroductionPageApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete IntroductionPage======
    // Pending
    builder.addCase(deleteIntroductionPageApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteIntroductionPageApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteIntroductionPageApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default introductionPageSlice.reducer;
