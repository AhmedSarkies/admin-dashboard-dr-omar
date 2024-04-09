import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  sliders: [],
  loading: false,
  error: null,
};

// Get Sliders using Axios and Redux Thunk
export const getSlidersApi = createAsyncThunk(
  "slider/getSlidersApi",
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

// Add Slider using Axios and Redux Thunk
export const addSliderApi = createAsyncThunk(
  "slider/addSliderApi",
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

// Update Slider using Axios and Redux Thunk
export const updateSliderApi = createAsyncThunk(
  "slider/updateSliderApi",
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

// Delete Slider using Axios and Redux Thunk
export const deleteSliderApi = createAsyncThunk(
  "slider/deleteSliderApi",
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

// Sliders Slice
const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Sliders======
    // Pending
    builder.addCase(getSlidersApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getSlidersApi.fulfilled, (state, action) => {
      state.sliders = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getSlidersApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Slider======
    // Pending
    builder.addCase(addSliderApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addSliderApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addSliderApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Slider======
    // Pending
    builder.addCase(updateSliderApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateSliderApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateSliderApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Slider======
    // Pending
    builder.addCase(deleteSliderApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteSliderApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteSliderApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default sliderSlice.reducer;
