import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

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
        return response.data;
      });
    } catch (error) {
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
        return response.data;
      });
    } catch (error) {
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
        return response.data;
      });
    } catch (error) {
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
        return response.data;
      });
    } catch (error) {
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
        return response.data;
      });
    } catch (error) {
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
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Articles Slice
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Articles======
    // Pending
    builder.addCase(getArticlesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getArticlesApi.fulfilled, (state, action) => {
      state.articles = action.payload.data;
      state.loading = false;
      state.error = null;
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
      state.error = null;
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

export default articleSlice.reducer;
