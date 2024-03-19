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
        method: "GET",
        url: "/Slider/Get",
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

// Add Slider using Axios and Redux Thunk
export const addSliderApi = createAsyncThunk(
  "slider/addSliderApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Slider/Insert`,
        data,
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
        url: `/Slider/Update`,
        data,
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
        url: `/Slider/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
  reducers: {
    // Get Pictures
    getPictures: (state, action) => {
      state.sliders = action.payload;
    },
    // Add Picture
    addPicture: (state, action) => {
      state.sliders.push(action.payload);
    },
    // Update Picture
    updatePicture: (state, action) => {
      state.sliders = state.sliders.map((slider) =>
        slider.id === action.payload.id ? action.payload : slider
      );
    },
    // Delete Picture
    deletePicture: (state, action) => {
      state.sliders = state.sliders.filter(
        (slider) => slider.id !== action.payload
      );
    },
  },
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

export const { getSliders, addSlider, updateSlider, deleteSlider } =
  sliderSlice.actions;
export default sliderSlice.reducer;
