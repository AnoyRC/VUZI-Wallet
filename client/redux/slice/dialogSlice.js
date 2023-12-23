import { createSlice } from "@reduxjs/toolkit";

const dialogSlice = createSlice({
  name: "dialog",

  initialState: {
    qrCodeDialog: false,
  },

  reducers: {
    handleQrCodeDialog: (state, action) => {
      state.qrCodeDialog = !state.qrCodeDialog;
    },
  },
});

export const { handleQrCodeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
