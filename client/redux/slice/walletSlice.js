import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",

  initialState: {
    name: "",
    password: "",
    walletAddress: "",
    walletData: null,
  },

  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setWalletData: (state, action) => {
      state.walletData = action.payload;
    },
  },
});

export const { setName, setPassword, setWalletAddress, setWalletData } =
  walletSlice.actions;

export default walletSlice.reducer;
