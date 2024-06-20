import { createSlice } from "@reduxjs/toolkit";

export const userCredentialSlice = createSlice({
  name: "userCredential",
  initialState: {},
  reducers: {
    login: (state, action) => {
      state.userCredential=action.payload
    },
    logout: (state, action) => {
      state.userCredential = undefined;
    },
  },
});

export const { login, logout } = userCredentialSlice.actions;
export default userCredentialSlice.reducer;
