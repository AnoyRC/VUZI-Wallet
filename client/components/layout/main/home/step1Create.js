"use client";
import {
  setPassword,
  setWalletAddress,
  setStep,
} from "@/redux/slice/homeSlice";
import { Gotu } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Step1Create() {
  const dispatch = useDispatch();
  const password = useSelector((state) => state.home.password);

  return (
    <>
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
          "mt-8 rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
          gotu.className
        }
        onClick={() => {
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
