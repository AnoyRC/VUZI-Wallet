import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
  name: "home",

  initialState: {
    name: "",
    password: "",
    walletAddress: "",
    recoveryCodes: [],
    flow: "Create",
    step: 0,
    isLoading: false,
    isUsed: false,
  },

  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRecoveryCodes: (state, action) => {
      state.recoveryCodes = action.payload;
    },
    setFlow: (state, action) => {
      state.flow = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsUsed: (state, action) => {
      state.isUsed = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
  },
});

export const {
  setName,
  setPassword,
  setRecoveryCodes,
  setFlow,
  setStep,
  setIsLoading,
  setIsUsed,
  setWalletAddress,
} = homeSlice.actions;

export default homeSlice.reducer;
