import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

// Initial State
const initialState = {
  articles: [],
  articleCategories: [],
  loading: false,
  error: null,
};

// Get Articles Using Axios and Redux Thunk
export const getArticlesApi = createAsyncThunk(
  "article/getArticlesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Articles/Get",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Article Using Axios and Redux Thunk
export const addArticleApi = createAsyncThunk(
  "article/addArticleApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Articles/Insert`,
        data,
      }).then((response) => {
        // toast.success("تم إضافة المقال بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء إضافة المقال");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Update Article Using Axios and Redux Thunk
export const updateArticleApi = createAsyncThunk(
  "article/updateArticleApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Articles/Update`,
        data,
      }).then((response) => {
        // toast.success("تم تحديث المقال بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء تحديث المقال");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Article Using Axios and Redux Thunk
export const deleteArticleApi = createAsyncThunk(
  "article/deleteArticleApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Articles/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((response) => {
        // toast.success("تم حذف المقال بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء حذف المقال");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Get Articles Category Using Axios and Redux Thunk
export const getArticlesCategoriesApi = createAsyncThunk(
  "article/getArticlesCategoryApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Articles-Categories/Get",
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

// Add Article Category Using Axios and Redux Thunk
export const addArticleCategoryApi = createAsyncThunk(
  "article/addArticleCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Articles-Categories/Insert`,
        params: {
          ...data,
        },
      }).then((response) => {
        // toast.success("تم إضافة تصنيف المقالات بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء إضافة تصنيف المقالات");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Update Article Category Using Axios and Redux Thunk
export const updateArticleCategoryApi = createAsyncThunk(
  "article/updateArticleCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Articles-Categories/Update`,
        params: {
          ...data,
        },
      }).then((response) => {
        // toast.success("تم تحديث تصنيف المقالات بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء تحديث تصنيف المقالات");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Article Category Using Axios and Redux Thunk
export const deleteArticleCategoryApi = createAsyncThunk(
  "article/deleteArticleCategoryApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Articles-Categories/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((response) => {
        // toast.success("تم حذف تصنيف المقالات بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء حذف تصنيف المقالات");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Articles Slice
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    // Get Articles
    getArticles: (state, action) => {
      state.articles = action.payload;
    },
    // Add Article
    addArticle: (state, action) => {
      state.articles.push(action.payload);
    },
    // Update Article
    updateArticle: (state, action) => {
      state.articles = state.articles.map((picture) =>
        picture.id === action.payload.id ? action.payload : picture
      );
    },
    // Delete Article
    deleteArticle: (state, action) => {
      state.articles = state.articles.filter(
        (picture) => picture.id !== action.payload
      );
    },
    // Get Articles Category
    getArticlesCategories: (state, action) => {
      state.articleCategories = action.payload;
    },
    // Add Article Category
    addArticleCategory: (state, action) => {
      state.articleCategories.push(action.payload);
    },
    // Update Article Category
    updateArticleCategory: (state, action) => {
      state.articleCategories = state.articleCategories.map((category) =>
        category.id === action.payload.id
          ? { ...action.payload, isEditing: true }
          : category
      );
    },
    // Delete Article Category
    deleteArticleCategory: (state, action) => {
      state.articleCategories = state.articleCategories.filter(
        (category) => category.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // ======Get Articles======
    // Pending
    builder.addCase(getArticlesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getArticlesApi.fulfilled, (state, action) => {
      state.articles = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getArticlesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Article======
    // Pending
    builder.addCase(addArticleApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addArticleApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addArticleApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Article======
    // Pending
    builder.addCase(updateArticleApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateArticleApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateArticleApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Article======
    // Pending
    builder.addCase(deleteArticleApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteArticleApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteArticleApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Articles Category======
    // Pending
    builder.addCase(getArticlesCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getArticlesCategoriesApi.fulfilled, (state, action) => {
      state.articleCategories = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getArticlesCategoriesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Article Category======
    // Pending
    builder.addCase(addArticleCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addArticleCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addArticleCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Article Category======
    // Pending
    builder.addCase(updateArticleCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateArticleCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateArticleCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Article Category======
    // Pending
    builder.addCase(deleteArticleCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteArticleCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteArticleCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticlesCategories,
  addArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
} = articleSlice.actions;
export default articleSlice.reducer;
