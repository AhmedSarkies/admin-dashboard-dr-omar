import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  audios: [],
  audioCategories: [],
  loading: false,
  error: null,
};

// Get Audios using Axios and Redux Thunk
export const getAudiosApi = createAsyncThunk(
  "audio/getAudiosApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Audios/Get",
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

// Post Audio using Axios and Redux Thunk
export const addAudioApi = createAsyncThunk(
  "audio/addAudioApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: "/Audios/insert",
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Audio using Axios and Redux Thunk
export const updateAudioApi = createAsyncThunk(
  "audio/updateAudioApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Audios/Update`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Audio using Axios and Redux Thunk
export const deleteAudioApi = createAsyncThunk(
  "audios/deleteAudioApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Audios/Delete`,
        params: { id },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Audios Category using Axios and Redux Thunk
export const getAudiosCategoriesApi = createAsyncThunk(
  "audio/getAudiosCategoriesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Audios-Categories/Get",
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

// Add Audio Category using Axios and Redux Thunk
export const addAudioCategoryApi = createAsyncThunk(
  "audio/addAudioCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Audios-Categories/Insert?title=${data}`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Audio Category using Axios and Redux Thunk
export const updateAudioCategoryApi = createAsyncThunk(
  "audio/updateAudioCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Audios-Categories/Update`,
        params: { ...data },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Audio Category using Axios and Redux Thunk
export const deleteAudioCategoryApi = createAsyncThunk(
  "audio/deleteAudioCategoryApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Audios-Categories/Delete?id=${id}`,
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

// Audios Slice
const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Audios======
    // Pending
    builder.addCase(getAudiosApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getAudiosApi.fulfilled, (state, action) => {
      state.audios = action.payload.data;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getAudiosApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Audio======
    // Pending
    builder.addCase(addAudioApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addAudioApi.fulfilled, (state, action) => {
      state.audios.push(action.payload);
      state.loading = false;
    });
    // Rejected
    builder.addCase(addAudioApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Audio======
    // Pending
    builder.addCase(updateAudioApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateAudioApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateAudioApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Audio======
    // Pending
    builder.addCase(deleteAudioApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteAudioApi.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(deleteAudioApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Audios Category======
    // Pending
    builder.addCase(getAudiosCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getAudiosCategoriesApi.fulfilled, (state, action) => {
      state.audioCategories = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getAudiosCategoriesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Audio Category======
    // Pending
    builder.addCase(addAudioCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addAudioCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addAudioCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Audio Category======
    // Pending
    builder.addCase(updateAudioCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateAudioCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateAudioCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Audio Category======
    // Pending
    builder.addCase(deleteAudioCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteAudioCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteAudioCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default audioSlice.reducer;
