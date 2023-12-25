import { createSlice } from "@reduxjs/toolkit";

const dialogSlice = createSlice({
  name: "dialog",

  initialState: {
    qrCodeDialog: false,
    transferDialog: false,
    recoverDialog: false,
  },

  reducers: {
    handleQrCodeDialog: (state, action) => {
      state.qrCodeDialog = !state.qrCodeDialog;
    },
    handleTransferDialog: (state, action) => {
      state.transferDialog = !state.transferDialog;
    },
    handleRecoverDialog: (state, action) => {
      state.recoverDialog = !state.recoverDialog;
    },
  },
});

export const { handleQrCodeDialog, handleTransferDialog, handleRecoverDialog } =
  dialogSlice.actions;

export default dialogSlice.reducer;
