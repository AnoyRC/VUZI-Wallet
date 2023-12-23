"use client";

import toast from "react-hot-toast";
import useRelay from "./useRelay";
import axios from "axios";
import { ethers } from "ethers";
import victionTestnet from "@/utils/configs/victionTestnet";
import VUZIFactory from "@/utils/contracts/VUZIFactory";

export default function useVUZI() {
  const { execute } = useRelay();

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

  return {
    deployVUZI,
  };
}
