"use client";

import { configureStore } from "@reduxjs/toolkit";
import defaultSlice from "./slice/defaultSlice";
import homeSlice from "./slice/homeSlice";
import walletSlice from "./slice/walletSlice";
import dialogSlice from "./slice/dialogSlice";
import transferSlice from "./slice/transferSlice";
import recoverSlice from "./slice/recoverSlice";

export const store = configureStore({
  reducer: {
    default: defaultSlice,
    home: homeSlice,
    wallet: walletSlice,
    dialog: dialogSlice,
    transfer: transferSlice,
    recover: recoverSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
