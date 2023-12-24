"use client";

import {
  setName,
  setPassword,
  setWalletAddress,
} from "@/redux/slice/walletSlice";
import { Button } from "@material-tailwind/react";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Copy,
  Loader2,
  LogOut,
  MapPin,
  QrCode,
  RefreshCcw,
} from "lucide-react";
import { Urbanist } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { handleQrCodeDialog } from "@/redux/slice/dialogSlice";
import useVUZI from "@/hooks/useVUZI";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const name = useSelector((state) => state.wallet.name);
  const router = useRouter();
  const dispatch = useDispatch();
  const [currencyToggle, setCurrencyToggle] = useState(false);
  const walletData = useSelector((state) => state.wallet.walletData);
  const { socialLogout } = useVUZI();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-[92vh] flex-col justify-between items-center z-10 max-w-[480px] min-w-[350px] w-screen p-4 px-5">
      <div className="flex flex-col w-full h-[90%] overflow-y-auto no-scrollbar">
        <h1 className="text-black/50 text-2xl mt-10">Your Balance</h1>
        <div className="flex justify-between items-center">
          <h1 className="text-black/70 text-6xl font-bold mt-3">
            {walletData
              ? !currencyToggle
                ? "$" +
                  (walletData.balanceNumber * walletData.tomoPrice).toFixed(2)
                : walletData.balanceNumber.toFixed(2) + "VIC"
              : "-.--"}
          </h1>
          <RefreshCcw
            className="text-black/50 mt-3 hover:text-black/20"
            size={24}
            onClick={() => {
              setCurrencyToggle(!currencyToggle);
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <Button
            className={
              "bg-black/70 rounded-full text-white w-full h-16 text-md relative capitalize font-normal " +
              urbanist.className
            }
            onClick={() => {
              router.push("/transfer");
            }}
            style={{
              filter: `contrast(130%) brightness(400%)`,
              background: `linear-gradient(302deg, rgba(0,60,255,1), rgba(0,0,0,0)),
	url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="bg-white border-black border-[1px] absolute top-[3.7px] left-[3px] h-14 w-14 rounded-full flex items-center justify-center">
              <ArrowUpRight className="text-black/80" size={25} />
            </div>
            <p className="ml-8 text-black/80">Transfer</p>
          </Button>
          <Button
            className={
              "bg-black/70 rounded-full text-white w-full h-16 text-md relative capitalize font-normal " +
              urbanist.className
            }
            onClick={() => {
              router.push("/deposit");
            }}
            style={{
              filter: `contrast(140%) brightness(400%)`,
              background: `linear-gradient(302deg, #F525C0, rgba(0,0,0,0)),
	url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="bg-white border-black border-[1px] absolute top-[3.7px] left-[3px] h-14 w-14 rounded-full flex items-center justify-center">
              <ArrowDownLeft className="text-black/80" size={25} />
            </div>
            <p className="ml-8 text-black/80">Deposit</p>
          </Button>
          <div>
            <Button
              className="rounded-full h-16 w-16 border-black border-[1px] shadow-sm bg-black/70 p-0 flex items-center justify-center"
              onClick={() => {
                router.push("/transactions");
              }}
              style={{
                filter: `contrast(130%) brightness(400%)`,
                background: `linear-gradient(302deg, rgba(23,63,0,1), rgba(0,0,0,0)),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            >
              <ArrowUpDown className="text-black/80" size={20} />
            </Button>
          </div>
        </div>
        <h1 className="text-black/50 text-2xl mt-7">Your Wallet</h1>
        <div
          className="w-full border-black/80 border-[1px] flex flex-col rounded-2xl mt-3 p-5 py-3"
          style={{
            filter: `contrast(140%) brightness(400%)`,
            background: `linear-gradient(302deg,rgba(119,56,51,1), rgba(0,0,0,0)),
url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        >
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
            <Button
              className="bg-black/70 py-2 px-2"
              onClick={() => {
                navigator.clipboard.writeText(`${name}@vuzi`);
                toast.success("Domain Copied !");
              }}
            >
              <Copy className="text-white" size={15} />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-black/70 text-3xl font-bold">
            {name.length < 10 ? name : name.slice(0, 6) + "..."}@vuzi
          </div>
        </div>
        <div
          className="w-full border-black/80 border-[1px] flex flex-col rounded-2xl mt-3 p-5 py-3"
          style={{
            filter: `contrast(170%) brightness(400%)`,
            background: `linear-gradient(302deg,rgba(100,55,3,1), rgba(0,0,0,0)),
url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center text-black/50 font-semibold gap-2">
              <MapPin className="opacity-80" size={20} />
              Address
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-black/70 py-2 px-2"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                  toast.success("Address Copied !");
                }}
              >
                <Copy className="text-white" size={15} />
              </Button>
              <Button
                className="bg-black/70 py-2 px-2"
                onClick={() => {
                  dispatch(handleQrCodeDialog());
                }}
              >
                <QrCode className="text-white" size={15} />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-black/70 text-3xl font-bold">
            {walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)}
          </div>
        </div>
      </div>
      <div
        className=" bg-white w-full h-[80px] min-h-[80px] flex items-start justify-center -mb-4 rounded-t-full"
        style={{
          background:
            "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7315126734287465) 35%, rgba(255,255,255,0) 100%)",
        }}
      >
        <Button
          color="white"
          size="lg"
          className={
            "mt-3 text-red-500 rounded-full flex items-center font-normal border-red-500 border-[1px] justify-center text-md w-[180px] " +
            urbanist.className
          }
          onClick={async () => {
            if (isLoading) return;
            setIsLoading(true);
            await socialLogout();
            dispatch(setName(""));
            dispatch(setPassword(""));
            dispatch(setWalletAddress(""));
            router.push("/home");
            toast.success("Logged Out !");
            setIsLoading(false);
          }}
        >
          {isLoading && <Loader2 className="animate-spin" size={24} />}
          {!isLoading && (
            <>
              <LogOut className="text-red-500" size={14} />
              Logout
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
