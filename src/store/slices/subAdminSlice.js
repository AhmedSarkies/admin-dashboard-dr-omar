import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";
import { toast } from "react-toastify";

// Initial State
const initialState = {
  subAdmins: [],
  loading: false,
  error: null,
};

// Get SubAdmins using Axios and Redux Thunk
export const getSubAdminsApi = createAsyncThunk(
  "subAdmin/getSubAdminsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/SubAdmin/Get",
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

// Add SubAdmin using Axios and Redux Thunk
export const addSubAdminApi = createAsyncThunk(
  "SubAdmin/addSubAdminApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/SubAdmin/Insert`,
        data,
      }).then((response) => {
        toast.success("تم إضافة مسؤول فرعي جديد بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة مسؤول فرعي جديد");
      return rejectWithValue(error.message);
    }
  }
);

// Update SubAdmin using Axios and Redux Thunk
export const updateSubAdminApi = createAsyncThunk(
  "subAdmin/updateSubAdminApi",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/SubAdmin/Update`,
        data,
      }).then((response) => {
        toast.success("تم تحديث المسؤول الفرعي بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث المسؤول الفرعي");
      return rejectWithValue(error.message);
    }
  }
);

// Delete SubAdmin using Axios and Redux Thunk
export const deleteSubAdminApi = createAsyncThunk(
  "subAdmin/deleteSubAdminApi",
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
        toast.success("تم حذف المسؤول الفرعي بنجاح");
        return response.data;
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المسؤول الفرعي");
      return rejectWithValue(error.message);
    }
  }
);

// SubAdmins Slice
const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState,
  reducers: {
    // Get SubAdmins
    getSubAdmins: (state, action) => {
      state.subAdmins = action.payload;
    },
    // Add SubAdmin
    addSubAdmin: (state, action) => {
      state.subAdmins.push(action.payload);
    },
    // Update SubAdmin
    updateSubAdmin: (state, action) => {
      state.subAdmins = state.subAdmins.map((subAdmin) =>
        subAdmin.id === action.payload.id ? action.payload : subAdmin
      );
    },
    // Delete SubAdmin
    deleteSubAdmin: (state, action) => {
      state.subAdmins = state.subAdmins.filter(
        (subAdmin) => subAdmin.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // ======Get SubAdmin======
    // Pending
    builder.addCase(getSubAdminsApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getSubAdminsApi.fulfilled, (state, action) => {
      state.subAdmins = action.payload;
      state.loading = false;
    });
    // Rejected
    builder.addCase(getSubAdminsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add SubAdmin======
    // Pending
    builder.addCase(addSubAdminApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addSubAdminApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addSubAdminApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update SubAdmin======
    // Pending
    builder.addCase(updateSubAdminApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateSubAdminApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateSubAdminApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete SubAdmin======
    // Pending
    builder.addCase(deleteSubAdminApi.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteSubAdminApi.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteSubAdminApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { getSubAdmins, addPicture, updatePicture, deletePicture } =
  subAdminSlice.actions;
export default subAdminSlice.reducer;
