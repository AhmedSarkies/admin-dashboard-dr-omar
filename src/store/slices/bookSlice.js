import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

// Initial State
const initialState = {
  books: [],
  bookCategories: [],
  bookSubCategories: [],
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
        toast.success("تم إضافة التصنيف الرئيسي للكتاب بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التصنيف الرئيسي للكتاب");
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
        toast.success("تم تحديث التصنيف الرئيسي للكتاب بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث التصنيف الرئيسي للكتاب");
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
        toast.success("تم إضافة التصنيف الفرعي للكتاب بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التصنيف الفرعي للكتاب");
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
        toast.success("تم تحديث التصنيف الفرعي للكتاب بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث التصنيف الفرعي للكتاب");
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
        toast.success("تم حذف التصنيف الفرعي للكتاب بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف التصنيف الفرعي للكتاب");
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
      state.books = state.books.map((books) =>
        books.id === action.payload.id ? action.payload : books
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
        category.id === action.payload.id ? action.payload : category
      );
    },
    // Delete Book Category
    deleteBookCategory: (state, action) => {
      state.bookCategories = state.bookCategories.filter(
        (category) => category.id !== action.payload
      );
    },
    // Get Books Sub Category
    getBooksSubCategories: (state, action) => {
      state.bookSubCategories = action.payload;
    },
    // Add Book Sub Category
    addBookSubCategory: (state, action) => {
      state.bookSubCategories.push(action.payload);
    },
    // Update Book Sub Category
    updateBookSubCategory: (state, action) => {
      state.bookSubCategories = state.bookSubCategories.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
    },
    // Delete Book Sub Category
    deleteBookSubCategory: (state, action) => {
      state.bookSubCategories = state.bookSubCategories.filter(
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
    // ======Get Books Sub Category======
    // Pending
    builder.addCase(getBooksSubCategoriesApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getBooksSubCategoriesApi.fulfilled, (state, action) => {
      state.bookSubCategories = action.payload;
      state.loading = false;
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
  getBooksSubCategories,
  addBookSubCategory,
  updateBookSubCategory,
  deleteBookSubCategory,
} = bookSlice.actions;
export default bookSlice.reducer;
