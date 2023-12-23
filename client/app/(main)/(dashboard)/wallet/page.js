"use client";

import { Button } from "@material-tailwind/react";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Copy,
  LogOut,
  MapPin,
  QrCode,
  RefreshCcw,
} from "lucide-react";
import { Urbanist } from "next/font/google";
import Image from "next/image";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  return (
    <div className="flex-grow flex flex-col justify-between items-center z-10 max-w-[480px] w-screen p-4 px-5">
      <div className="flex flex-col w-full">
        <h1 className="text-black/50 text-2xl mt-10">Your Balance</h1>
        <div className="flex justify-between items-center">
          <h1 className="text-black/70 text-6xl font-bold mt-3">$50.263</h1>
          <RefreshCcw className="text-black/50 mt-3" size={24} />
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <Button
            className={
              "bg-black/70 rounded-full text-white w-full h-16 text-md relative capitalize font-normal " +
              urbanist.className
            }
          >
            <div className="bg-white absolute top-[3.7px] left-[3px] h-14 w-14 rounded-full flex items-center justify-center">
              <ArrowUpRight className="text-black/80" size={25} />
            </div>
            <p className="ml-8">Transfer</p>
          </Button>
          <Button
            className={
              "bg-black/70 rounded-full text-white w-full h-16 text-md relative capitalize font-normal " +
              urbanist.className
            }
          >
            <div className="bg-white absolute top-[3.7px] left-[3px] h-14 w-14 rounded-full flex items-center justify-center">
              <ArrowDownLeft className="text-black/80" size={25} />
            </div>
            <p className="ml-8">Deposit</p>
          </Button>
          <div>
            <Button className="rounded-full h-16 w-16 bg-black/70 p-0 flex items-center justify-center">
              <ArrowUpDown className="text-white" size={20} />
            </Button>
          </div>
        </div>
        <h1 className="text-black/50 text-2xl mt-7">Your Wallet</h1>
        <div className="w-full border-black/80 border-[1px] flex flex-col rounded-2xl mt-3 p-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-black/50 font-semibold gap-2">
              <Image
                src="/logo.svg"
                width={20}
                height={20}
                alt="logo"
                className="opacity-80"
              />
              VUZI Domain
            </div>
            <Button className="bg-black/70 py-2 px-2">
              <Copy className="text-white" size={15} />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-black/70 text-3xl font-bold">
            mmmmmmmmm@vuzi
          </div>
        </div>
        <div className="w-full border-black/80 border-[1px] flex flex-col rounded-2xl mt-3 p-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-black/50 font-semibold gap-2">
              <MapPin className="opacity-80" size={20} />
              Address
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-black/70 py-2 px-2">
                <Copy className="text-white" size={15} />
              </Button>
              <Button className="bg-black/70 py-2 px-2">
                <QrCode className="text-white" size={15} />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-black/70 text-3xl font-bold">
            0x874b...jn23
          </div>
        </div>
      </div>
      <Button
        color="white"
        size="lg"
        className={
          "mt-8 text-red-500 rounded-full flex items-center font-normal border-red-500 border-[1px] justify-center text-md w-[180px] " +
          urbanist.className
        }
      >
        <>
          <LogOut className="text-red-500" size={14} />
          Logout
        </>
      </Button>
    </div>
  );
}
