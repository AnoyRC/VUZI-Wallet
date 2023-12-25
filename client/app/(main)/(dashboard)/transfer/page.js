"use client";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardPaste,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { Urbanist } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  setAmount,
  setDomain,
  setType,
  setWalletAddress,
} from "@/redux/slice/transferSlice";
import { useState } from "react";
import useReadContract from "@/hooks/useReadContract";
import toast from "react-hot-toast";
import { handleTransferDialog } from "@/redux/slice/dialogSlice";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  const router = useRouter();
  const walletData = useSelector((state) => state.wallet.walletData);
  const dispatch = useDispatch();
  const amount = useSelector((state) => state.transfer.amount);
  const type = useSelector((state) => state.transfer.type);
  const walletAddress = useSelector((state) => state.transfer.walletAddress);
  const [address, setAddress] = useState("");
  const { getVuziWallet } = useReadContract();
  const selfAddress = useSelector((state) => state.wallet.walletAddress);

  const handleAmount = (e) => {
    const value = e.target.value;
    dispatch(setAmount(value.replace(/[^0-9.]/g, "")));
  };

  const handleWalletAddress = async (e) => {
    const value = e;
    if (value.length === 42 && value.startsWith("0x")) {
      dispatch(setWalletAddress(value));
      dispatch(setType("Address"));
      setAddress(value.substring(0, 6) + "..." + value.substring(38, 42));
      return;
    }
    if (value.split("@").length === 2) {
      if (value.split("@")[1] === "vuzi") {
        const walletAddress = await getVuziWallet(value.split("@")[0]);
        if (walletAddress !== "0x0000000000000000000000000000000000000000") {
          dispatch(setWalletAddress(walletAddress));
          dispatch(setDomain(value.split("@")[0]));
          dispatch(setType("Vuzi"));
          setAddress(value);
          return;
        }
      }
    }
    dispatch(setType("Unknown"));
    setAddress(value);
  };

  const handleTransfer = () => {
    if (amount === "") {
      toast.error("Please enter an amount");
      return;
    }

    if (amount === "0") {
      toast.error("Please enter an amount greater than 0");
      return;
    }

    if (type === "Unknown") {
      toast.error("Please enter a valid address or domain");
      return;
    }
    if (Number(amount) > Number(walletData.balanceNumber)) {
      toast.error("You don't have enough funds");
      return;
    }
    if (walletAddress === selfAddress) {
      toast.error("You can't send to yourself");
      return;
    }
    dispatch(handleTransferDialog());
  };

  return (
    <>
      <div className="flex h-[92vh] flex-col justify-between items-center z-10 max-w-[480px] min-w-[350px] w-screen p-4 px-5">
        <div className="flex flex-col w-full h-[90%] overflow-y-auto no-scrollbar">
          <h1 className="text-black/50 text-2xl mt-10">Send</h1>
          <div
            className="w-full flex flex-col border-black border-[1px] rounded-3xl mt-3 p-5"
            style={{
              filter: `contrast(120%) brightness(1200%)`,
              background: `linear-gradient(322deg, rgba(255,19,0,1), rgba(0,0,0,0)),
             url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.18' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="bg-black/70 flex items-center justify-center p-3 rounded-2xl ">
                <Image src="/viction.svg" width={30} height={30} alt="VIC" />
              </div>
              <div className="flex flex-col justify-between">
                <h1 className="text-black/70 text-xl font-semibold">VIC</h1>
                <h3 className="text-black/70 text-md font-normal">
                  1 VIC = $
                  {walletData && walletData.tomoPrice
                    ? walletData.tomoPrice.toFixed(2)
                    : "-.--"}
                </h3>
              </div>
            </div>
            <input
              className="w-full text-4xl mt-3 outline-none bg-transparent placeholder:text-black/70"
              placeholder="Enter amount"
              type="text"
              value={amount}
              onChange={(e) => handleAmount(e)}
              style={{
                color:
                  walletData &&
                  walletData.balanceNumber &&
                  Number(amount) > Number(walletData.balanceNumber)
                    ? "red"
                    : "black",
              }}
            ></input>
            <h3
              className="text-black/90 mt-2 hover:text-black/70 hover:cursor-pointer w-fit"
              onClick={() => {
                dispatch(setAmount(walletData.balanceNumber.toFixed(2)));
              }}
            >
              Balance:{" "}
              {walletData && walletData.balanceNumber
                ? walletData.balanceNumber.toFixed(2)
                : "0.00"}{" "}
              VIC
            </h3>
          </div>

          <h1 className="text-black/50 text-2xl mt-4">To</h1>
          <div
            className="w-full flex flex-col border-black border-[1px] rounded-3xl mt-3 p-5"
            style={{
              filter: `contrast(140%) brightness(1200%)`,
              background: `linear-gradient(322deg, rgba(37,19,100,1), rgba(0,0,0,0)),
             url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.18' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="bg-black/70 flex items-center justify-center p-3 rounded-2xl ">
                {type === "Unknown" && <HelpCircle size={30} />}
                {type === "Vuzi" && (
                  <Image
                    src="/logoWhite.svg"
                    width={30}
                    height={30}
                    alt="VIC"
                  />
                )}
                {type === "Address" && <MapPin size={30} />}
              </div>

              <div className="flex flex-col justify-between">
                <h1 className="text-black/70 text-xl font-semibold">Type</h1>
                <h3 className="text-black/70 text-md font-normal">{type}</h3>
              </div>
            </div>

            <input
              className="w-full text-4xl mt-3 outline-none bg-transparent placeholder:text-black/80"
              placeholder="Enter Address / domain"
              type="text"
              value={address}
              onChange={(e) => handleWalletAddress(e.target.value)}
              style={{
                color: type === "Unknown" ? "red" : "black",
                opacity: "0.7",
              }}
            ></input>
            <h3 className="text-black/80 mt-2">
              Add @vuzi to send to a domain
            </h3>
          </div>

          <Button
            color="white"
            size="lg"
            className={
              "mt-5 rounded-full min-h-[56px] flex items-center justify-center text-lg w-full border-[1px] border-black font-normal text-black/90 " +
              urbanist.className
            }
            style={{
              filter: `contrast(140%) brightness(1200%)`,
              background: `linear-gradient(322deg, rgba(20,33,146,1), rgba(0,0,0,0)),
             url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.18' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
            onClick={() => {
              handleTransfer();
            }}
          >
            Transfer
            <ArrowUpRight className="text-black/80" size={24} />
          </Button>
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
              dispatch(setAmount(""));
              dispatch(setWalletAddress(""));
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
