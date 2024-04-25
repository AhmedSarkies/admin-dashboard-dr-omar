import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  books: [],
  bookCategories: [],
  bookSubSubCategories: [],
  loading: false,
  error: null,
};

// Get Books using Axios and Redux Thunk
export const getBooksApi = createAsyncThunk(
  "book/getBooksApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Books/Get_All_Books",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Book using Axios and Redux Thunk
export const addBookApi = createAsyncThunk(
  "book/addBookApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Books/Insert`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Book using Axios and Redux Thunk
export const updateBookApi = createAsyncThunk(
  "book/updateBookApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Books/Update`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Book using Axios and Redux Thunk
export const deleteBookApi = createAsyncThunk(
  "book/deleteBookApi",
  async (Book_id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Books/Delete`,
        params: { Book_id },
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

// Get Books Category using Axios and Redux Thunk
export const getBooksCategoriesApi = createAsyncThunk(
  "book/getBooksCategoriesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Main-Categories-Books/Get",
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

// Add Book Category using Axios and Redux Thunk
export const addBookCategoryApi = createAsyncThunk(
  "book/addBookCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Main-Categories-Books/Insert`,
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

// Update Book Category using Axios and Redux Thunk
export const updateBookCategoryApi = createAsyncThunk(
  "book/updateBookCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Main-Categories-Books/Update`,
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

// Delete Book Category using Axios and Redux Thunk
export const deleteBookCategoryApi = createAsyncThunk(
  "book/deleteBookCategoryApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Main-Categories-Books/Delete`,
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

// Get Books Sub Category using Axios and Redux Thunk
export const getBooksSubCategoriesApi = createAsyncThunk(
  "book/getBooksSubCategoriesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Categories-Books/Get",
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

// Add Book sub Category using Axios and Redux Thunk
export const addBookSubCategoryApi = createAsyncThunk(
  "book/addBookSubCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Categories-Books/Insert`,
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

// Update Book Sub Category using Axios and Redux Thunk
export const updateBookSubCategoryApi = createAsyncThunk(
  "book/updateBookSubCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Categories-Books/Update`,
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

// Delete Book Sub Category using Axios and Redux Thunk
export const deleteBookSubCategoryApi = createAsyncThunk(
  "book/deleteBookSubCategoryApi",
  async (category_id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Categories-Books/Delete`,
        params: { category_id },
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

// Get Books Sub Category using Axios and Redux Thunk
export const getBooksSubSubCategoriesApi = createAsyncThunk(
  "book/getBooksSubSubCategoriesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Sub-Categories-Books/Get",
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

// Add Book sub Category using Axios and Redux Thunk
export const addBookSubSubCategoryApi = createAsyncThunk(
  "book/addBookSubSubCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Sub-Categories-Books/Insert`,
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

// Update Book Sub Category using Axios and Redux Thunk
export const updateBookSubSubCategoryApi = createAsyncThunk(
  "book/updateBookSubSubCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Sub-Categories-Books/Update`,
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

// Delete Book Sub Category using Axios and Redux Thunk
export const deleteBookSubSubCategoryApi = createAsyncThunk(
  "book/deleteBookSubSubCategoryApi",
  async (sub_category_id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Sub-Categories-Books/Delete`,
        params: { sub_category_id },
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

// Books Slice
const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Books======
    // Pending
    builder.addCase(getBooksApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getBooksApi.fulfilled, (state, action) => {
      state.books = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getBooksApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Book======
    // Pending
    builder.addCase(addBookApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addBookApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addBookApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Book======
    // Pending
    builder.addCase(updateBookApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateBookApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateBookApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Book======
    // Pending
    builder.addCase(deleteBookApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteBookApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteBookApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Books Category======
    // Pending
    builder.addCase(getBooksCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getBooksCategoriesApi.fulfilled, (state, action) => {
      state.bookCategories = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getBooksCategoriesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Book Category======
    // Pending
    builder.addCase(addBookCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addBookCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addBookCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Book Category======
    // Pending
    builder.addCase(updateBookCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateBookCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateBookCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Book Category======
    // Pending
    builder.addCase(deleteBookCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteBookCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteBookCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Books Sub Category======
    // Pending
    builder.addCase(getBooksSubCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getBooksSubCategoriesApi.fulfilled, (state, action) => {
      state.bookSubCategories = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getBooksSubCategoriesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Book Sub Category======
    // Pending
    builder.addCase(addBookSubCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addBookSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addBookSubCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Book Sub Category======
    // Pending
    builder.addCase(updateBookSubCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateBookSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateBookSubCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Book Sub Category======
    // Pending
    builder.addCase(deleteBookSubCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteBookSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteBookSubCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Books Sub Sub Category======
    // Pending
    builder.addCase(getBooksSubSubCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getBooksSubSubCategoriesApi.fulfilled, (state, action) => {
      state.bookSubSubCategories = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getBooksSubSubCategoriesApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Book Sub Sub Category======
    // Pending
    builder.addCase(addBookSubSubCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addBookSubSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addBookSubSubCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Book Sub Sub Category======
    // Pending
    builder.addCase(updateBookSubSubCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateBookSubSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateBookSubSubCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Book Sub Sub Category======
    // Pending
    builder.addCase(deleteBookSubSubCategoryApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteBookSubSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteBookSubSubCategoryApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default bookSlice.reducer;
