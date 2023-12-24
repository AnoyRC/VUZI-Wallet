"use client";

import toast from "react-hot-toast";
import useRelay from "./useRelay";
import axios from "axios";
import { ethers } from "ethers";
import victionTestnet from "@/utils/configs/victionTestnet";
import VUZIFactory from "@/utils/contracts/VUZIFactory";
import { useDispatch, useSelector } from "react-redux";
import { setWalletData } from "@/redux/slice/walletSlice";
import { createAuth0Client } from "@auth0/auth0-spa-js";

export default function useVUZI() {
  const { execute } = useRelay();
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.wallet.walletAddress);

  const deployVUZI = async (recoveryCodes, password, name) => {
    try {
      const pwBody = {
        password: password,
      };

      const pwHashResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/zkops/passcode/hash`,
        pwBody
      );

      const pwHash = pwHashResponse.data.passwordHash;

      if (!pwHash) {
        throw new Error("Password Hash not found");
      }

      const recoveryCodesBody = {
        recoveryArray: recoveryCodes,
      };

      const recoveryCodesResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/zkops/recovery/hash`,
        recoveryCodesBody
      );

      const recoveryCodesHash = recoveryCodesResponse.data.recoveryHashes;

      if (!recoveryCodesHash) {
        throw new Error("Recovery Codes Hash not found");
      }

      const provider = new ethers.providers.JsonRpcProvider(
        victionTestnet.rpcUrl
      );

      const factory = new ethers.Contract(
        victionTestnet.VUZIFactory,
        VUZIFactory.abi,
        provider
      );

      const data = factory.interface.encodeFunctionData("createAccount", [
        name,
        pwHash,
        recoveryCodesHash,
        1,
      ]);

      await execute(data);

      toast.success("VUZI Deployed");

      return true;
    } catch (err) {
      console.log(err);
      toast.error("VUZI Deployment Failed");
      return false;
    }
  };

  const fetchWalletData = async () => {
    const response = await axios.get(
      `https://scan-api-testnet.viction.xyz/api/account/${walletAddress}`
    );
    dispatch(setWalletData(response.data));
  };

  const socialLogin = async () => {
    try {
      const auth0Client = await createAuth0Client({
        domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      });

      const login = async () => {
        await auth0Client.loginWithPopup({
          authorizationParams: {
            redirect_uri: window.location.origin,
          },
        });
      };

      await login();

      const isAuthenticated = await auth0Client.isAuthenticated();

      if (isAuthenticated) {
        const user = await auth0Client.getUser();

        if (!user.sub) return false;
        return user.sub;
      }

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const socialLogout = async () => {
    const auth0Client = await createAuth0Client({
      domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    });

    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return {
    deployVUZI,
    fetchWalletData,
    socialLogin,
    socialLogout,
  };
}
