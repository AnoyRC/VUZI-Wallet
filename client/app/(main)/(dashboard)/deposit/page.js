"use client";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Info, Loader2 } from "lucide-react";
import { Urbanist } from "next/font/google";
import { useSelector } from "react-redux";
import Image from "next/image";
import { MapPin, Copy, QrCode } from "lucide-react";
import { handleQrCodeDialog } from "@/redux/slice/dialogSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import useVUZI from "@/hooks/useVUZI";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  const router = useRouter();
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const name = useSelector((state) => state.wallet.name);
  const dispatch = useDispatch();
  const walletData = useSelector((state) => state.wallet.walletData);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchWalletData } = useVUZI();

  const drip = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/relay/drip/${walletAddress}`
      );

      if (response.data.success) {
        toast.success("Drip successful!");
      } else {
        toast.error(response.data.error);
      }
    } catch (e) {
      console.log(e);
      toast.error("Drip failed!");
    } finally {
      setIsLoading(false);
      fetchWalletData();
    }
  };

  return (
    <>
      <div className="flex h-[92vh] flex-col justify-between items-center z-10 max-w-[480px] min-w-[350px] w-screen p-4 px-5">
        <div className="flex flex-col w-full h-[90%] overflow-y-auto no-scrollbar">
          <h1 className="text-black/50 text-2xl mt-10">Faucet</h1>

          <Button
            color="white"
            className={
              "mt-3 border-black border-[1px] h-[100px] text-5xl text-black/50 flex items-center justify-center " +
              urbanist.className
            }
            style={{
              filter: `contrast(170%) brightness(400%)`,
              background: `linear-gradient(302deg,rgba(49,100,3,1), rgba(0,0,0,0)),
  url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
            disabled={walletData && walletData.balanceNumber > 0.1}
            onClick={() => {
              if (!isLoading) drip();
            }}
          >
            {" "}
            {isLoading ? (
              <Loader2 className="animate-spin text-black/50" size={40} />
            ) : (
              "+ 0.5 VIC"
            )}
          </Button>

          {walletData && walletData.balanceNumber > 0.1 && (
            <div className="flex w-full mt-5 gap-3">
              <AlertTriangle className="text-red-500 -mt-1" size={40} />
              <p className="text-black/70">
                Your balance is sufficient to test the prototype. You are
                eligible for another drip if your balance is less than 0.1
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 text-black/80 mt-5">
            <div className="w-full bg-black h-[1px]" /> OR
            <div className="w-full bg-black h-[1px]" />
          </div>

          <h1 className="text-black/50 text-2xl mt-5">Your Wallet</h1>

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
          <div className="flex w-full mt-5 gap-3">
            <Info className="text-black/70 -mt-1" size={40} />
            <p className="text-black/70">
              Ask your friends to send you some VIC to any of the above address,
              VUZI domains only works on VUZI wallet.
            </p>
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
              "mt-3 text-black/80 rounded-full flex items-center font-normal border-black/80 border-[1px] justify-center text-md w-[180px] z-10 " +
              urbanist.className
            }
            onClick={() => {
              router.push("/wallet");
            }}
          >
            <>
              <ArrowLeft className="text-black/80" size={14} />
              Back
            </>
          </Button>
        </div>
      </div>
    </>
  );
}
