import { createSlice } from "@reduxjs/toolkit";

const dialogSlice = createSlice({
  name: "dialog",

  initialState: {
    qrCodeDialog: false,
    transferDialog: false,
  },

  reducers: {
    handleQrCodeDialog: (state, action) => {
      state.qrCodeDialog = !state.qrCodeDialog;
    },
    handleTransferDialog: (state, action) => {
      state.transferDialog = !state.transferDialog;
    },
  },
});

export const { handleQrCodeDialog, handleTransferDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
