"use client";

import { configureStore } from "@reduxjs/toolkit";
import defaultSlice from "./slice/defaultSlice";
import homeSlice from "./slice/homeSlice";
import walletSlice from "./slice/walletSlice";
import dialogSlice from "./slice/dialogSlice";

export const store = configureStore({
  reducer: {
    default: defaultSlice,
    home: homeSlice,
    wallet: walletSlice,
    dialog: dialogSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
