// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../Redux/Slice";
import authReducer from "./User";
export const store = configureStore({
  reducer: {
    products: productReducer,
    authinfo: authReducer,
  },
});
