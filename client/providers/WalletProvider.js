"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import useVUZI from "@/hooks/useVUZI";

export default function WalletProvider({ children }) {
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const walletData = useSelector((state) => state.wallet.walletData);
  const { fetchWalletData } = useVUZI();
  useEffect(() => {
    if (walletAddress) fetchWalletData();
  }, [walletAddress]);

  useEffect(() => {
    if (walletData) {
      setTimeout(() => {
        fetchWalletData();
      }, 10000);
    }
  }, [walletData]);

  return <>{children}</>;
}
