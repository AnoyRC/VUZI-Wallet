"use client";
import {
  setPassword,
  setWalletAddress,
  setStep,
  setIsLoading,
} from "@/redux/slice/homeSlice";
import { Gotu } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import useVUZI from "@/hooks/useVUZI";
import Image from "next/image";

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Step1Create() {
  const dispatch = useDispatch();
  const password = useSelector((state) => state.home.password);
  const { socialLogin } = useVUZI();
  const isLoading = useSelector((state) => state.home.isLoading);

  const handleSocialLogin = async () => {
    dispatch(setIsLoading(true));
    const pass_id = await socialLogin();
    if (pass_id) {
      dispatch(setPassword(pass_id));
      dispatch(setStep(2));
    }
    dispatch(setIsLoading(false));
  };

  return (
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
      <Button
        color="white"
        size="lg"
        className={
          "mt-4 rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
          gotu.className
        }
        onClick={() => {
          if (isLoading) return;
          dispatch(setStep(2));
        }}
        disabled={password.length === 0 || !password}
      >
        Continue
      </Button>
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
    </>
  );
}
