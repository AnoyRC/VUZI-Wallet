"use client";

import { configureStore } from "@reduxjs/toolkit";
import defaultSlice from "./slice/defaultSlice";
import homeSlice from "./slice/homeSlice";

export const store = configureStore({
  reducer: {
    default: defaultSlice,
    home: homeSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
