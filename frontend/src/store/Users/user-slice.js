import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userID: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    userRequest(state) {
      state.loading = true;
    },
    userSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.userID = action.payload;
    },
    userFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    userReset(state) {
      state.success = false;
      state.error = false;
      state.loading = false;
    },
    userLogout(state) {
      state.userInfo = null;
    },
  },
});

export const userActions = UserSlice.actions;
export default UserSlice.reducer;