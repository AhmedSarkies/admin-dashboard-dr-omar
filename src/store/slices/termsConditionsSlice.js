import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  termsConditions: [],
  loading: false,
  error: null,
};

// Get Term And Condition using Axios and Redux Thunk
export const getTermsAndConditionsApi = createAsyncThunk(
  "termAndCondition/getTermsAndConditionsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/TermsConditions/get_terms_conditions`",
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

// Add TermsAndCondition using Axios and Redux Thunk
export const addTermAndConditionApi = createAsyncThunk(
  "termAndCondition/addTermAndConditionApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/TermsConditions/create_terms_conditions`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Term And Condition using Axios and Redux Thunk
export const updateTermAndConditionApi = createAsyncThunk(
  "termAndCondition/updateTermAndConditionApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/SubAdmin/Update`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Terms And Condition using Axios and Redux Thunk
export const deleteTermAndConditionApi = createAsyncThunk(
  "termAndCondition/deleteTermAndConditionApi",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/SubAdmin/Delete`,
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

// Terms And Conditions Slice
const termsConditionsSlice = createSlice({
  name: "termAndCondition",
  initialState,
  reducers: {
    // Get Terms And Conditions
    getTermsAndConditions: (state, action) => {
      state.termsConditions = action.payload;
    },
    // Add Term And Condition
    addTermAndCondition: (state, action) => {
      state.termsConditions = action.payload;
    },
    // Update Term And Condition
    updateTermAndCondition: (state, action) => {
      state.termsConditions = action.payload;
    },
    // Delete Term And Condition
    deleteTermAndCondition: (state, action) => {
      state.termsConditions = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ======Get Terms And Conditions======
    // Pending
    builder.addCase(getTermsAndConditionsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getTermsAndConditionsApi.fulfilled, (state, action) => {
      state.termsConditions = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getTermsAndConditionsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add Term And Condition======
    // Pending
    builder.addCase(addTermAndConditionApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addTermAndConditionApi.fulfilled, (state, action) => {
      state.loading = false;
      state.termsConditions = action.payload;
    });
    // Rejected
    builder.addCase(addTermAndConditionApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update Term And Condition======
    // Pending
    builder.addCase(updateTermAndConditionApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateTermAndConditionApi.fulfilled, (state, action) => {
      state.loading = false;
      state.termsConditions = action.payload;
    });
    // Rejected
    builder.addCase(updateTermAndConditionApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete Term And Condition======
    // Pending
    builder.addCase(deleteTermAndConditionApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteTermAndConditionApi.fulfilled, (state, action) => {
      state.loading = false;
      state.termsConditions = action.payload;
    });
    // Rejected
    builder.addCase(deleteTermAndConditionApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  getTermsAndConditions,
  addTermAndCondition,
  updateTermAndCondition,
  deleteTermAndCondition,
} = termsConditionsSlice.actions;
export default termsConditionsSlice.reducer;
