import { createSlice } from "@reduxjs/toolkit";

const transferSlice = createSlice({
  name: "transfer",

  initialState: {
    amount: "",
    walletAddress: "",
    type: "Unknown",
    domain: "",
    isLoading: false,
  },

  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setDomain: (state, action) => {
      state.domain = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAmount, setWalletAddress, setType, setDomain, setIsLoading } =
  transferSlice.actions;

export default transferSlice.reducer;
