import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  termsAndConditions: [],
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
        url: "/TermsConditions/Get_Term_All",
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
        url: `/TermsConditions/updateTerm`,
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
        method: "DELETE",
        url: `/TermsConditions/deleteTerm`,
        params: { id },
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
  reducers: {},
  extraReducers: (builder) => {
    // ======Get Terms And Conditions======
    // Pending
    builder.addCase(getTermsAndConditionsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getTermsAndConditionsApi.fulfilled, (state, action) => {
      state.termsAndConditions = action.payload;
      state.loading = false;
      state.error = null;
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
      state.termsAndConditions = action.payload;
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
      state.termsAndConditions = action.payload;
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
      state.termsAndConditions = action.payload;
    });
    // Rejected
    builder.addCase(deleteTermAndConditionApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default termsConditionsSlice.reducer;
