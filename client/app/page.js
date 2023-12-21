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

    const data = factory.interface.encodeFunctionData("createAccount", [
      "Alphari",
      [
        31396770208772612508552346899233388693n,
        323227833671889142828925098642703984398n,
      ],
      [
        7649268436029999033432724562176241441585742834353376427803511027476507786355n,
        843948673564749010130009152217412328975915860749537251523689920335409026238n,
        15398313650319423783979061366224719296432284328109033603853874538100736649297n,
        11991271717964860371624148685299858096373834534283963606388462822219173294746n,
      ],
      "1",
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
