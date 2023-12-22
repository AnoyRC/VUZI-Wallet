"use client";

import { ethers } from "ethers";
import VUZIFactory from "@/utils/contracts/VUZIFactory";
import axios from "axios";
import victionTestnet from "@/utils/configs/victionTestnet";
import VUZIForwarder from "@/utils/contracts/VUZIForwarder";

export default function useRelay() {
  const data712 = async (forwarder, message) => {
    return {
      types: {
        ForwardRequest: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "gas", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint48" },
          { name: "data", type: "bytes" },
        ],
      },
      primaryType: "ForwardRequest",
      domain: {
        name: "VUZIForwarder",
        version: "1",
        verifyingContract: forwarder.address,
        chainId: victionTestnet.chainId,
      },
      message: message,
    };
  };

  const execute = async (data) => {
    const keyPair = ethers.Wallet.createRandom();

    const provider = new ethers.providers.JsonRpcProvider(
      victionTestnet.rpcUrl
    );

    // const factory = new ethers.Contract(
    //   victionTestnet.VUZIFactory,
    //   VUZIFactory.abi,
    //   provider
    // );

    // const data = factory.interface.encodeFunctionData("executeVUZITx", [
    //     "Anoy",
    //     [
    //       [
    //         "0x07f60fa83e9a7ec456fc02b93f6c25bf5a257ee9b24d3952bcae3fa3cf1485fb",
    //         "0x0fcbcb9a2c1e1c81f9a406412eebd82281d0a3a303d21de4c39a38976d4590b0",
    //       ],
    //       [
    //         [
    //           "0x2f42d01aea3cd833384f64e5ff45e3a1cc14eb6a38747c2c5c59699baea493f4",
    //           "0x185b9e3c7804fc9b3207c08d14c4357816dd1421bf97331c19f82b9b79264406",
    //         ],
    //         [
    //           "0x2f1a93b4ceaa8d0bb9d89af4f72a4dcced0e0195a557f33d1688359adbde18c6",
    //           "0x1607ff7a23657e5e97b463f8dd1782688da88a56ad0ef3ebe73c44d857686141",
    //         ],
    //       ],
    //       [
    //         "0x0e6c10226318c5e599c7a6806d0693262a41cf39e423d2967c862dd044f53c13",
    //         "0x11a3f55f9c420c584d24cce7241bf15fb302996a260fa0da949dfbba4ed216b8",
    //       ],
    //     ],
    //     "0xDb1d125C9f7faE45d7CeE470d048670a85270f4D",
    //     ethers.utils.parseEther("2"),
    //     "0x",
    //   ]);

    const forwarder = new ethers.Contract(
      victionTestnet.VUZIForwarder,
      VUZIForwarder.abi,
      provider
    );

    const message = {
      from: keyPair.address,
      to: victionTestnet.VUZIFactory,
      value: 0,
      gas: 1000000,
      nonce: Number(await forwarder.nonces(keyPair.address)),
      deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
      data: data,
    };

    const forwardRequestData = await data712(forwarder, message);

    const signature = await keyPair._signTypedData(
      forwardRequestData.domain,
      forwardRequestData.types,
      forwardRequestData.message
    );

    const forwardRequest = {
      from: message.from,
      to: message.to,
      value: message.value,
      gas: message.gas,
      deadline: message.deadline,
      data: message.data,
      signature: signature,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/relay`,
      {
        forwardRequest,
      },
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    console.log(response.data);
  };

  return {
    execute,
  };
}
