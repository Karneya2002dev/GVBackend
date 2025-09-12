// src/Redux/User.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated:false
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // contains email, password, role
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },},
});

export const { login, logout ,setUser } = userSlice.actions;
export default userSlice.reducer;
