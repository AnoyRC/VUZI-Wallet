import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",

  initialState: {
    name: "",
    password: "",
    walletAddress: "",
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
  },
});

export const { setName, setPassword, setWalletAddress } = walletSlice.actions;

export default walletSlice.reducer;
