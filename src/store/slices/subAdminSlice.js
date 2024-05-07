import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Http from "../../Http";

// Initial State
const initialState = {
  subAdmins: [],
  permissions: [],
  adminData: [],
  loading: false,
  loadingAdminData: false,
  error: null,
};

// Get SubAdmins using Axios and Redux Thunk
export const getSubAdmins = createAsyncThunk(
  "subAdmin/getSubAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/admin/Get",
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
export const addSubAdmin = createAsyncThunk(
  "SubAdmin/addSubAdmin",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/register`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update SubAdmin using Axios and Redux Thunk
export const updateSubAdmin = createAsyncThunk(
  "subAdmin/updateSubAdmin",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/Update`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete SubAdmin using Axios and Redux Thunk
export const deleteSubAdmin = createAsyncThunk(
  "subAdmin/deleteSubAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/Delete`,
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

// Change Password using Axios and Redux Thunk
export const changePassword = createAsyncThunk(
  "subAdmin/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      await Http({
        method: "POST",
        url: `/admin/changePassword`,
        data,
      }).then((response) => {
        return response.data;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Permissions using Axios and Redux Thunk
export const getPermissions = createAsyncThunk(
  "subAdmin/getPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/admin/GetPermission",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Admin Data using Axios and Redux Thunk
export const getAdminData = createAsyncThunk(
  "subAdmin/getAdminData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Http({
        method: "GET",
        url: "/admin/getAdminData",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// SubAdmins Slice
const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======Get SubAdmin======
    // Pending
    builder.addCase(getSubAdmins.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getSubAdmins.fulfilled, (state, action) => {
      state.subAdmins = action.payload;
      state.loading = false;
      state.error = null;
    });
    // Rejected
    builder.addCase(getSubAdmins.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Add SubAdmin======
    // Pending
    builder.addCase(addSubAdmin.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(addSubAdmin.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(addSubAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Update SubAdmin======
    // Pending
    builder.addCase(updateSubAdmin.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(updateSubAdmin.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(updateSubAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Delete SubAdmin======
    // Pending
    builder.addCase(deleteSubAdmin.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(deleteSubAdmin.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(deleteSubAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Change Password======
    // Pending
    builder.addCase(changePassword.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
    });
    // Rejected
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Permissions======
    // Pending
    builder.addCase(getPermissions.pending, (state, action) => {
      state.loading = true;
    });
    // Fulfilled
    builder.addCase(getPermissions.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.permissions = action.payload;
    });
    // Rejected
    builder.addCase(getPermissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ======Get Admin Data======
    // Pending
    builder.addCase(getAdminData.pending, (state, action) => {
      state.loadingAdminData = true;
    });
    // Fulfilled
    builder.addCase(getAdminData.fulfilled, (state, action) => {
      state.loadingAdminData = false;
      state.error = null;
      state.adminData = action.payload.data;
    });
    // Rejected
    builder.addCase(getAdminData.rejected, (state, action) => {
      state.loadingAdminData = false;
      state.error = action.payload;
    });
  },
});

export default subAdminSlice.reducer;
