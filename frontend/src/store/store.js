import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Users/user-slice";

const store = configureStore({
  reducer: { user: userReducer},
  devTools: process.env.NODE_ENV !== "production",
});

export default store;