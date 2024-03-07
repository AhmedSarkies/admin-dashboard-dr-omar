import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

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
        // toast.success("تم إضافة الصوتية بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء إضافة الصوتية");
      toast.info("قيد التطوير...");
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
        // toast.success("تم تحديث الصوتية بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء تحديث الصوتية");
      toast.info("قيد التطوير...");
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
        url: `/Elders/Delete?id=${id}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((response) => {
        // toast.success("تم حذف الصوتية بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء حذف الصوتية");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Get Audios Category using Axios and Redux Thunk
export const getAudiosCategoriesApi = createAsyncThunk(
  "audio/getAudiosCategoryApi",
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
        toast.success("تم إضافة تصنيف الصوتية بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة تصنيف الصوتية");
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
        url: `/ImagesCategories/Update`,
        params: { ...data },
      }).then((response) => {
        toast.success("تم تحديث تصنيف الصوتية بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث تصنيف الصوتية");
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
        toast.success("تم حذف تصنيف الصوتية بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف تصنيف الصوتية");
      return rejectWithValue(error.message);
    }
  }
);

// Audios Slice
const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    // Get Audios
    getAudios: (state, action) => {
      state.audios = action.payload;
    },
    // Update Audio
    updateAudio: (state, action) => {
      state.audios = state.audios.map((audio) =>
        audio.id === action.payload.id
          ? { ...action.payload, isEditing: true }
          : audio
      );
    },
    // Delete Audio
    deleteAudio: (state, action) => {
      state.audios = state.audios.filter(
        (audio) => audio.id !== action.payload
      );
    },
    // Get Audios Category
    getAudiosCategories: (state, action) => {
      state.audioCategories = action.payload;
    },
    // Update Audio Category
    updateAudioCategory: (state, action) => {
      state.audioCategories = state.audioCategories.map((category) =>
        category.id === action.payload.id
          ? { ...action.payload, isEditing: true }
          : category
      );
    },
    // Delete Audio Category
    deleteAudioCategory: (state, action) => {
      state.audioCategories = state.audioCategories.filter(
        (category) => category.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // ======Get Audios======
    // Pending
    builder.addCase(getAudiosApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getAudiosApi.fulfilled, (state, action) => {
      state.audios = action.payload;
      state.loading = false;
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
      state.audios = state.audios.filter(
        (audio) => audio.id !== action.payload
      );
      state.loading = false;
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

export const {
  getAudios,
  updateAudio,
  deleteAudio,
  getAudiosCategories,
  addAudioCategory,
  updateAudioCategory,
  deleteAudioCategory,
} = audioSlice.actions;
export default audioSlice.reducer;
