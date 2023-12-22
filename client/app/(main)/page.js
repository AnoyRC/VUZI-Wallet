"use client";
import { Urbanist } from "next/font/google";
import { Button } from "@material-tailwind/react";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center z-10 transform -mt-16">
      <h1 className={"text-[6rem] font-semibold text-black"}>VUZI</h1>
      <p className="text-black text-2xl -mt-2">The Wallet that your grandma</p>
      <p className="text-black text-4xl ">approves</p>
      <Button
        color="black"
        size="lg"
        className={
          "mt-8 rounded-full h-[140px] w-[140px] flex items-center justify-center text-lg " +
          urbanist.className
        }
      >
        Launch
      </Button>
    </div>
  );
}
