import { configureStore } from "@reduxjs/toolkit";
import dbSlice from "./db";
import userSlice from "./user";

const store = configureStore({
  reducer: {
    db: dbSlice,
    user: userSlice,
  },
});

export default store;
