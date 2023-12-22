"use client";
import victionTestnet from "@/utils/configs/victionTestnet";
import VUZI from "@/utils/contracts/VUZI";
import VUZIFactory from "@/utils/contracts/VUZIFactory";
import axios from "axios";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function useReadContract() {
  const getVuzi = async (name) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        victionTestnet.rpcUrl
      );

      const factory = new ethers.Contract(
        victionTestnet.VUZIFactory,
        VUZIFactory.abi,
        provider
      );

      const vuzi = await factory.getVuzi(name);

      return vuzi.isUsed;
    } catch (e) {
      toast.error("Error Fetching Vuzi");
      return false;
    }
  };

  const getVuziWallet = async (name) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        victionTestnet.rpcUrl
      );

      const factory = new ethers.Contract(
        victionTestnet.VUZIFactory,
        VUZIFactory.abi,
        provider
      );

      const vuzi = await factory.getVuzi(name);

      return vuzi.walletAddress;
    } catch (e) {
      toast.error("Error Fetching Vuzi");
      return "";
    }
  };

  const verifyPassword = async (walletAddress, password, name) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        victionTestnet.rpcUrl
      );

      const VUZIWallet = new ethers.Contract(walletAddress, VUZI.abi, provider);

      const factory = new ethers.Contract(
        victionTestnet.VUZIFactory,
        VUZIFactory.abi,
        provider
      );

      const currentNonce = (await VUZIWallet.getNonce()).toString();

      const passwordHash1 = (await VUZIWallet.passwordHash(0)).toString();
      const passwordHash2 = (await VUZIWallet.passwordHash(1)).toString();

      const body = {
        password: password,
        passwordHashes: [passwordHash1, passwordHash2],
        nonce: currentNonce,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/zkops/passcode/verify`,
        body
      );

      if (!response.data.proof) {
        throw new Error("Proof Not verified");
      }

      const isVertified = await factory.verifyVUZIPassword(
        name,
        response.data.proof
      );

      return isVertified;
    } catch (e) {
      toast.error("Error Verifying Password");
      return false;
    }
  };

  return { getVuzi, getVuziWallet, verifyPassword };
}
