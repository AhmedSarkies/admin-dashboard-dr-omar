import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  scholars: [],
  approvedScholars: [],
  loading: false,
  error: null,
};

// Get Scholars using Axios and Redux Thunk
export const getScholarsApi = createAsyncThunk(
  "scholar/getScholarsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Elders/Get",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Post Scholar using Axios and Redux Thunk
export const addScholarApi = createAsyncThunk(
  "scholar/addScholarApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: "/Elders/Insert",
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Scholar using Axios and Redux Thunk
export const updateScholarApi = createAsyncThunk(
  "scholar/updateScholarApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: "/Elders/update_elder",
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Scholar using Axios and Redux Thunk
export const deleteScholarApi = createAsyncThunk(
  "scholar/deleteScholarApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: "/Elders/Delete",
        params: { id },
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Approved Scholars using Axios and Redux Thunk
export const getApprovedScholarsApi = createAsyncThunk(
  "scholar/getApprovedScholarsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/Elders/Elders_Approve",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Scholar Slice
const scholarSlice = createSlice({
  name: "scholar",
  initialState,
  reducers: {
    // Get Scholars
    getScholars: (state, action) => {
      state.scholars = action.payload;
    },
    // Update Scholar
    updateScholar: (state, action) => {
      state.scholars = state.scholars.map((scholar) =>
        scholar.id === action.payload.id
          ? { ...action.payload, isEditing: true }
          : scholar
      );
    },
    // Delete Scholar
    deleteScholar: (state, action) => {
      state.scholars = state.scholars.filter(
        (scholar) => scholar.id !== action.payload
      );
    },
    // Get Approved Scholars
    getApprovedScholars: (state, action) => {
      state.approvedScholars = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ======Get Scholars======
    // Pending
    builder.addCase(getScholarsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getScholarsApi.fulfilled, (state, action) => {
      state.scholars = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getScholarsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Scholar======
    // Pending
    builder.addCase(addScholarApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addScholarApi.fulfilled, (state, action) => {
      state.scholars.push(action.payload);
      state.loading = false;
    });
    // Rejected
    builder.addCase(addScholarApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Scholar======
    // Pending
    builder.addCase(updateScholarApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateScholarApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateScholarApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Scholar======
    // Pending
    builder.addCase(deleteScholarApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteScholarApi.fulfilled, (state, action) => {
      state.scholars = state.scholars.filter(
        (scholar) => scholar.id !== action.payload
      );
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteScholarApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Approved Scholars======
    // Pending
    builder.addCase(getApprovedScholarsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getApprovedScholarsApi.fulfilled, (state, action) => {
      state.approvedScholars = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getApprovedScholarsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  getScholars,
  getApprovedScholars,
  updateScholar,
  deleteScholar,
} = scholarSlice.actions;
export default scholarSlice.reducer;
