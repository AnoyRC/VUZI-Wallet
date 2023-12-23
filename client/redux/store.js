"use client";

import { configureStore } from "@reduxjs/toolkit";
import defaultSlice from "./slice/defaultSlice";
import homeSlice from "./slice/homeSlice";
import walletSlice from "./slice/walletSlice";

export const store = configureStore({
  reducer: {
    default: defaultSlice,
    home: homeSlice,
    wallet: walletSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
