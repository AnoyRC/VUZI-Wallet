"use client";
import { Button } from "@material-tailwind/react";
import { Gotu } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setPassword as setPass,
  setWalletAddress as setAddress,
} from "@/redux/slice/walletSlice";
import {
  setPassword,
  setStep,
  setWalletAddress,
} from "@/redux/slice/homeSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Step3Create() {
  const dispatch = useDispatch();
  const password = useSelector((state) => state.home.password);
  const name = useSelector((state) => state.home.name);
  const walletAddress = useSelector((state) => state.home.walletAddress);
  const router = useRouter();

  return (
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
        <Image src="/logo.svg" alt="Logo" width={50} height={50} className="" />
      </Button>
    </div>
  );
}
