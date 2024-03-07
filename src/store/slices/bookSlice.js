import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

// Initial State
const initialState = {
  books: [],
  bookCategories: [],
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
        url: "/Books/Get",
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
        // toast.success("تم إضافة الكتاب بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء إضافة الكتاب");
      toast.info("قيد التطوير...");
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
        // toast.success("تم تحديث الكتاب بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء تحديث الكتاب");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Book using Axios and Redux Thunk
export const deleteBookApi = createAsyncThunk(
  "book/deleteBookApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Books/Delete`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((response) => {
        // toast.success("تم حذف الكتاب بنجاح");
        toast.info("قيد التطوير...");
        return response.data;
      });
    } catch (error) {
      // toast.error("حدث خطأ أثناء حذف الكتاب");
      toast.info("قيد التطوير...");
      return rejectWithValue(error.message);
    }
  }
);

// Get Books Category using Axios and Redux Thunk
export const getBooksCategoriesApi = createAsyncThunk(
  "book/getBooksCategoryApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Books-Categories/Get",
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
        url: `/Books-Categories/Insert`,
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

// Update Book Category using Axios and Redux Thunk
export const updateBookCategoryApi = createAsyncThunk(
  "book/updateBookCategoryApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Books-Categories/Update`,
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

// Delete Book Category using Axios and Redux Thunk
export const deleteBookCategoryApi = createAsyncThunk(
  "book/deleteBookCategoryApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Books-Categories/Delete`,
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

// Books Slice
const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    // Get Books
    getBooks: (state, action) => {
      state.books = action.payload;
    },
    // Add Book
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    // Update Book
    updateBook: (state, action) => {
      state.books = state.books.map((picture) =>
        picture.id === action.payload.id ? action.payload : picture
      );
    },
    // Delete Book
    deleteBook: (state, action) => {
      state.books = state.books.filter(
        (picture) => picture.id !== action.payload
      );
    },
    // Get Books Category
    getBooksCategories: (state, action) => {
      state.bookCategories = action.payload;
    },
    // Add Book Category
    addBookCategory: (state, action) => {
      state.bookCategories.push(action.payload);
    },
    // Update Book Category
    updateBookCategory: (state, action) => {
      state.bookCategories = state.bookCategories.map((category) =>
        category.id === action.payload.id
          ? { ...action.payload, isEditing: true }
          : category
      );
    },
    // Delete Book Category
    deleteBookCategory: (state, action) => {
      state.bookCategories = state.bookCategories.filter(
        (category) => category.id !== action.payload
      );
    },
  },
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
  },
});

export const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getBooksCategories,
  addBookCategory,
  updateBookCategory,
  deleteBookCategory,
} = bookSlice.actions;
export default bookSlice.reducer;
