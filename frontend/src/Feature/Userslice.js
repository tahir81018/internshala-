import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
