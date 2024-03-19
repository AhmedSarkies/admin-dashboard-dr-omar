import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  codeContent: [],
  loading: false,
  error: null,
};

// Get Books using Axios and Redux Thunk
export const getCodeContentsApi = createAsyncThunk(
  "codeContent/getCodeContentsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Code-Content/Get",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Book using Axios and Redux Thunk
export const addCodeContentApi = createAsyncThunk(
  "codeContent/addCodeContentApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Code-Content/Insert`,
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
export const updateCodeContentApi = createAsyncThunk(
  "codeContent/updateCodeContentApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Code-Content/Update`,
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
export const deleteCodeContentApi = createAsyncThunk(
  "codeContent/deleteBookApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/Code-Content/Delete`,
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

// Books Slice
const codeContentSlice = createSlice({
  name: "codeContent",
  initialState,
  reducers: {
    // Get Books
    getCodeContents: (state, action) => {
      state.codeContent = action.payload;
    },
    // Add Book
    addCodeContent: (state, action) => {
      state.codeContent.push(action.payload);
    },
    // Update Book
    updateCodeContent: (state, action) => {
      state.codeContent = state.codeContent.map((codeContent) =>
        codeContent.id === action.payload.id ? action.payload : codeContent
      );
    },
    // Delete CodeContent
    deleteCodeContent: (state, action) => {
      state.codeContent = state.codeContent.filter(
        (codeContent) => codeContent.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // ======Get Books======
    // Pending
    builder.addCase(getCodeContentsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getCodeContentsApi.fulfilled, (state, action) => {
      state.books = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getCodeContentsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Book======
    // Pending
    builder.addCase(addCodeContentApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addCodeContentApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addCodeContentApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Book======
    // Pending
    builder.addCase(updateCodeContentApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateCodeContentApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateCodeContentApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Book======
    // Pending
    builder.addCase(deleteCodeContentApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteCodeContentApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteCodeContentApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  getCodeContents,
  addCodeContent,
  updateCodeContent,
  deleteCodeContent,
} = codeContentSlice.actions;
export default codeContentSlice.reducer;
