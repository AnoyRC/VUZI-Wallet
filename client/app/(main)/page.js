"use client";
import { Urbanist, Gotu } from "next/font/google";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  handleFutureDialog,
  handleHorizonDialog,
  handleIntroDialog,
} from "@/redux/slice/dialogSlice";

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
  const dispatch = useDispatch();
  return (
    <div className="flex-grow flex flex-col items-center justify-center z-10 transform -mt-16">
      <h1 className={"text-[6rem] font-semibold text-black/80"}>VUZI</h1>
      <p className="text-black/80 text-2xl -mt-2 text-center">
        The Wallet that your grandma
      </p>
      <p className="text-black/80 text-4xl ">approves</p>
      <div className="relative z-0">
        <div className="absolute top-[6.3rem] left-[4.3rem] flex items-center justify-center h-[400px] w-[400px] transform -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="circle2"></div>
        </div>
        <Button
          color="black"
          size="lg"
          className={
            "mt-8 rounded-full h-[140px] w-[140px] flex items-center justify-center text-lg bg-[#3b3b3b] z-10 relative " +
            gotu.className
          }
          onClick={() => router.push("/home")}
        >
          Launch
        </Button>
      </div>
      <div
        className=" bg-white w-screen max-w-[480px] h-[80px] min-h-[80px] flex items-start justify-center -mb-4 rounded-t-full fixed bottom-4"
        style={{
          background:
            "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7315126734287465) 35%, rgba(255,255,255,0) 100%)",
        }}
      >
        <div className="flex items-end justify-center gap-7 text-black/50 mt-5">
          <div
            className="hover:text-blue-300 transition-colors duration-200 hover:cursor-pointer mb-0.5"
            onClick={() => {
              dispatch(handleIntroDialog());
            }}
          >
            About
          </div>
          <div
            className="flex flex-col items-center justify-center text-lg font-bold hover:text-blue-300 transition-colors duration-200 hover:cursor-pointer"
            onClick={() => {
              dispatch(handleHorizonDialog());
            }}
          >
            <h2>VICTION</h2>
            <h3 className="-mt-1">HORIZON</h3>
          </div>
          <div
            className="hover:text-blue-300 transition-colors duration-200 hover:cursor-pointer mb-0.5"
            onClick={() => {
              dispatch(handleFutureDialog());
            }}
          >
            Future
          </div>
        </div>
      </div>
    </div>
  );
}
