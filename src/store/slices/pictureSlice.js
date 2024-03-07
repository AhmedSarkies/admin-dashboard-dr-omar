import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

// Initial State
const initialState = {
  pictures: [],
  pictureCategories: [],
  loading: false,
  error: null,
};

// Get Pictures using Axios and Redux Thunk
export const getPicturesApi = createAsyncThunk(
  "picture/getPicturesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Images/Get",
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

// Add Picture using Axios and Redux Thunk
export const addPictureApi = createAsyncThunk(
  "picture/addPictureApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Images/Insert`,
        data,
      }).then((response) => {
        toast.success("تم إضافة الصورة بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الصورة");
      return rejectWithValue(error.message);
    }
  }
);

// Update Picture using Axios and Redux Thunk
export const updatePictureApi = createAsyncThunk(
  "picture/updatePictureApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Images/Update`,
        data,
      }).then((response) => {
        toast.success("تم تحديث الصورة بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الصورة");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Picture using Axios and Redux Thunk
export const deletePictureApi = createAsyncThunk(
  "picture/deletePictureApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Images/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((response) => {
        toast.success("تم حذف الصورة بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الصورة");
      return rejectWithValue(error.message);
    }
  }
);

// Get Pictures Category using Axios and Redux Thunk
export const getPicturesCategoriesApi = createAsyncThunk(
  "picture/getPicturesCategoryApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/ImagesCategories/Get",
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

// Add Picture Category using Axios and Redux Thunk
export const addPictureCategoryApi = createAsyncThunk(
  "picture/addPictureCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/ImagesCategories/Insert`,
        params: { ...data },
      }).then((response) => {
        toast.success("تم إضافة تصنيف الصور بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة تصنيف الصور");
      return rejectWithValue(error.message);
    }
  }
);

// Update Picture Category using Axios and Redux Thunk
export const updatePictureCategoryApi = createAsyncThunk(
  "picture/updatePictureCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/ImagesCategories/Update`,
        params: { ...data },
      }).then((response) => {
        toast.success("تم تحديث تصنيف الصور بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث تصنيف الصور");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Picture Category using Axios and Redux Thunk
export const deletePictureCategoryApi = createAsyncThunk(
  "picture/deletePictureCategoryApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/ImagesCategories/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((response) => {
        toast.success("تم حذف تصنيف الصور بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف تصنيف الصور");
      return rejectWithValue(error.message);
    }
  }
);

// Pictures Slice
const pictureSlice = createSlice({
  name: "picture",
  initialState,
  reducers: {
    // Get Pictures
    getPictures: (state, action) => {
      state.pictures = action.payload;
    },
    // Add Picture
    addPicture: (state, action) => {
      state.pictures.push(action.payload);
    },
    // Update Picture
    updatePicture: (state, action) => {
      state.pictures = state.pictures.map((picture) =>
        picture.id === action.payload.id ? action.payload : picture
      );
    },
    // Delete Picture
    deletePicture: (state, action) => {
      state.pictures = state.pictures.filter(
        (picture) => picture.id !== action.payload
      );
    },
    // Get Pictures Category
    getPicturesCategories: (state, action) => {
      state.pictureCategories = action.payload;
    },
    // Add Picture Category
    addPictureCategory: (state, action) => {
      state.pictureCategories.push(action.payload);
    },
    // Update Picture Category
    updatePictureCategory: (state, action) => {
      state.pictureCategories = state.pictureCategories.map((category) =>
        category.id === action.payload.id
          ? { ...action.payload, isEditing: true }
          : category
      );
    },
    // Delete Picture Category
    deletePictureCategory: (state, action) => {
      state.pictureCategories = state.pictureCategories.filter(
        (category) => category.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // ======Get Pictures======
    // Pending
    builder.addCase(getPicturesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getPicturesApi.fulfilled, (state, action) => {
      state.pictures = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getPicturesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Picture======
    // Pending
    builder.addCase(addPictureApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addPictureApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addPictureApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Picture======
    // Pending
    builder.addCase(updatePictureApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updatePictureApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updatePictureApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Picture======
    // Pending
    builder.addCase(deletePictureApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deletePictureApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deletePictureApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Pictures Category======
    // Pending
    builder.addCase(getPicturesCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getPicturesCategoriesApi.fulfilled, (state, action) => {
      state.pictureCategories = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getPicturesCategoriesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Picture Category======
    // Pending
    builder.addCase(addPictureCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addPictureCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addPictureCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Picture Category======
    // Pending
    builder.addCase(updatePictureCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updatePictureCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updatePictureCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Picture Category======
    // Pending
    builder.addCase(deletePictureCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deletePictureCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deletePictureCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  getPictures,
  addPicture,
  updatePicture,
  deletePicture,
  getPicturesCategories,
  addPictureCategory,
  updatePictureCategory,
  deletePictureCategory,
} = pictureSlice.actions;
export default pictureSlice.reducer;
