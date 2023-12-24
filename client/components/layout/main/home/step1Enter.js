"use client";
import useReadContract from "@/hooks/useReadContract";
import {
  setIsLoading,
  setPassword,
  setStep,
  setWalletAddress,
} from "@/redux/slice/homeSlice";
import {
  setWalletAddress as setAddress,
  setPassword as setPass,
} from "@/redux/slice/walletSlice";
import { Button } from "@material-tailwind/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Gotu } from "next/font/google";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import { setName } from "@/redux/slice/walletSlice";
import { useRouter } from "next/navigation";
import useVUZI from "@/hooks/useVUZI";

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Step1Enter() {
  const dispatch = useDispatch();
  const password = useSelector((state) => state.home.password);
  const walletAddress = useSelector((state) => state.home.walletAddress);
  const name = useSelector((state) => state.home.name);
  const { verifyPassword } = useReadContract();
  const isLoading = useSelector((state) => state.home.isLoading);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const { socialLogin } = useVUZI();

  const handleVerifyPassword = async () => {
    dispatch(setIsLoading(true));
    const isVerified = await verifyPassword(walletAddress, password, name);
    setVerified(isVerified);
    if (isVerified) {
      toast.success("VUZI Initialized");
    }
    dispatch(setIsLoading(false));
  };

  const handleSocialLogin = async () => {
    dispatch(setIsLoading(true));
    const pass_id = await socialLogin();
    if (pass_id) {
      dispatch(setPassword(pass_id));
      const isVerified = await verifyPassword(walletAddress, pass_id, name);
      setVerified(isVerified);
      if (isVerified) {
        toast.success("VUZI Initialized");
      }
    }
    dispatch(setIsLoading(false));
  };

  return (
    <>
      {!verified && (
        <>
          <Button
            color="white"
            size="lg"
            className={
              " rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
              gotu.className
            }
            onClick={() => {
              if (isLoading) return;
              handleSocialLogin();
            }}
          >
            {isLoading && <Loader2 className="animate-spin" size={24} />}
            {!isLoading && (
              <>
                <Image src="/google.svg" alt="Logo" width={20} height={20} />
                Socials
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-3 w-[150px] text-black/80  mt-6 mb-5">
            <div className="w-full bg-black h-[1px]" /> OR
            <div className="w-full bg-black h-[1px]" />
          </div>

          <div className="flex items-center">
            <input
              className={
                "text-black/80 text-5xl focus:outline-none bg-transparent text-center block m-auto" +
                gotu.className
              }
              placeholder={"********"}
              type="password"
              value={password}
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
              }}
            ></input>
          </div>
        </>
      )}
      <div className="flex flex-col items-center">
        {!verified && (
          <Button
            color="white"
            size="lg"
            className={
              "mt-8 rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
              gotu.className
            }
            onClick={() => {
              if (isLoading) return;
              handleVerifyPassword();
            }}
            disabled={password.length === 8 || !password}
          >
            {isLoading && (
              <Loader2 className="animate-spin text-black" size={27.9} />
            )}
            {!isLoading && (
              <>
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className=""
                />
                Launch
              </>
            )}
          </Button>
        )}

        {verified && (
          <div className="relative">
            <div className="circles absolute top-9 left-[5.5rem] transform -translate-x-1/2 -translate-y-1/2 z-0">
              <div className="circle1"></div>
            </div>
            <Button
              color="black"
              size="lg"
              className={
                "-mt-14 rounded-full h-[180px] w-[180px] flex items-center justify-center text-lg bg-[#c3fb6d] relative z-10 " +
                gotu.className
              }
              onClick={() => {
                dispatch(setName(name));
                dispatch(setPass(password));
                dispatch(setAddress(walletAddress));
                dispatch(setPassword(""));
                dispatch(setWalletAddress(""));
                dispatch(setStep(0));
                router.push("/wallet");
              }}
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={50}
                height={50}
                className=""
              />
            </Button>
          </div>
        )}

        {!verified && (
          <Button
            color="black"
            size="lg"
            className={
              "mt-4 rounded-full flex items-center justify-center text-lg w-[180px] " +
              gotu.className
            }
            onClick={() => {
              if (isLoading) return;
              dispatch(setPassword(""));
              dispatch(setWalletAddress(""));
              dispatch(setStep(0));
            }}
          >
            <ArrowLeft size={24} className="" /> Back
          </Button>
        )}
      </div>
    </>
  );
}
