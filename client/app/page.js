"use client";
import { Button } from "@material-tailwind/react";
import { ethers } from "ethers";
import VUZIFactory from "@/utils/contracts/VUZIFactory";
import axios from "axios";
import victionTestnet from "@/utils/configs/victionTestnet";
import VUZIForwarder from "@/utils/contracts/VUZIForwarder";

// ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,uint48 deadline,bytes data)

export default function Home() {
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

  const execute = async () => {
    const keyPair = ethers.Wallet.createRandom();

    const provider = new ethers.providers.JsonRpcProvider(
      victionTestnet.rpcUrl
    );

    const factory = new ethers.Contract(
      victionTestnet.VUZIFactory,
      VUZIFactory.abi,
      provider
    );

    const forwarder = new ethers.Contract(
      victionTestnet.VUZIForwarder,
      VUZIForwarder.abi,
      provider
    );

    const data = factory.interface.encodeFunctionData("executeVUZITx", [
      "Anoy",
      [
        [
          "0x0474225023b278b2bbfb955508e5d59dc75f340360a297cd41440ede8925976c",
          "0x1bda46801ae0defb35a9152e3f148478c39077a8ed0576131f43e967c53e6f1c",
        ],
        [
          [
            "0x05d925b73d820af0d418a80f482d5220ebee8c4250a65a82eeef16b42b301b7e",
            "0x18e068f8f26c598f7edb60da628f0d2b5616bb52d4a5391eca64cf2ebb72a33f",
          ],
          [
            "0x16261de985237714070f6715a7a5a116fc1e373a3a8e1a05c8aaa1937def0150",
            "0x1a3f62cb681030dc89e5b462fd45f1ced8a62b140243d0c6f8715dacb43fceaa",
          ],
        ],
        [
          "0x29667aea2ad917b6f11e0dbc4c05f0451c9f7e24ffd1c1f7191c258439e44164",
          "0x1dfad8a8536f06909b75171a3e80bc2159741113b0641ca5ad71198180643696",
        ],
      ],
      "0xDb1d125C9f7faE45d7CeE470d048670a85270f4D",
      ethers.utils.parseEther("2"),
      "0x",
    ]);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button color="blue" onClick={execute}>
        Create Wallet
      </Button>
    </main>
  );
}
