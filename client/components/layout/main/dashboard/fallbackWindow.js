"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";
import { LogIn } from "lucide-react";
import { Urbanist } from "next/font/google";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function FallbackWindow() {
  const name = useSelector((state) => state.wallet.name);
  const password = useSelector((state) => state.wallet.password);
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const router = useRouter();

  return (
    !name &&
    !password &&
    !walletAddress && (
      <div className="w-full h-full absolute top-0 left-0 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center z-20 text-black text-xl">
        <Image src="/logo.svg" width={60} height={60} alt="logo" />
        <p className="mt-5"> Oops, you are not logged in.</p>
        <p className=""> Please log in to continue.</p>
        <Button
          color="white"
          size="lg"
          className={
            "mt-8 text-green-500 rounded-full flex items-center font-normal border-green-500 border-[1px] justify-center text-md w-[180px] " +
            urbanist.className
          }
          onClick={() => router.push("/home")}
        >
          <>
            <LogIn className="text-green-500" size={14} />
            Log In
          </>
        </Button>
      </div>
    )
  );
}
