"use client";
import { Urbanist, Gotu } from "next/font/google";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex-grow flex flex-col items-center justify-center z-10 transform -mt-16">
      <h1 className={"text-[6rem] font-semibold text-black/80"}>VUZI</h1>
      <p className="text-black/80 text-2xl -mt-2">
        The Wallet that your grandma
      </p>
      <p className="text-black/80 text-4xl ">approves</p>
      <Button
        color="black"
        size="lg"
        className={
          "mt-8 rounded-full h-[140px] w-[140px] flex items-center justify-center text-lg bg-black/80 " +
          gotu.className
        }
        onClick={() => router.push("/home")}
      >
        Launch
      </Button>
    </div>
  );
}
