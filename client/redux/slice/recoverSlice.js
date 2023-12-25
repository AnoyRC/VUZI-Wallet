import { createSlice } from "@reduxjs/toolkit";

const recoverSlice = createSlice({
  name: "default",

  initialState: {
    name: "",
    password: "",
    recoveryCode: "",
    walletAddress: "",
    isLoading: false,
  },

  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRecoveryCode: (state, action) => {
      state.recoveryCode = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setName,
  setPassword,
  setRecoveryCode,
  setWalletAddress,
  setIsLoading,
} = recoverSlice.actions;

export default recoverSlice.reducer;
